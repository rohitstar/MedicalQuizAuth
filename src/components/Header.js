import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../constants/appConstants';
import AppLogo from './AppLogo';

export default function Header({title, subtitle, rightContent, compact = false}) {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      <AppLogo size={compact ? 45 : 54} />
      <View style={styles.titleArea}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text> : null}
      </View>
      {rightContent ? <View style={styles.right}>{rightContent}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  compact: {paddingVertical: 10},
  titleArea: {flex: 1, marginLeft: 12},
  title: {color: COLORS.primaryDark, fontSize: 18, fontWeight: '800'},
  subtitle: {color: COLORS.muted, fontSize: 13, marginTop: 3},
  right: {marginLeft: 10},
});
