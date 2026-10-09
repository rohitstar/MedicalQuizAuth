import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../constants/appConstants';

export default function AppLogo({size = 92, showName = false}) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/society-logo.png')}
        style={{width: size, height: size}}
        resizeMode="contain"
        accessibilityLabel="Society logo"
      />
      {showName ? <Text style={styles.name}>Medical Education Society</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  name: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
});
