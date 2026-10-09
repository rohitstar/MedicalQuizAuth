import React, {useEffect} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppLogo from '../components/AppLogo';
import storageService from '../services/storageService';
import {COLORS, EXAM_DETAILS, STORAGE_KEYS} from '../constants/appConstants';

export default function SplashScreen({navigation}) {
  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      const [session] = await Promise.all([
        storageService.get(STORAGE_KEYS.USER_SESSION),
        new Promise(resolve => setTimeout(resolve, 2300)),
      ]);

      if (!active) {
        return;
      }

      const shouldRestoreSession =
        session?.isLoggedIn === true && session?.rememberMe !== false;

      if (session?.isLoggedIn && !shouldRestoreSession) {
        await storageService.remove(STORAGE_KEYS.USER_SESSION);
      }

      navigation.reset({
        index: 0,
        routes: [{name: shouldRestoreSession ? 'Dashboard' : 'Login'}],
      });
    };

    bootstrap();
    return () => {
      active = false;
    };
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.decorativeCircleOne} />
      <View style={styles.decorativeCircleTwo} />
      <View style={styles.content}>
        <AppLogo size={128} />
        <Text style={styles.society}>{EXAM_DETAILS.societyName}</Text>
        <Text style={styles.course}>{EXAM_DETAILS.courseName}</Text>
        <Text style={styles.title}>Quiz Application</Text>
        <ActivityIndicator size="large" color={COLORS.secondary} style={styles.loader} />
        <Text style={styles.loading}>Preparing your examination...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#EDF5FA', overflow: 'hidden'},
  content: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28},
  decorativeCircleOne: {position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: '#DCEEF5', top: -100, right: -100},
  decorativeCircleTwo: {position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: '#DDF3EF', bottom: -90, left: -90},
  society: {color: COLORS.primary, fontSize: 18, fontWeight: '800', marginTop: 20, textAlign: 'center'},
  course: {color: COLORS.muted, fontSize: 15, marginTop: 7, textAlign: 'center'},
  title: {color: COLORS.primaryDark, fontSize: 30, fontWeight: '900', marginTop: 8, textAlign: 'center'},
  loader: {marginTop: 34},
  loading: {color: COLORS.muted, fontSize: 13, marginTop: 11},
});
