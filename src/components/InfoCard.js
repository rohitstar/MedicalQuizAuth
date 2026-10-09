import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../constants/appConstants';

export default function InfoCard({title, children, style}) {
  return (
    <View style={[styles.card, style]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

export function InfoRow({label, value, valueStyle}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, valueStyle]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 2,
  },
  title: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
  },
  row: {
    borderBottomColor: COLORS.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
  },
  label: {color: COLORS.muted, flex: 0.43, fontSize: 14},
  value: {
    color: COLORS.text,
    flex: 0.57,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
  },
});
