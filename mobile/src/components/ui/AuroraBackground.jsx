import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme';

/** Plain paper canvas — the backdrop for every screen. */
export function AuroraBackground({ children, style }) {
  return <View style={[styles.root, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
});
