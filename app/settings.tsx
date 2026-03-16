import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { getPreferences, savePreferences, UserPreferences } from '../utils/storage';

export default function SettingsScreen() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);

  useEffect(() => {
    getPreferences().then(setPrefs);
  }, []);

  const updatePref = async (key: keyof UserPreferences, value: boolean) => {
    if (!prefs) return;
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    await savePreferences({ [key]: value });
  };

  if (!prefs) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{'\u2039'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PREFERENCES</Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Haptic Feedback</Text>
          <Switch
            value={prefs.hapticsEnabled}
            onValueChange={(v) => updatePref('hapticsEnabled', v)}
            trackColor={{ false: colors.bg.tertiary, true: colors.accent.dim }}
            thumbColor={prefs.hapticsEnabled ? colors.accent.primary : colors.text.tertiary}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Sound</Text>
          <Switch
            value={prefs.soundEnabled}
            onValueChange={(v) => updatePref('soundEnabled', v)}
            trackColor={{ false: colors.bg.tertiary, true: colors.accent.dim }}
            thumbColor={prefs.soundEnabled ? colors.accent.primary : colors.text.tertiary}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Version</Text>
          <Text style={styles.rowValue}>1.0.0</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SUBSCRIPTION</Text>
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={() => router.push('/paywall')}
          activeOpacity={0.7}
        >
          <Text style={styles.subscribeText}>Upgrade to Premium</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.restoreButton} activeOpacity={0.7}>
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 60,
  },
  backText: {
    ...typography.body,
    color: colors.accent.primary,
  },
  title: {
    ...typography.heading,
    color: colors.text.primary,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.text.tertiary,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bg.secondary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  rowLabel: {
    ...typography.body,
    color: colors.text.primary,
  },
  rowValue: {
    ...typography.body,
    color: colors.text.secondary,
  },
  subscribeButton: {
    backgroundColor: colors.accent.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  subscribeText: {
    ...typography.body,
    fontFamily: 'Jost-SemiBold',
    color: colors.bg.primary,
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  restoreText: {
    ...typography.body,
    color: colors.text.tertiary,
    fontSize: 13,
  },
});
