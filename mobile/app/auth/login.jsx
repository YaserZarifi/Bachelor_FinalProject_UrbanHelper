import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AuroraBackground } from '../../src/components/ui/AuroraBackground';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { Button } from '../../src/components/ui/Button';
import { Wordmark } from '../../src/components/Brand';
import { Field } from '../../src/components/ui/Field';
import { useAuth } from '../../src/context/AuthContext';
import { initPush } from '../../src/notifications/pushManager';
import { colors, fonts, radius } from '../../src/theme';

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      await signIn(username.trim(), password);
      await initPush({ authenticated: true });
      router.back();
    } catch {
      setError('نام کاربری یا رمز عبور نادرست است.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuroraBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.iconBtn}>
            <Ionicons name="close" size={22} color={colors.text} />
          </Pressable>
        </View>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.brand}>
              <Wordmark size={30} />
              <Text style={styles.title}>ورود به حساب</Text>
              <Text style={styles.sub}>گزارش‌هایت را روی همهٔ دستگاه‌ها دنبال کن</Text>
            </View>

            <GlassCard>
              <Field
                label="نام کاربری"
                icon="person-outline"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholder="نام کاربری یا ایمیل"
              />
              <Field
                label="رمز عبور"
                icon="lock-closed-outline"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="••••••••"
                style={{ marginTop: 14 }}
              />
              {error && <Text style={styles.error}>{error}</Text>}
              <Button title="ورود" onPress={submit} loading={loading} size="lg" style={{ marginTop: 18 }} />
            </GlassCard>

            <Pressable onPress={() => router.replace('/auth/register')} style={styles.switch}>
              <Text style={styles.switchText}>
                حساب ندارید؟ <Text style={styles.switchLink}>ثبت‌نام کنید</Text>
              </Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row-reverse', paddingHorizontal: 16, paddingTop: 6 },
  iconBtn: { width: 38, height: 38, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  scroll: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 30 },
  brand: { alignItems: 'center', marginBottom: 26, gap: 10 },
  title: { color: colors.text, fontFamily: fonts.black, fontSize: 22, marginTop: 6, writingDirection: 'rtl' },
  sub: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 14, marginTop: 4, textAlign: 'center', writingDirection: 'rtl', lineHeight: 21 },
  error: { color: colors.rose, fontFamily: fonts.medium, fontSize: 13, textAlign: 'right', writingDirection: 'rtl', marginTop: 12 },
  switch: { alignItems: 'center', marginTop: 22 },
  switchText: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 14, writingDirection: 'rtl' },
  switchLink: { color: colors.brand[600], fontFamily: fonts.bold },
});
