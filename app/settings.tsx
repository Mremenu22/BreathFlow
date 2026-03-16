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
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Haptic Feedback</Text>
            <Switch
              value={prefs.hapticsEnabled}
              onValueChange={(v) => updatePref('hapticsEnabled', v)}
              trackColor={{ false: colors.bg.tertiary, true: colors.accent.muted }}
              thumbColor={prefs.hapticsEnabled ? colors.accent.primary : '#ccc'}
            />
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Sound on Phase Change</Text>
            <Switch
              value={prefs.soundEnabled}
              onValueChange={(v) => updatePref('soundEnabled', v)}
              trackColor={{ false: colors.bg.tertiary, true: colors.accent.muted }}
              thumbColor={prefs.soundEnabled ? colors.accent.primary : '#ccc'}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SUBSCRIPTION</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push('/paywall')}
            activeOpacity={0.6}
          >
            <Text style={styles.rowLabel}>Upgrade to Premium</Text>
            <Text style={styles.rowChevron}>{'\u203A'}</Text>
          </TouchableOpacity>
          <View style={styles.rowDivider} />
          <TouchableOpacity style={styles.row} activeOpacity={0.6}>
            <Text style={styles.rowLabel}>Restore Purchases</Text>
            <Text style={styles.rowChevron}>{'\u203A'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} activeOpacity={0.6}>
            <Text style={styles.rowLabel}>Privacy Policy</Text>
            <Text style={styles.rowChevron}>{'\u203A'}</Text>
          </TouchableOpacity>
          <View style={styles.rowDivider} />
          <TouchableOpacity style={styles.row} activeOpacity={0.6}>
            <Text style={styles.rowLabel}>Terms of Service</Text>
            <Text style={styles.rowChevron}>{'\u203A'}</Text>
          </TouchableOpacity>
          <View style={styles.rowDivider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Version</Text>
            <Text style={styles.rowValue}>1.1.0</Text>
          </View>
        </View>
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
    fontSize: 16,
    color: colors.accent.primary,
  },
  title: {
    fontFamily: 'Fraunces-SemiBold',
    fontSize: 20,
    color: colors.text.primary,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 28,
  },
  sectionTitle: {
    fontFamily: 'DMMono-Regular',
    fontSize: 10,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: colors.text.tertiary,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: colors.bg.secondary,
    borderRadius: 14,
    shadowColor: '#2C2520',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: 16,
  },
  rowLabel: {
    fontSize: 15,
    color: colors.text.primary,
  },
  rowValue: {
    fontSize: 15,
    color: colors.text.tertiary,
  },
  rowChevron: {
    fontSize: 20,
    color: colors.text.tertiary,
  },
});
