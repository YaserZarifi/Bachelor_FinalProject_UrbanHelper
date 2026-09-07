import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, fonts, radius } from '../../src/theme';

const TABS = [
  { name: 'index', label: 'خانه', icon: 'home', iconOutline: 'home-outline' },
  { name: 'reports', label: 'گزارش‌ها', icon: 'documents', iconOutline: 'documents-outline' },
  { name: 'profile', label: 'پروفایل', icon: 'person', iconOutline: 'person-outline' },
];

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <DockedTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="reports" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

/** A nav cell: icon + label with a subtle focus micro-interaction. */
function TabItem({ tab, isFocused, onPress }) {
  const p = useSharedValue(isFocused ? 1 : 0);
  useEffect(() => {
    p.value = withTiming(isFocused ? 1 : 0, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
  }, [isFocused, p]);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: 1 + p.value * 0.06 }] }));

  return (
    <Pressable style={styles.cell} onPress={onPress} hitSlop={6}>
      <View style={[styles.indicator, isFocused && styles.indicatorOn]} />
      <Animated.View style={[styles.iconSlot, iconStyle]}>
        <Ionicons
          name={isFocused ? tab.icon : tab.iconOutline}
          size={22}
          color={isFocused ? colors.brand[600] : colors.textFaint}
        />
      </Animated.View>
      <Text
        allowFontScaling={false}
        numberOfLines={1}
        style={[styles.label, isFocused && styles.labelActive]}
      >
        {tab.label}
      </Text>
    </Pressable>
  );
}

/** The inline primary action — opens the report wizard. */
function ReportCell() {
  const router = useRouter();
  const open = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push('/report/new');
  };
  return (
    <Pressable
      style={styles.cell}
      onPress={open}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel="ثبت گزارش جدید"
    >
      <View style={styles.indicator} />
      <View style={styles.iconSlot}>
        <View style={styles.reportSquare}>
          <Ionicons name="add" size={22} color={colors.onBrand} />
        </View>
      </View>
      <Text allowFontScaling={false} numberOfLines={1} style={styles.label}>
        ثبت
      </Text>
    </Pressable>
  );
}

function DockedTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();

  const cells = [];
  for (const route of state.routes) {
    const tab = TABS.find((t) => t.name === route.name);
    if (!tab) continue;
    if (route.name === 'profile') cells.push(<ReportCell key="report-action" />);
    const isFocused = state.routes[state.index]?.name === route.name;
    const onPress = () => {
      Haptics.selectionAsync().catch(() => {});
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
    };
    cells.push(<TabItem key={route.key} tab={tab} isFocused={isFocused} onPress={onPress} />);
  }

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.barInner}>{cells}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  barInner: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    paddingTop: 6,
  },
  cell: { flex: 1, alignItems: 'center', gap: 4 },
  iconSlot: { height: 34, alignItems: 'center', justifyContent: 'center' },
  indicator: {
    height: 2,
    width: 26,
    borderRadius: 1,
    backgroundColor: 'transparent',
    marginBottom: 3,
  },
  indicatorOn: { backgroundColor: colors.brand[500] },
  label: {
    alignSelf: 'stretch',
    color: colors.textFaint,
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 15,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  labelActive: { color: colors.brand[600], fontFamily: fonts.bold },
  reportSquare: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.brand[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
