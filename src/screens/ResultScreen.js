import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import AppButton from '../components/AppButton';
import InfoCard, {InfoRow} from '../components/InfoCard';
import storageService from '../services/storageService';
import {formatTime} from '../utils/quizHelper';
import {COLORS, EXAM_DETAILS, STORAGE_KEYS} from '../constants/appConstants';

export default function ResultScreen({navigation, route}) {
  const [result, setResult] = useState(null);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const loadResult = async () => {
      const storedResult = await storageService.get(STORAGE_KEYS.QUIZ_RESULT);
      if (!storedResult) {
        navigation.reset({index: 0, routes: [{name: 'Dashboard'}]});
        return;
      }
      setResult(storedResult);
      if (route.params?.automatic) {
        Alert.alert('Time completed', 'The quiz was submitted automatically when the timer reached zero.');
      }
    };
    loadResult();
  }, [navigation, route.params?.automatic]);

  const logout = async () => {
    await storageService.removeMany([
      STORAGE_KEYS.USER_SESSION,
      STORAGE_KEYS.USER_PROFILE,
    ]);
    navigation.reset({index: 0, routes: [{name: 'Login'}]});
  };

  if (!result) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <Text style={styles.loadingText}>Loading result...</Text>
      </SafeAreaView>
    );
  }

  const passed = result.status === 'PASS';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Examination Result" subtitle={result.examinationName} compact />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={[styles.statusCard, passed ? styles.passCard : styles.failCard]}>
            <Text style={styles.statusOverline}>FINAL RESULT</Text>
            <Text style={[styles.statusText, passed ? styles.passText : styles.failText]}>{result.status}</Text>
            <Text style={styles.percentage}>{result.percentage}%</Text>
            <Text style={styles.statusMessage}>
              {passed ? 'Congratulations! You have passed the examination.' : 'The passing requirement has not been met.'}
            </Text>
          </View>

          <InfoCard title="Candidate & Examination">
            <InfoRow label="Candidate" value={result.candidateName} />
            <InfoRow label="Course" value={result.courseName} />
            <InfoRow label="Examination" value={result.examinationName} />
          </InfoCard>

          <InfoCard title="Performance Summary">
            <InfoRow label="Total Questions" value={String(result.totalQuestions)} />
            <InfoRow label="Attempted" value={String(result.questionsAttempted)} />
            <InfoRow label="Correct" value={String(result.correctAnswers)} valueStyle={{color: COLORS.success}} />
            <InfoRow label="Incorrect" value={String(result.incorrectAnswers)} valueStyle={{color: COLORS.danger}} />
            <InfoRow label="Unanswered" value={String(result.unansweredQuestions)} />
            <InfoRow label="Total Marks" value={String(result.totalMarks)} />
            <InfoRow label="Marks Obtained" value={String(result.marksObtained)} />
            <InfoRow label="Passing Percentage" value={`${EXAM_DETAILS.passingPercentage}%`} />
            <InfoRow label="Time Taken" value={formatTime(result.timeTakenSeconds)} />
          </InfoCard>

          <AppButton
            title={showReview ? 'Hide Answer Review' : 'View Answer Review'}
            variant="outline"
            onPress={() => setShowReview(value => !value)}
          />

          {showReview ? (
            <View style={styles.reviewSection}>
              {result.review.map(item => {
                const selectedText = item.selectedAnswer === null ? 'Not answered' : item.options[item.selectedAnswer];
                const correctText = item.options[item.correctAnswer];
                return (
                  <View key={item.id} style={styles.reviewCard}>
                    <Text style={styles.reviewQuestion}>{item.id}. {item.question}</Text>
                    <View style={[styles.reviewStatus, item.isCorrect ? styles.correctStatus : styles.incorrectStatus]}>
                      <Text style={[styles.reviewStatusText, item.isCorrect ? styles.correctText : styles.incorrectText]}>
                        {item.selectedAnswer === null ? 'Unanswered' : item.isCorrect ? 'Correct' : 'Incorrect'}
                      </Text>
                    </View>
                    <Text style={styles.reviewLabel}>Your answer</Text>
                    <Text style={styles.reviewAnswer}>{selectedText}</Text>
                    <Text style={styles.reviewLabel}>Correct answer</Text>
                    <Text style={[styles.reviewAnswer, {color: COLORS.success}]}>{correctText}</Text>
                  </View>
                );
              })}
            </View>
          ) : null}

          <AppButton
            title="Return to Dashboard"
            onPress={() => navigation.reset({index: 0, routes: [{name: 'Dashboard'}]})}
            style={styles.buttonSpacing}
          />
          <AppButton title="Logout" variant="ghost" onPress={logout} style={styles.buttonSpacing} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLORS.background},
  loadingScreen: {flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background},
  loadingText: {color: COLORS.primary, fontSize: 16, fontWeight: '700'},
  scrollContent: {padding: 18, paddingBottom: 30},
  container: {width: '100%', maxWidth: 720, alignSelf: 'center'},
  statusCard: {borderRadius: 22, padding: 22, alignItems: 'center', marginBottom: 17},
  passCard: {backgroundColor: COLORS.successLight},
  failCard: {backgroundColor: COLORS.dangerLight},
  statusOverline: {color: COLORS.muted, fontSize: 12, fontWeight: '800', letterSpacing: 1},
  statusText: {fontSize: 31, fontWeight: '900', marginTop: 5},
  passText: {color: COLORS.success},
  failText: {color: COLORS.danger},
  percentage: {color: COLORS.primaryDark, fontSize: 25, fontWeight: '900', marginTop: 3},
  statusMessage: {color: COLORS.text, fontSize: 14, lineHeight: 21, marginTop: 8, textAlign: 'center'},
  reviewSection: {marginTop: 15},
  reviewCard: {backgroundColor: COLORS.surface, borderColor: COLORS.border, borderWidth: 1, borderRadius: 17, padding: 16, marginBottom: 13},
  reviewQuestion: {color: COLORS.text, fontSize: 15, fontWeight: '800', lineHeight: 22},
  reviewStatus: {alignSelf: 'flex-start', borderRadius: 14, paddingHorizontal: 9, paddingVertical: 4, marginTop: 10},
  correctStatus: {backgroundColor: COLORS.successLight},
  incorrectStatus: {backgroundColor: COLORS.dangerLight},
  reviewStatusText: {fontSize: 11, fontWeight: '900'},
  correctText: {color: COLORS.success},
  incorrectText: {color: COLORS.danger},
  reviewLabel: {color: COLORS.muted, fontSize: 12, fontWeight: '700', marginTop: 11},
  reviewAnswer: {color: COLORS.text, fontSize: 14, lineHeight: 20, marginTop: 3},
  buttonSpacing: {marginTop: 11},
});
