import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, radius } from '../../theme';

export function Chip({ label, color = colors.brand[500], icon = null, style }) {
  return (
    <View
      style={[
        styles.chip,
        { borderColor: color + '33', backgroundColor: color + '14' },
        style,
      ]}
    >
      {icon}
      <Text allowFontScaling={false} style={[styles.text, { color }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: { fontFamily: fonts.bold, fontSize: 12, writingDirection: 'rtl' },
});
