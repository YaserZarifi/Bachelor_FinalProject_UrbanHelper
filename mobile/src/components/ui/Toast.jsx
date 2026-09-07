import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, shadow } from '../../theme';

/** Auto-hiding dark pill toast pinned near the bottom. */
export function Toast({
  message,
  onHide,
  duration = 3200,
  iconName = 'notifications',
  iconColor = colors.brand[400],
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
    const t = setTimeout(() => {
      Animated.timing(anim, { toValue: 0, duration: 250, useNativeDriver: true }).start(
        () => onHide?.(),
      );
    }, duration);
    return () => clearTimeout(t);
  }, [anim, duration, onHide]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [80, 0] });

  return (
    <Animated.View
      style={[styles.wrap, { opacity: anim, transform: [{ translateY }] }]}
      pointerEvents="none"
    >
      <View style={styles.card}>
        <Ionicons name={iconName} size={18} color={iconColor} />
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 20, right: 20, bottom: 28, alignItems: 'center' },
  card: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: radius.md,
    backgroundColor: colors.text,
    ...shadow.card,
  },
  text: { color: colors.white, fontFamily: fonts.semibold, fontSize: 14, textAlign: 'right', writingDirection: 'rtl', flexShrink: 1 },
});
