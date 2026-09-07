import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius } from '../../theme';

export function Field({ label, icon, style, onFocus, onBlur, ...inputProps }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={style}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.box, focused && styles.boxFocused]}>
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={focused ? colors.brand[600] : colors.textFaint}
          />
        ) : null}
        <TextInput
          placeholderTextColor={colors.textFaint}
          textAlign="right"
          style={styles.input}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...inputProps}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.textMuted,
    fontFamily: fonts.semibold,
    fontSize: 13,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 8,
  },
  box: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.white,
  },
  boxFocused: { borderColor: colors.brand[500] },
  input: {
    flex: 1,
    paddingVertical: 13,
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 15,
    writingDirection: 'rtl',
  },
});
