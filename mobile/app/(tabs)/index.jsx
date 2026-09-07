import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { AuroraBackground } from '../../src/components/ui/AuroraBackground';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { Button } from '../../src/components/ui/Button';
import { Wordmark } from '../../src/components/Brand';
import { ReportCard } from '../../src/components/ReportCard';
import { PendingQueue } from '../../src/components/PendingQueue';
import { useAuth } from '../../src/context/AuthContext';
import { initPush } from '../../src/notifications/pushManager';
import { getGuestReports } from '../../src/api/guestStore';
import { fetchMyReports } from '../../src/api/reports';
import { colors, fonts } from '../../src/theme';

const EMERGENCY = [
  { label: 'پلیس', number: '110', icon: 'shield-checkmark', color: colors.slate },
  { label: 'آتش‌نشانی', number: '125', icon: 'flame', color: colors.rose },
  { label: 'اورژانس', number: '115', icon: 'medkit', color: colors.emerald },
];

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    initPush({ authenticated: isAuthenticated });
  }, [isAuthenticated]);

  const refresh = useCallback(async () => {
    let newest = null;
    try {
      if (isAuthenticated) {
        const mine = await fetchMyReports();
        newest = mine?.[0] || null;
      }
    } catch {
      /* offline */
    }
    if (!newest) {
      const guests = await getGuestReports();
      newest = guests?.[0] ? { ...guests[0], description: guests[0].description } : null;
    }
    setLatest(newest);
  }, [isAuthenticated]);

  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  return (
    <AuroraBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Wordmark size={20} style={styles.brand} />

          <Text style={styles.greeting}>
            {isAuthenticated
              ? `سلام${user?.username ? '، ' + user.username : ''}`
              : 'سلام شهروند گرامی'}
          </Text>

          {/* Primary call to action */}
          <Animated.View entering={FadeInDown.duration(360)}>
            <GlassCard>
              <Text style={styles.ctaTitle}>ثبت گزارش جدید</Text>
              <Text style={styles.ctaText}>
                در کمتر از یک دقیقه، تصویر و موقعیت مشکل را ثبت کنید.
              </Text>
              <Button
                title="شروع گزارش"
                onPress={() => router.push('/report/new')}
                style={{ marginTop: 16 }}
              />
            </GlassCard>
          </Animated.View>

          {/* Live offline outbox */}
          <PendingQueue onSynced={refresh} />

          {/* Latest report */}
          {latest && (
            <Animated.View entering={FadeIn.duration(300)} style={{ marginTop: 14 }}>
              <Text style={styles.sectionLabel}>آخرین گزارش شما</Text>
              <ReportCard report={latest} onPress={() => router.push(`/report/${latest.id}`)} />
            </Animated.View>
          )}

          {/* Emergency contacts */}
          <Text style={styles.section}>تماس‌های اضطراری</Text>
          <GlassCard padded={false}>
            {EMERGENCY.map((e, i) => (
              <Pressable
                key={e.number}
                onPress={() => Linking.openURL(`tel:${e.number}`)}
                style={({ pressed }) => [
                  styles.emRow,
                  i < EMERGENCY.length - 1 && styles.emRowBorder,
                  pressed && { backgroundColor: colors.surface },
                ]}
              >
                <View style={styles.emIcon}>
                  <Ionicons name={e.icon} size={16} color={e.color} />
                </View>
                <Text style={styles.emLabel} numberOfLines={1}>
                  {e.label}
                </Text>
                <Text style={styles.emNumber} allowFontScaling={false}>
                  {e.number}
                </Text>
              </Pressable>
            ))}
          </GlassCard>

          {!isAuthenticated && (
            <View style={styles.guest}>
              <Text style={styles.guestText}>
                با ورود به حساب، گزارش‌ها را روی همهٔ دستگاه‌ها دنبال کنید.
              </Text>
              <Button
                title="ورود / ثبت‌نام"
                variant="ghost"
                onPress={() => router.push('/auth/login')}
              />
            </View>
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 18, paddingTop: 10 },
  brand: { alignSelf: 'stretch', marginBottom: 4 },
  greeting: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 14,
    marginBottom: 16,
  },
  ctaTitle: {
    color: colors.text,
    fontFamily: fonts.black,
    fontSize: 18,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  ctaText: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 6,
    lineHeight: 23,
  },
  sectionLabel: {
    color: colors.textFaint,
    fontFamily: fonts.semibold,
    fontSize: 12,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 8,
  },
  section: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 16,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 26,
    marginBottom: 12,
  },
  emRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  emRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  emIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  emLabel: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.semibold,
    fontSize: 14,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  emNumber: {
    color: colors.textMuted,
    fontFamily: fonts.bold,
    fontSize: 15,
  },
  guest: {
    marginTop: 24,
    alignItems: 'center',
    gap: 8,
  },
  guestText: {
    color: colors.textFaint,
    fontFamily: fonts.regular,
    fontSize: 13,
    textAlign: 'center',
    writingDirection: 'rtl',
    lineHeight: 20,
  },
});
