import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { techniques, BreathingTechnique, BreathingPhase } from '../constants/techniques';
import { useBreathingEngine } from '../hooks/useBreathingEngine';
import { useHaptics } from '../hooks/useHaptics';
import { useSession } from '../hooks/useSession';
import BreathingRing from '../components/BreathingRing';
import PhaseLabel from '../components/PhaseLabel';
import TimerDisplay from '../components/TimerDisplay';
import TechniqueSelector from '../components/TechniqueSelector';
import SessionSummary from '../components/SessionSummary';

export default function MainScreen() {
  const router = useRouter();
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique>(techniques[0]);
  const [showSelector, setShowSelector] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [lastSession, setLastSession] = useState({ duration: 0, cycles: 0 });

  const haptics = useHaptics();
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
    haptics.sessionStart();
    engine.start();
  };

  const handleStop = async () => {
    const duration = engine.totalElapsed;
    const cycles = engine.cycleCount;
    engine.stop();
    haptics.sessionComplete();

    if (duration >= 5) {
      await completeSession(selectedTechnique.id, duration, cycles);
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
        <TouchableOpacity onPress={() => router.push('/history')} style={styles.iconButton}>
          <Text style={styles.iconText}>{'\u2630'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/settings')} style={styles.iconButton}>
          <Text style={styles.iconText}>{'\u2699'}</Text>
        </TouchableOpacity>
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <TimerDisplay seconds={engine.totalElapsed} isActive={isRunning} />
      </View>

      {/* Breathing Ring */}
      <View style={styles.ringContainer}>
        <BreathingRing
          progress={engine.phaseProgress}
          phaseType={engine.currentPhase?.type ?? null}
          color={selectedTechnique.color}
          isActive={isRunning}
        />
      </View>

      {/* Phase Label */}
      <PhaseLabel phaseType={engine.currentPhase?.type ?? null} isActive={isRunning} />

      {/* Cycle count */}
      {isRunning && engine.cycleCount > 0 && (
        <Text style={styles.cycleText}>
          {engine.cycleCount} {engine.cycleCount === 1 ? 'cycle' : 'cycles'}
        </Text>
      )}

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
    paddingHorizontal: 20,
    paddingTop: 8,
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
  timerContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  ringContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cycleText: {
    ...typography.label,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: 8,
  },
  bottomArea: {
    alignItems: 'center',
    paddingBottom: 40,
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
    paddingHorizontal: 64,
    paddingVertical: 16,
    borderRadius: 16,
  },
  mainButtonText: {
    ...typography.label,
    fontSize: 14,
    letterSpacing: 4,
    color: colors.bg.primary,
    fontFamily: 'Jost-SemiBold',
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
