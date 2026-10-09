import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  AppState,
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import Timer from '../components/Timer';
import QuestionCard from '../components/QuestionCard';
import AppButton from '../components/AppButton';
import questions from '../data/questions';
import storageService from '../services/storageService';
import {createQuizResult, getRemainingSeconds} from '../utils/quizHelper';
import {
  CANDIDATE_PROFILE,
  COLORS,
  EXAM_DETAILS,
  STORAGE_KEYS,
} from '../constants/appConstants';

export default function QuizScreen({navigation}) {
  const scrollRef = useRef(null);
  const questionPositions = useRef({});
  const startTimeRef = useRef(null);
  const submissionInProgress = useRef(false);
  const hasLoaded = useRef(false);

  const [profile, setProfile] = useState(CANDIDATE_PROFILE);
  const [answers, setAnswers] = useState({});
  const [remainingSeconds, setRemainingSeconds] = useState(60 * 60);
  const [loading, setLoading] = useState(true);
  const [highlightUnanswered, setHighlightUnanswered] = useState(false);

  const answeredCount = Object.values(answers).filter(
    value => value !== undefined && value !== null,
  ).length;
  const unansweredCount = questions.length - answeredCount;

  const scrollToFirstUnanswered = useCallback(() => {
    const unansweredQuestion = questions.find(
      question => answers[question.id] === undefined || answers[question.id] === null,
    );
    if (!unansweredQuestion) {
      return;
    }
    const y = questionPositions.current[unansweredQuestion.id] || 0;
    scrollRef.current?.scrollTo({y: Math.max(y - 10, 0), animated: true});
  }, [answers]);

  const submitQuiz = useCallback(
    async isAutomatic => {
      if (submissionInProgress.current || !startTimeRef.current) {
        return;
      }
      submissionInProgress.current = true;

      const result = createQuizResult({
        questions,
        answers,
        profile,
        startTime: startTimeRef.current,
      });

      const saved = await Promise.all([
        storageService.set(STORAGE_KEYS.QUIZ_RESULT, result),
        storageService.set(STORAGE_KEYS.QUIZ_SUBMITTED, true),
        storageService.remove(STORAGE_KEYS.QUIZ_START_TIME),
        storageService.remove(STORAGE_KEYS.QUIZ_ANSWERS),
      ]);

      if (saved.slice(0, 2).some(value => !value)) {
        submissionInProgress.current = false;
        Alert.alert('Submission error', 'The quiz could not be saved. Please try again.');
        return;
      }

      navigation.reset({index: 0, routes: [{name: 'Result', params: {automatic: isAutomatic}}]});
    },
    [answers, navigation, profile],
  );

  useEffect(() => {
    let active = true;

    const initialiseQuiz = async () => {
      const [isSubmitted, storedAnswers, storedStartTime, storedProfile] = await Promise.all([
        storageService.get(STORAGE_KEYS.QUIZ_SUBMITTED, false),
        storageService.get(STORAGE_KEYS.QUIZ_ANSWERS, {}),
        storageService.get(STORAGE_KEYS.QUIZ_START_TIME),
        storageService.get(STORAGE_KEYS.USER_PROFILE, CANDIDATE_PROFILE),
      ]);

      if (!active) {
        return;
      }

      if (isSubmitted) {
        navigation.reset({index: 0, routes: [{name: 'Result'}]});
        return;
      }

      const startTime = storedStartTime || Date.now();
      startTimeRef.current = Number(startTime);
      setAnswers(storedAnswers || {});
      setProfile(storedProfile || CANDIDATE_PROFILE);
      setRemainingSeconds(getRemainingSeconds(startTime));

      if (!storedStartTime) {
        await storageService.set(STORAGE_KEYS.QUIZ_START_TIME, startTime);
      }

      hasLoaded.current = true;
      setLoading(false);
    };

    initialiseQuiz();
    return () => {
      active = false;
    };
  }, [navigation]);

  useEffect(() => {
    if (!hasLoaded.current) {
      return;
    }
    storageService.set(STORAGE_KEYS.QUIZ_ANSWERS, answers);
  }, [answers]);

  useEffect(() => {
    if (loading) {
      return undefined;
    }

    const updateRemainingTime = () => {
      const nextRemaining = getRemainingSeconds(startTimeRef.current);
      setRemainingSeconds(nextRemaining);
      if (nextRemaining <= 0) {
        submitQuiz(true);
      }
    };

    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);
    const appStateSubscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        updateRemainingTime();
      }
    });

    return () => {
      clearInterval(interval);
      appStateSubscription.remove();
    };
  }, [loading, submitQuiz]);

  useEffect(() => {
    const showBackWarning = () => {
      Alert.alert(
        'Quiz in progress',
        'You cannot leave this screen while the examination is active. Submit the quiz to finish.',
        [{text: 'Continue Quiz'}],
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', showBackWarning);
    const removeListener = navigation.addListener('beforeRemove', event => {
      if (submissionInProgress.current) {
        return;
      }
      event.preventDefault();
      showBackWarning();
    });

    return () => {
      backHandler.remove();
      removeListener();
    };
  }, [navigation]);

  const handleManualSubmit = () => {
    setHighlightUnanswered(unansweredCount > 0);
    Alert.alert(
      'Submit Quiz',
      `You have answered ${answeredCount} out of ${questions.length} questions. Are you sure you want to submit the quiz?`,
      [
        {
          text: 'Continue Quiz',
          style: 'cancel',
          onPress: () => {
            if (unansweredCount > 0) scrollToFirstUnanswered();
          },
        },
        {text: 'Submit Now', style: 'destructive', onPress: () => submitQuiz(false)},
      ],
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <Text style={styles.loadingText}>Loading quiz...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title={EXAM_DETAILS.examinationName}
        subtitle={profile.name}
        compact
        rightContent={<Timer remainingSeconds={remainingSeconds} />}
      />

      <View style={styles.fixedSummary}>
        <View style={styles.summaryItem}><Text style={styles.summaryValue}>{questions.length}</Text><Text style={styles.summaryLabel}>Total</Text></View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}><Text style={[styles.summaryValue, {color: COLORS.success}]}>{answeredCount}</Text><Text style={styles.summaryLabel}>Answered</Text></View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}><Text style={[styles.summaryValue, {color: COLORS.warning}]}>{unansweredCount}</Text><Text style={styles.summaryLabel}>Unanswered</Text></View>
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {questions.map(question => (
            <QuestionCard
              key={question.id}
              question={question}
              selectedAnswer={answers[question.id]}
              onSelect={optionIndex => setAnswers(current => ({...current, [question.id]: optionIndex}))}
              onClear={() =>
                setAnswers(current => {
                  const updated = {...current};
                  delete updated[question.id];
                  return updated;
                })
              }
              highlightUnanswered={highlightUnanswered}
              onLayout={event => {
                questionPositions.current[question.id] = event.nativeEvent.layout.y;
              }}
            />
          ))}

          <View style={styles.bottomCard}>
            <Text style={styles.bottomTitle}>Quiz Summary</Text>
            <View style={styles.bottomRow}><Text style={styles.bottomLabel}>Total Questions</Text><Text style={styles.bottomValue}>{questions.length}</Text></View>
            <View style={styles.bottomRow}><Text style={styles.bottomLabel}>Answered</Text><Text style={styles.bottomValue}>{answeredCount}</Text></View>
            <View style={styles.bottomRow}><Text style={styles.bottomLabel}>Unanswered</Text><Text style={styles.bottomValue}>{unansweredCount}</Text></View>
            <View style={styles.timerRow}><Text style={styles.bottomLabel}>Time Remaining</Text><Timer remainingSeconds={remainingSeconds} large /></View>
            {unansweredCount > 0 ? (
              <AppButton title="Go to First Unanswered" variant="outline" onPress={scrollToFirstUnanswered} style={styles.summaryButton} />
            ) : null}
            <AppButton title="Submit Quiz" onPress={handleManualSubmit} style={styles.summaryButton} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLORS.background},
  loadingScreen: {flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center'},
  loadingText: {color: COLORS.primary, fontSize: 16, fontWeight: '700'},
  fixedSummary: {backgroundColor: COLORS.surface, borderBottomColor: COLORS.border, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-evenly', paddingVertical: 10},
  summaryItem: {alignItems: 'center', flex: 1},
  summaryValue: {color: COLORS.primary, fontSize: 17, fontWeight: '900'},
  summaryLabel: {color: COLORS.muted, fontSize: 11, marginTop: 2},
  summaryDivider: {width: 1, backgroundColor: COLORS.border},
  scrollContent: {padding: 15, paddingBottom: 32},
  container: {width: '100%', maxWidth: 760, alignSelf: 'center'},
  bottomCard: {backgroundColor: COLORS.surface, borderRadius: 20, padding: 18, marginTop: 2},
  bottomTitle: {color: COLORS.primary, fontSize: 18, fontWeight: '900', marginBottom: 9},
  bottomRow: {flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: COLORS.border, borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: 8},
  bottomLabel: {color: COLORS.muted, fontSize: 14},
  bottomValue: {color: COLORS.text, fontSize: 14, fontWeight: '800'},
  timerRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15},
  summaryButton: {marginTop: 14},
});
