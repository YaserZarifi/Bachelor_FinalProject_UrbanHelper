import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { AuroraBackground } from '../src/components/ui/AuroraBackground';
import { Button } from '../src/components/ui/Button';
import { Wordmark } from '../src/components/Brand';
import { ONBOARDING_KEY } from './index';
import { colors, fonts, radius } from '../src/theme';

const SLIDES = [
  {
    icon: 'location',
    title: 'شهر را بهتر کن',
    text: 'مشکلات شهری را در چند ثانیه گزارش کن و در بهبود محله‌ات سهیم باش.',
  },
  {
    icon: 'camera',
    title: 'ثبت تصویر معتبر',
    text: 'با دوربین درون‌برنامه، عکسِ زنده و ضدجعل می‌گیری؛ بدون امکان بارگذاری از گالری.',
  },
  {
    icon: 'navigate',
    title: 'موقعیت دقیق خودکار',
    text: 'مختصات دقیق از GPS دستگاه به‌صورت خودکار به گزارش پیوست می‌شود.',
  },
  {
    icon: 'notifications',
    title: 'پیگیری زندهٔ وضعیت',
    text: 'به‌محض تغییر وضعیت گزارش، اعلان دریافت می‌کنی و روند رسیدگی را دنبال می‌کنی.',
  },
];

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef(null);
  const [index, setIndex] = useState(0);

  const finish = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, '1');
    router.replace('/(tabs)');
  };

  const next = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      finish();
    }
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: true,
      listener: (e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width)),
    },
  );

  const isLast = index === SLIDES.length - 1;

  return (
    <AuroraBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Wordmark size={18} />
          {!isLast ? (
            <Pressable onPress={finish} hitSlop={12}>
              <Text style={styles.skip}>رد کردن</Text>
            </Pressable>
          ) : (
            <View style={{ width: 60 }} />
          )}
        </View>

        <Animated.FlatList
          ref={listRef}
          data={SLIDES}
          keyExtractor={(_, i) => String(i)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
          renderItem={({ item, index: i }) => (
            <Slide item={item} width={width} index={i} scrollX={scrollX} />
          )}
        />

        <View style={styles.footer}>
          <View style={styles.dots}>
            {SLIDES.map((_, i) => {
              const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
              const scaleX = scrollX.interpolate({
                inputRange,
                outputRange: [1, 3, 1],
                extrapolate: 'clamp',
              });
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View
                  key={i}
                  style={[styles.dot, { opacity, transform: [{ scaleX }] }]}
                />
              );
            })}
          </View>

          <Button
            title={isLast ? 'شروع کنیم' : 'بعدی'}
            onPress={next}
            size="lg"
            style={{ width: '100%' }}
            icon={
              isLast ? null : (
                <Ionicons name="arrow-back" size={18} color={colors.onBrand} />
              )
            }
          />
        </View>
      </SafeAreaView>
    </AuroraBackground>
  );
}

function Slide({ item, width, index, scrollX }) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.9, 1, 0.9],
    extrapolate: 'clamp',
  });
  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.slide, { width }]}>
      <Animated.View style={{ transform: [{ scale }], opacity }}>
        <View style={styles.iconWrap}>
          <Ionicons name={item.icon} size={56} color={colors.brand[600]} />
        </View>
      </Animated.View>
      <Animated.View style={{ opacity }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 8,
  },
  skip: { color: colors.textMuted, fontFamily: fonts.semibold, fontSize: 15, writingDirection: 'rtl' },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36, gap: 36 },
  iconWrap: {
    width: 116,
    height: 116,
    borderRadius: radius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 25,
    textAlign: 'center',
    writingDirection: 'rtl',
    marginBottom: 12,
  },
  text: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 15,
    textAlign: 'center',
    writingDirection: 'rtl',
    lineHeight: 26,
  },
  footer: { paddingHorizontal: 24, paddingBottom: 12, gap: 24 },
  dots: { flexDirection: 'row', alignSelf: 'center', gap: 10 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.brand[500] },
});
