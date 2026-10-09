import React from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {COLORS} from '../constants/appConstants';

export default function AppInput({
  label,
  error,
  secureTextEntry,
  showPasswordToggle = false,
  isPasswordVisible = false,
  onTogglePassword,
  ...inputProps
}) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.muted}
          secureTextEntry={secureTextEntry}
          accessibilityLabel={label}
          {...inputProps}
        />
        {showPasswordToggle ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            onPress={onTogglePassword}
            hitSlop={10}
            style={styles.toggleButton}>
            <Text style={styles.toggleText}>{isPasswordVisible ? 'Hide' : 'Show'}</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {marginBottom: 17},
  label: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 7,
  },
  inputContainer: {
    minHeight: 52,
    borderColor: COLORS.border,
    borderWidth: 1.2,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputError: {borderColor: COLORS.danger},
  input: {
    color: COLORS.text,
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  toggleButton: {paddingHorizontal: 14, paddingVertical: 12},
  toggleText: {color: COLORS.secondary, fontWeight: '700'},
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 5,
  },
});
