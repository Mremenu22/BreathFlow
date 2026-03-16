import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../constants/colors';
import { formatDuration } from '../utils/formatTime';

export default function CompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    duration: string;
    cycles: string;
    techniqueName: string;
    color: string;
  }>();

  const duration = parseInt(params.duration || '0', 10);
  const cycles = parseInt(params.cycles || '0', 10);
  const accentColor = params.color || colors.accent.primary;

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const statsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerOpacity, {
      toValue: 1,
      duration: 600,
      delay: 100,
      useNativeDriver: true,
    }).start();

    Animated.timing(statsOpacity, {
      toValue: 1,
      duration: 600,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Checkmark */}
        <Animated.View style={{ opacity: headerOpacity, alignItems: 'center' }}>
          <View style={[styles.checkCircle, { borderColor: accentColor }]}>
            <Text style={[styles.checkMark, { color: accentColor }]}>{'\u2713'}</Text>
          </View>

          <Text style={styles.title}>Well done.</Text>
        </Animated.View>
        <Text style={styles.techniqueName}>{params.techniqueName}</Text>

        {/* Stats */}
        <Animated.View style={[styles.statsCard, { opacity: statsOpacity }]}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatDuration(duration)}</Text>
            <Text style={styles.statLabel}>DURATION</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{cycles}</Text>
            <Text style={styles.statLabel}>CYCLES</Text>
          </View>
        </Animated.View>

        {/* Done button */}
        <TouchableOpacity
          style={[styles.doneButton, { backgroundColor: accentColor }]}
          onPress={() => router.replace('/')}
          activeOpacity={0.8}
          accessibilityLabel="Done, return to home"
          accessibilityRole="button"
        >
          <Text style={styles.doneText}>Done</Text>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  checkMark: {
    fontSize: 32,
    fontWeight: '300',
  },
  title: {
    fontFamily: 'Fraunces-SemiBold',
    fontSize: 28,
    color: colors.text.primary,
    marginBottom: 4,
  },
  techniqueName: {
    fontSize: 15,
    color: colors.text.secondary,
    marginBottom: 36,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.bg.secondary,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    shadowColor: colors.text.primary,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 40,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'DMMono-Medium',
    fontSize: 28,
    letterSpacing: 1,
    color: colors.text.primary,
  },
  statLabel: {
    fontFamily: 'DMMono-Regular',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.text.tertiary,
    marginTop: 6,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  doneButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneText: {
    fontFamily: 'DMMono-Medium',
    fontSize: 13,
    letterSpacing: 3,
    color: colors.text.inverse,
    textTransform: 'uppercase',
  },
});
