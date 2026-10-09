import React, {useEffect, useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import AppButton from '../components/AppButton';
import storageService from '../services/storageService';
import {ALLOW_RETAKE, COLORS, EXAM_DETAILS, STORAGE_KEYS} from '../constants/appConstants';

const guidelines = [
  'The total examination duration is 60 minutes.',
  'All questions are displayed on one screen.',
  'Select only one answer for each question.',
  'The timer starts immediately after pressing “Start Quiz.”',
  'The examination will be submitted automatically when the timer reaches zero.',
  'Candidates can change answers before final submission.',
  'Do not close or refresh the application during the examination.',
  'Unanswered questions will be marked as unanswered.',
  'Once submitted, answers cannot be changed.',
  'Ensure that the mobile device has sufficient battery.',
];

export default function GuidelinesScreen({navigation}) {
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    const loadState = async () => {
      const [isSubmitted, startTime] = await Promise.all([
        storageService.get(STORAGE_KEYS.QUIZ_SUBMITTED, false),
        storageService.get(STORAGE_KEYS.QUIZ_START_TIME),
      ]);
      setSubmitted(Boolean(isSubmitted));
      setInProgress(Boolean(startTime) && !isSubmitted);
    };
    loadState();
  }, []);

  const beginQuiz = () => {
    if (submitted && !ALLOW_RETAKE) {
      navigation.replace('Result');
      return;
    }
    if (inProgress) {
      navigation.replace('Quiz');
      return;
    }

    Alert.alert(
      'Start Quiz',
      'Are you sure you want to start the quiz? The 60-minute timer will begin immediately.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Start Quiz', onPress: () => navigation.replace('Quiz')},
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Examination Guidelines" subtitle={EXAM_DETAILS.examinationName} compact />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>Please read carefully</Text>
            <Text style={styles.introText}>These instructions help protect your attempt and ensure fair submission.</Text>
          </View>

          <View style={styles.guidelineCard}>
            {guidelines.map((guideline, index) => (
              <View key={guideline} style={styles.guidelineRow}>
                <View style={styles.numberCircle}><Text style={styles.numberText}>{index + 1}</Text></View>
                <Text style={styles.guidelineText}>{guideline}</Text>
              </View>
            ))}
          </View>

          {!submitted && !inProgress ? (
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{checked: accepted}}
              onPress={() => setAccepted(value => !value)}
              style={styles.acceptRow}>
              <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
                {accepted ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
              <Text style={styles.acceptText}>I have read and understood all the guidelines.</Text>
            </Pressable>
          ) : null}

          <AppButton
            title={submitted ? 'View Result' : inProgress ? 'Resume Quiz' : 'Start Quiz'}
            onPress={beginQuiz}
            disabled={!submitted && !inProgress && !accepted}
          />
          <AppButton title="Back to Dashboard" variant="ghost" onPress={() => navigation.goBack()} style={styles.backButton} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLORS.background},
  scrollContent: {padding: 18, paddingBottom: 28},
  container: {width: '100%', maxWidth: 720, alignSelf: 'center'},
  introCard: {backgroundColor: COLORS.secondaryLight, borderRadius: 18, padding: 17, marginBottom: 15},
  introTitle: {color: COLORS.primaryDark, fontSize: 18, fontWeight: '900'},
  introText: {color: COLORS.muted, fontSize: 14, lineHeight: 21, marginTop: 5},
  guidelineCard: {backgroundColor: COLORS.surface, borderColor: COLORS.border, borderWidth: 1, borderRadius: 18, padding: 16},
  guidelineRow: {flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14},
  numberCircle: {width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.infoLight, alignItems: 'center', justifyContent: 'center', marginRight: 11},
  numberText: {color: COLORS.primary, fontSize: 12, fontWeight: '900'},
  guidelineText: {color: COLORS.text, flex: 1, fontSize: 14, lineHeight: 21},
  acceptRow: {backgroundColor: COLORS.surface, borderRadius: 15, flexDirection: 'row', alignItems: 'center', marginVertical: 17, padding: 15},
  checkbox: {width: 24, height: 24, borderRadius: 6, borderColor: COLORS.border, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginRight: 11},
  checkboxChecked: {backgroundColor: COLORS.secondary, borderColor: COLORS.secondary},
  checkmark: {color: '#FFFFFF', fontWeight: '900'},
  acceptText: {color: COLORS.text, flex: 1, fontSize: 14, fontWeight: '600', lineHeight: 20},
  backButton: {marginTop: 8},
});
