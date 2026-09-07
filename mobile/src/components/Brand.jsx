import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

/** Plain text wordmark — the whole brand identity. */
export function Wordmark({ size = 22, style }) {
  return (
    <Text allowFontScaling={false} style={[styles.word, { fontSize: size }, style]}>
      شهریاور
    </Text>
  );
}

export function BrandLockup({ subtitle = 'سامانهٔ گزارش شهروندی' }) {
  return (
    <View style={styles.lockup}>
      <Wordmark size={22} />
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  word: {
    color: colors.text,
    fontFamily: fonts.black,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  lockup: { alignItems: 'flex-end', gap: 2 },
  subtitle: {
    color: colors.textFaint,
    fontFamily: fonts.medium,
    fontSize: 12,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
