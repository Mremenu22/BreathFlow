import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '../constants/colors';
import { techniques, BreathingPhase } from '../constants/techniques';
import { useBreathingEngine } from '../hooks/useBreathingEngine';
import { useHaptics } from '../hooks/useHaptics';
import { useSession } from '../hooks/useSession';
import { getPreferences, completeChallengeDay } from '../utils/storage';
import BreathingRing from '../components/BreathingRing';

export default function BreatheScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const params = useLocalSearchParams<{
    moodId: string;
    techniqueId: string;
    duration: string;
    color: string;
    subtitle: string;
    challengeDay?: string;
  }>();

  const technique = techniques.find((t) => t.id === params.techniqueId) || techniques[0];
  const moodColor = params.color || technique.color;
  const targetDuration = parseInt(params.duration || '300', 10);
  const subtitle = params.subtitle || technique.description;

  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const sessionStartRef = useRef<Date>(new Date());

  useEffect(() => {
    getPreferences().then((prefs) => setHapticsEnabled(prefs.hapticsEnabled));
  }, []);

  const haptics = useHaptics(hapticsEnabled);
  const { completeSession } = useSession();

  const handlePhaseChange = useCallback(
    (phase: BreathingPhase) => {
      switch (phase.type) {
        case 'inhale':
          haptics.inhaleStart();
          break;
        case 'hold':
        case 'holdEmpty':
          haptics.holdStart();
          break;
        case 'exhale':
          haptics.exhaleStart();
          break;
      }
    },
    [haptics]
  );

  const engine = useBreathingEngine(technique, handlePhaseChange);
  const isRunning = engine.state === 'running';

  const handleStart = () => {
    sessionStartRef.current = new Date();
    haptics.sessionStart();
    engine.start();
  };

  const handleStop = async () => {
    const duration = engine.totalElapsed;
    const cycles = engine.cycleCount;
    engine.stop();
    haptics.sessionComplete();

    if (duration >= 5) {
      await completeSession(
        params.moodId || 'manual',
        technique.id,
        duration,
        cycles,
        sessionStartRef.current
      );

      if (params.challengeDay) {
        await completeChallengeDay(parseInt(params.challengeDay, 10));
      }

      router.replace({
        pathname: '/complete',
        params: {
          duration: Math.round(duration).toString(),
          cycles: cycles.toString(),
          techniqueName: technique.name,
          color: moodColor,
        },
      });
    } else {
      router.back();
    }
  };

  // Phase countdown (seconds remaining in current phase)
  const phaseRemaining = engine.currentPhase
    ? Math.max(0, Math.ceil(engine.currentPhase.duration * (1 - Math.min(engine.phaseProgress, 1))))
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        {!isRunning ? (
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Text style={styles.backText}>{'\u2039'} Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}
      </View>

      {/* Subtitle / context */}
      {!isRunning && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}

      {/* Breathing Ring */}
      <View style={styles.ringContainer}>
        <BreathingRing
          progress={engine.phaseProgress}
          phaseType={engine.currentPhase?.type ?? null}
          color={moodColor}
          isActive={isRunning}
          totalElapsed={engine.totalElapsed}
          cycleCount={engine.cycleCount}
          phaseRemaining={phaseRemaining}
          techniqueName={technique.name}
          targetDuration={targetDuration}
          screenWidth={screenWidth}
        />
      </View>

      {/* Bottom area */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={[
            styles.mainButton,
            { width: screenWidth * 0.8 },
            isRunning
              ? styles.stopButton
              : { backgroundColor: moodColor },
          ]}
          onPress={isRunning ? handleStop : handleStart}
          activeOpacity={0.8}
          accessibilityLabel={isRunning ? "Stop breathing session" : "Begin breathing session"}
          accessibilityRole="button"
        >
          <Text style={[styles.mainButtonText, isRunning && { color: moodColor }]}>
            {isRunning ? 'STOP' : 'BEGIN'}
          </Text>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 60,
    minHeight: 44,
  },
  backText: {
    fontSize: 16,
    color: colors.accent.primary,
  },
  subtitle: {
    fontFamily: 'Fraunces-Regular',
    fontSize: 17,
    color: colors.text.secondary,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  ringContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomArea: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  mainButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.text.primary,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  mainButtonText: {
    fontFamily: 'DMMono-Medium',
    fontSize: 13,
    letterSpacing: 3,
    color: colors.text.inverse,
    textTransform: 'uppercase',
  },
  stopButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowOpacity: 0,
  },
});
