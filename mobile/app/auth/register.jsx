import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
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

export default function Register() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    if (password.length < 8) {
      setError('رمز عبور باید حداقل ۸ نویسه باشد.');
      return;
    }
    setLoading(true);
    try {
      await signUp(username.trim(), email.trim(), password);
      await initPush({ authenticated: true });
      router.replace('/(tabs)');
    } catch {
      setError('ثبت‌نام ناموفق بود (کاربر تکراری یا دادهٔ نادرست).');
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
              <Text style={styles.title}>ساخت حساب کاربری</Text>
              <Text style={styles.sub}>به جامعهٔ شهروندان فعال بپیوندید</Text>
            </View>

            <GlassCard>
              <Field label="نام کاربری" icon="person-outline" value={username} onChangeText={setUsername} autoCapitalize="none" placeholder="یک نام کاربری انتخاب کنید" />
              <Field label="ایمیل" icon="mail-outline" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="example@mail.com" style={{ marginTop: 14 }} />
              <Field label="رمز عبور" icon="lock-closed-outline" value={password} onChangeText={setPassword} secureTextEntry placeholder="حداقل ۸ نویسه" style={{ marginTop: 14 }} />
              {error && <Text style={styles.error}>{error}</Text>}
              <Button title="ثبت‌نام" onPress={submit} loading={loading} size="lg" style={{ marginTop: 18 }} />
            </GlassCard>

            <Pressable onPress={() => router.replace('/auth/login')} style={styles.switch}>
              <Text style={styles.switchText}>
                حساب دارید؟ <Text style={styles.switchLink}>وارد شوید</Text>
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
