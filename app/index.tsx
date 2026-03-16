import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { techniques, BreathingTechnique, BreathingPhase } from '../constants/techniques';
import { useBreathingEngine } from '../hooks/useBreathingEngine';
import { useHaptics } from '../hooks/useHaptics';
import { useSession } from '../hooks/useSession';
import { getPreferences } from '../utils/storage';
import BreathingRing from '../components/BreathingRing';
import TechniqueSelector from '../components/TechniqueSelector';
import SessionSummary from '../components/SessionSummary';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MainScreen() {
  const router = useRouter();
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique>(techniques[0]);
  const [showSelector, setShowSelector] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [lastSession, setLastSession] = useState({ duration: 0, cycles: 0 });
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

  const engine = useBreathingEngine(selectedTechnique, handlePhaseChange);

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
      await completeSession(selectedTechnique.id, duration, cycles, sessionStartRef.current);
      setLastSession({ duration, cycles });
      setShowSummary(true);
    }
  };

  const handleTechniqueSelect = (technique: BreathingTechnique) => {
    haptics.techniqueSelect();
    setSelectedTechnique(technique);
  };

  const isRunning = engine.state === 'running';

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push('/history')} style={styles.historyButton}>
          <Text style={styles.historyText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/settings')} style={styles.iconButton}>
          <Text style={styles.iconText}>{'\u2699'}</Text>
        </TouchableOpacity>
      </View>

      {/* Breathing Ring — contains timer, phase label, cycle count */}
      <View style={styles.ringContainer}>
        <BreathingRing
          progress={engine.phaseProgress}
          phaseType={engine.currentPhase?.type ?? null}
          color={selectedTechnique.color}
          isActive={isRunning}
          totalElapsed={engine.totalElapsed}
          cycleCount={engine.cycleCount}
        />
      </View>

      {/* Bottom area */}
      <View style={styles.bottomArea}>
        {/* Technique name (tappable) */}
        {!isRunning && (
          <TouchableOpacity
            onPress={() => setShowSelector(true)}
            style={styles.techniqueButton}
            activeOpacity={0.7}
          >
            <View style={[styles.techniqueDot, { backgroundColor: selectedTechnique.color }]} />
            <Text style={styles.techniqueName}>{selectedTechnique.name}</Text>
            <Text style={styles.chevron}>{'\u203A'}</Text>
          </TouchableOpacity>
        )}

        {/* Start/Stop button */}
        <TouchableOpacity
          style={[
            styles.mainButton,
            isRunning ? styles.stopButton : { backgroundColor: selectedTechnique.color },
          ]}
          onPress={isRunning ? handleStop : handleStart}
          activeOpacity={0.8}
        >
          <Text style={[styles.mainButtonText, isRunning && styles.stopButtonText]}>
            {isRunning ? 'STOP' : 'BEGIN'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Technique Selector */}
      <TechniqueSelector
        visible={showSelector}
        selectedId={selectedTechnique.id}
        onSelect={handleTechniqueSelect}
        onClose={() => setShowSelector(false)}
      />

      {/* Session Summary */}
      <SessionSummary
        visible={showSummary}
        technique={selectedTechnique}
        durationSeconds={lastSession.duration}
        cycleCount={lastSession.cycles}
        onDismiss={() => setShowSummary(false)}
      />
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
  historyButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  historyText: {
    ...typography.body,
    fontSize: 14,
    color: colors.text.secondary,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
    color: colors.text.secondary,
  },
  ringContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomArea: {
    alignItems: 'center',
    paddingBottom: 34,
    paddingHorizontal: 24,
    gap: 16,
  },
  techniqueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  techniqueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  techniqueName: {
    ...typography.body,
    color: colors.text.primary,
  },
  chevron: {
    fontSize: 18,
    color: colors.text.tertiary,
    marginLeft: 4,
  },
  mainButton: {
    width: SCREEN_WIDTH * 0.8,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  mainButtonText: {
    fontFamily: 'Jost-SemiBold',
    fontSize: 14,
    letterSpacing: 4,
    color: colors.bg.primary,
    textTransform: 'uppercase',
  },
  stopButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.text.tertiary,
  },
  stopButtonText: {
    color: colors.text.secondary,
  },
});
