import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radius, fonts } from '../../theme';

/**
 * variant:
 *   'primary'   — flat amber fill, near‑black text (the one accent)
 *   'secondary' — white fill, hairline border, dark text
 *   'ghost'     — transparent, amber link‑style text
 *
 * Back‑compat aliases: 'emerald' → primary, 'glass' → secondary.
 */
export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon = null,
  style,
  size = 'md',
}) {
  const v =
    variant === 'emerald' ? 'primary' : variant === 'glass' ? 'secondary' : variant;

  const textColor =
    v === 'primary' ? colors.onBrand : v === 'ghost' ? colors.brand[600] : colors.text;

  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.();
  };

  const pad = size === 'lg' ? styles.padLg : styles.padMd;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        pad,
        v === 'primary' && styles.primary,
        v === 'secondary' && styles.secondary,
        v === 'ghost' && styles.ghost,
        v === 'primary' && pressed && styles.primaryPressed,
        { opacity: disabled ? 0.45 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <>
            {icon}
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={[styles.text, { color: textColor }, size === 'lg' && styles.textLg]}
            >
              {title}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  padMd: { paddingVertical: 13, paddingHorizontal: 20, minHeight: 46 },
  padLg: { paddingVertical: 16, paddingHorizontal: 24, minHeight: 52 },
  content: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: { fontFamily: fonts.bold, fontSize: 15, writingDirection: 'rtl' },
  textLg: { fontSize: 16 },
  primary: { backgroundColor: colors.brand[500] },
  primaryPressed: { backgroundColor: colors.brand[600] },
  secondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  ghost: { backgroundColor: 'transparent' },
});
