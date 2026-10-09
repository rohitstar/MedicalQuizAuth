import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../constants/appConstants';
import {formatTime} from '../utils/quizHelper';

export default function Timer({remainingSeconds, large = false}) {
  const isDanger = remainingSeconds < 5 * 60;
  const isWarning = !isDanger && remainingSeconds < 10 * 60;

  return (
    <View
      accessibilityLabel={`Time remaining ${formatTime(remainingSeconds)}`}
      style={[
        styles.container,
        large && styles.largeContainer,
        isWarning && styles.warningContainer,
        isDanger && styles.dangerContainer,
      ]}>
      <Text
        style={[
          styles.time,
          large && styles.largeTime,
          isWarning && styles.warningText,
          isDanger && styles.dangerText,
        ]}>
        {formatTime(remainingSeconds)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.infoLight,
    borderRadius: 10,
    minWidth: 74,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  largeContainer: {paddingHorizontal: 15, paddingVertical: 9},
  warningContainer: {backgroundColor: COLORS.warningLight},
  dangerContainer: {backgroundColor: COLORS.dangerLight},
  time: {
    color: COLORS.primary,
    fontSize: 17,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
    textAlign: 'center',
  },
  largeTime: {fontSize: 24},
  warningText: {color: COLORS.warning},
  dangerText: {color: COLORS.danger},
});
