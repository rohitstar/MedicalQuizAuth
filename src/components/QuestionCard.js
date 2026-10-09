import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../constants/appConstants';

export default function QuestionCard({
  question,
  selectedAnswer,
  onSelect,
  onClear,
  highlightUnanswered = false,
  onLayout,
}) {
  const isAnswered = selectedAnswer !== undefined && selectedAnswer !== null;

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.card,
        highlightUnanswered && !isAnswered ? styles.unansweredCard : null,
      ]}>
      <View style={styles.questionHeader}>
        <Text style={styles.number}>Question {question.id}</Text>
        <View style={[styles.badge, isAnswered ? styles.answeredBadge : styles.unansweredBadge]}>
          <Text style={[styles.badgeText, isAnswered ? styles.answeredText : styles.unansweredText]}>
            {isAnswered ? 'Answered' : 'Unanswered'}
          </Text>
        </View>
      </View>
      <Text style={styles.questionText}>{question.question}</Text>

      <View style={styles.options}>
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{selected: isSelected}}
              accessibilityLabel={`${option}${isSelected ? ', selected' : ''}`}
              key={`${question.id}-${index}`}
              onPress={() => onSelect(index)}
              style={({pressed}) => [
                styles.option,
                isSelected && styles.selectedOption,
                pressed && styles.pressedOption,
              ]}>
              <View style={[styles.radio, isSelected && styles.selectedRadio]}>
                {isSelected ? <View style={styles.radioDot} /> : null}
              </View>
              <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={!isAnswered}
        onPress={onClear}
        style={({pressed}) => [styles.clearButton, !isAnswered && styles.clearDisabled, pressed && isAnswered && styles.clearPressed]}>
        <Text style={[styles.clearText, !isAnswered && styles.clearTextDisabled]}>Clear Answer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 17,
    marginBottom: 15,
  },
  unansweredCard: {borderColor: COLORS.danger, borderWidth: 1.5},
  questionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  number: {color: COLORS.primary, fontSize: 14, fontWeight: '800'},
  badge: {borderRadius: 20, paddingHorizontal: 9, paddingVertical: 4},
  answeredBadge: {backgroundColor: COLORS.successLight},
  unansweredBadge: {backgroundColor: COLORS.warningLight},
  badgeText: {fontSize: 11, fontWeight: '800'},
  answeredText: {color: COLORS.success},
  unansweredText: {color: COLORS.warning},
  questionText: {color: COLORS.text, fontSize: 16, fontWeight: '700', lineHeight: 24, marginTop: 14},
  options: {marginTop: 12},
  option: {
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
    minHeight: 50,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  selectedOption: {backgroundColor: COLORS.secondaryLight, borderColor: COLORS.secondary},
  pressedOption: {opacity: 0.82},
  radio: {
    width: 21,
    height: 21,
    borderColor: COLORS.muted,
    borderWidth: 2,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  selectedRadio: {borderColor: COLORS.secondary},
  radioDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.secondary},
  optionText: {color: COLORS.text, flex: 1, fontSize: 14, lineHeight: 20},
  selectedOptionText: {color: COLORS.primaryDark, fontWeight: '700'},
  clearButton: {alignSelf: 'flex-start', marginTop: 14, paddingVertical: 7},
  clearDisabled: {opacity: 0.45},
  clearPressed: {opacity: 0.7},
  clearText: {color: COLORS.danger, fontSize: 13, fontWeight: '700'},
  clearTextDisabled: {color: COLORS.muted},
});
