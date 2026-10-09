import React, {useCallback, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import Header from '../components/Header';
import InfoCard, {InfoRow} from '../components/InfoCard';
import AppButton from '../components/AppButton';
import storageService from '../services/storageService';
import questions from '../data/questions';
import {
  ALLOW_RETAKE,
  CANDIDATE_PROFILE,
  COLORS,
  EXAM_DETAILS,
  STORAGE_KEYS,
} from '../constants/appConstants';

export default function DashboardScreen({navigation}) {
  const [profile, setProfile] = useState(CANDIDATE_PROFILE);
  const [submitted, setSubmitted] = useState(false);
  const [inProgress, setInProgress] = useState(false);

  const loadDashboard = useCallback(async () => {
    const [storedProfile, isSubmitted, startTime] = await Promise.all([
      storageService.get(STORAGE_KEYS.USER_PROFILE, CANDIDATE_PROFILE),
      storageService.get(STORAGE_KEYS.QUIZ_SUBMITTED, false),
      storageService.get(STORAGE_KEYS.QUIZ_START_TIME),
    ]);
    setProfile(storedProfile || CANDIDATE_PROFILE);
    setSubmitted(Boolean(isSubmitted));
    setInProgress(Boolean(startTime) && !isSubmitted);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard]),
  );

  const logout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await storageService.removeMany([
            STORAGE_KEYS.USER_SESSION,
            STORAGE_KEYS.USER_PROFILE,
          ]);
          navigation.reset({index: 0, routes: [{name: 'Login'}]});
        },
      },
    ]);
  };

  const handleStart = () => {
    if (submitted && !ALLOW_RETAKE) {
      navigation.navigate('Result');
      return;
    }
    navigation.navigate(inProgress ? 'Quiz' : 'Guidelines');
  };

  const statusText = submitted ? 'Submitted' : inProgress ? 'In Progress' : EXAM_DETAILS.status;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title={EXAM_DETAILS.societyName}
        subtitle={EXAM_DETAILS.courseName}
        rightContent={
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.name?.charAt(0) || 'C'}</Text>
          </View>
        }
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeOverline}>WELCOME</Text>
            <Text style={styles.welcomeTitle}>{profile.name}</Text>
            <Text style={styles.welcomeText}>Your examination details and actions are available below.</Text>
          </View>

          <InfoCard title="Course & Examination">
            <InfoRow label="Course" value={EXAM_DETAILS.courseName} />
            <InfoRow label="Examination" value={EXAM_DETAILS.examinationName} />
            <InfoRow label="Duration" value={`${EXAM_DETAILS.durationMinutes} Minutes`} />
            <InfoRow label="Questions" value={String(questions.length)} />
            <InfoRow label="Total Marks" value={String(questions.length)} />
            <InfoRow
              label="Status"
              value={statusText}
              valueStyle={{color: submitted ? COLORS.success : inProgress ? COLORS.warning : COLORS.secondary}}
            />
            <InfoRow label="Date" value={EXAM_DETAILS.date} />
          </InfoCard>

          <InfoCard title="Candidate Details">
            <InfoRow label="Name" value={profile.name} />
            <InfoRow label="Email" value={profile.email} />
            <InfoRow label="Mobile" value={profile.mobile} />
          </InfoCard>

          {submitted ? (
            <View style={styles.lockedNotice}>
              <Text style={styles.lockedTitle}>Quiz attempt completed</Text>
              <Text style={styles.lockedText}>A retake is disabled until the stored result is cleared or permission is provided by the examination system.</Text>
            </View>
          ) : null}

          <View style={styles.actions}>
            <AppButton title="Read Guidelines" variant="outline" onPress={() => navigation.navigate('Guidelines')} />
            <AppButton
              title={submitted ? 'View Result' : inProgress ? 'Resume Quiz' : 'Start Quiz'}
              onPress={handleStart}
              style={styles.actionSpacing}
            />
            <AppButton title="Logout" variant="ghost" onPress={logout} style={styles.actionSpacing} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLORS.background},
  scrollContent: {padding: 18, paddingBottom: 30},
  container: {width: '100%', maxWidth: 720, alignSelf: 'center'},
  avatar: {width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.secondaryLight, alignItems: 'center', justifyContent: 'center'},
  avatarText: {color: COLORS.secondary, fontSize: 18, fontWeight: '900'},
  welcomeCard: {backgroundColor: COLORS.primary, borderRadius: 20, padding: 21, marginBottom: 17},
  welcomeOverline: {color: '#B9D7EB', fontSize: 12, fontWeight: '800', letterSpacing: 1.2},
  welcomeTitle: {color: '#FFFFFF', fontSize: 24, fontWeight: '900', marginTop: 5},
  welcomeText: {color: '#D9E8F2', fontSize: 14, lineHeight: 21, marginTop: 7},
  lockedNotice: {backgroundColor: COLORS.warningLight, borderRadius: 16, padding: 15, marginBottom: 17},
  lockedTitle: {color: COLORS.warning, fontSize: 15, fontWeight: '800'},
  lockedText: {color: COLORS.text, fontSize: 13, lineHeight: 19, marginTop: 5},
  actions: {marginTop: 2},
  actionSpacing: {marginTop: 11},
});
