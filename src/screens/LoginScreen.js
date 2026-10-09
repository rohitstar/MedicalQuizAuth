import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppLogo from '../components/AppLogo';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import storageService from '../services/storageService';
import {validateLoginForm} from '../utils/validation';
import {
  CANDIDATE_PROFILE,
  COLORS,
  DEMO_CREDENTIALS,
  EXAM_DETAILS,
  STORAGE_KEYS,
} from '../constants/appConstants';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({email: '', password: ''});
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const validationErrors = validateLoginForm(email, password);
    setErrors(validationErrors);

    if (validationErrors.email || validationErrors.password) {
      return;
    }

    if (
      email.trim().toLowerCase() !== DEMO_CREDENTIALS.email.toLowerCase() ||
      password !== DEMO_CREDENTIALS.password
    ) {
      Alert.alert('Login failed', 'The email or password is incorrect. Use the demo credentials shown below.');
      return;
    }

    setLoading(true);
    const profile = {...CANDIDATE_PROFILE, email: email.trim().toLowerCase()};
    const saved = await Promise.all([
      storageService.set(STORAGE_KEYS.USER_SESSION, {
        isLoggedIn: true,
        rememberMe,
        loggedInAt: new Date().toISOString(),
      }),
      storageService.set(STORAGE_KEYS.USER_PROFILE, profile),
    ]);
    setLoading(false);

    if (saved.some(value => !value)) {
      Alert.alert('Storage error', 'The login session could not be saved. Please try again.');
      return;
    }

    navigation.reset({index: 0, routes: [{name: 'Dashboard'}]});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <AppLogo size={96} />
            <Text style={styles.title}>Candidate Login</Text>
            <Text style={styles.subtitle}>{EXAM_DETAILS.courseName}</Text>

            <View style={styles.card}>
              <AppInput
                label="Email address"
                placeholder="name@gmail.com"
                value={email}
                onChangeText={value => {
                  setEmail(value);
                  if (errors.email) setErrors(current => ({...current, email: ''}));
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                error={errors.email}
              />
              <AppInput
                label="Password"
                placeholder="Enter password"
                value={password}
                onChangeText={value => {
                  setPassword(value);
                  if (errors.password) setErrors(current => ({...current, password: ''}));
                }}
                secureTextEntry={!showPassword}
                showPasswordToggle
                isPasswordVisible={showPassword}
                onTogglePassword={() => setShowPassword(value => !value)}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                error={errors.password}
              />

              <View style={styles.optionsRow}>
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityState={{checked: rememberMe}}
                  onPress={() => setRememberMe(value => !value)}
                  style={styles.rememberRow}>
                  <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe ? <Text style={styles.checkmark}>✓</Text> : null}
                  </View>
                  <Text style={styles.rememberText}>Remember Me</Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    Alert.alert(
                      'Forgot Password',
                      'Password recovery can be connected to your live API. Use the demo credentials for this local build.',
                    )
                  }>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </Pressable>
              </View>

              <AppButton title="Login" onPress={handleLogin} loading={loading} />

              <View style={styles.demoBox}>
                <Text style={styles.demoTitle}>Demo credentials</Text>
                <Text style={styles.demoText}>{DEMO_CREDENTIALS.email}</Text>
                <Text style={styles.demoText}>{DEMO_CREDENTIALS.password}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  safeArea: {flex: 1, backgroundColor: COLORS.background},
  scrollContent: {flexGrow: 1, justifyContent: 'center', padding: 20},
  container: {width: '100%', maxWidth: 560, alignSelf: 'center'},
  title: {color: COLORS.primaryDark, fontSize: 28, fontWeight: '900', marginTop: 15, textAlign: 'center'},
  subtitle: {color: COLORS.muted, fontSize: 14, marginTop: 6, textAlign: 'center'},
  card: {backgroundColor: COLORS.surface, borderRadius: 22, marginTop: 24, padding: 20, shadowColor: COLORS.shadow, shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: {width: 0, height: 5}, elevation: 3},
  optionsRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20},
  rememberRow: {flexDirection: 'row', alignItems: 'center'},
  checkbox: {width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginRight: 8},
  checkboxChecked: {backgroundColor: COLORS.secondary, borderColor: COLORS.secondary},
  checkmark: {color: '#FFFFFF', fontWeight: '900'},
  rememberText: {color: COLORS.text, fontSize: 13},
  forgotText: {color: COLORS.secondary, fontSize: 13, fontWeight: '700'},
  demoBox: {backgroundColor: COLORS.infoLight, borderRadius: 13, marginTop: 17, padding: 12},
  demoTitle: {color: COLORS.primary, fontSize: 12, fontWeight: '800', marginBottom: 4},
  demoText: {color: COLORS.muted, fontSize: 12, lineHeight: 18},
});
