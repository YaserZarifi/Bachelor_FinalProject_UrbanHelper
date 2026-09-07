import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STATUS_COLOR, STATUS_LABEL } from '../constants/status';
import { fonts, radius } from '../theme';

export function StatusBadge({ status, size = 'md' }) {
  const color = STATUS_COLOR[status] || '#9b9b9b';
  return (
    <View
      style={[
        styles.badge,
        { borderColor: color + '3d', backgroundColor: color + '1a' },
        size === 'sm' && styles.sm,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text
        allowFontScaling={false}
        style={[styles.text, { color }, size === 'sm' && styles.textSm]}
      >
        {STATUS_LABEL[status] || status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  sm: { paddingHorizontal: 8, paddingVertical: 3 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  text: { fontFamily: fonts.bold, fontSize: 12, writingDirection: 'rtl' },
  textSm: { fontSize: 11 },
});
