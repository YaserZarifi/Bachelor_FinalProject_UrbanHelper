import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, shadow } from '../../theme';

/**
 * Flat white surface with a hairline border. (Name kept for its many call
 * sites; `intensity` is accepted but ignored.)
 */
export function GlassCard({ children, style, intensity, padded = true }) {
  return (
    <View style={[styles.card, padded && styles.padded, style]}>{children}</View>
  );
}

/** Preferred name for new code. */
export const Card = GlassCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  padded: { padding: 16 },
});
