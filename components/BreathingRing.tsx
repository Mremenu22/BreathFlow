import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../constants/colors';
import { PHASE_LABELS } from '../constants/techniques';
import { formatTime } from '../utils/formatTime';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RING_SIZE = SCREEN_WIDTH * 0.68;
const BASE_RADIUS = RING_SIZE * 0.42;
const MAX_RADIUS = RING_SIZE * 0.48;
const RING_STROKE = 6;
const TRACK_STROKE = 2;

interface BreathingRingProps {
  progress: number;
  phaseType: 'inhale' | 'hold' | 'exhale' | 'holdEmpty' | null;
  color: string;
  isActive: boolean;
  totalElapsed: number;
  cycleCount: number;
  phaseRemaining?: number;
  techniqueName?: string;
  targetDuration?: number;
}

export default function BreathingRing({
  progress,
  phaseType,
  color,
  isActive,
  totalElapsed,
  cycleCount,
  phaseRemaining = 0,
  techniqueName = '',
  targetDuration = 300,
}: BreathingRingProps) {
  const radius = (() => {
    if (!isActive || !phaseType) return BASE_RADIUS;
    switch (phaseType) {
      case 'inhale':
        return BASE_RADIUS + (MAX_RADIUS - BASE_RADIUS) * progress;
      case 'hold':
        return MAX_RADIUS;
      case 'exhale':
        return MAX_RADIUS - (MAX_RADIUS - BASE_RADIUS) * progress;
      case 'holdEmpty':
        return BASE_RADIUS;
      default:
        return BASE_RADIUS;
    }
  })();

  const diameter = radius * 2;
  const trackDiameter = BASE_RADIUS * 2 + 10;

  // Tick mark
  const tickAngle = progress * Math.PI * 2 - Math.PI / 2;
  const tickX = RING_SIZE / 2 + radius * Math.cos(tickAngle) - 4;
  const tickY = RING_SIZE / 2 + radius * Math.sin(tickAngle) - 4;

  const phaseLabel = phaseType ? PHASE_LABELS[phaseType] : '';

  return (
    <View style={[styles.container, { width: RING_SIZE, height: RING_SIZE }]}>
      {/* Track ring (always visible) */}
      <View
        style={[
          styles.centered,
          {
            width: trackDiameter,
            height: trackDiameter,
            borderRadius: trackDiameter / 2,
            borderWidth: TRACK_STROKE,
            borderColor: colors.ring.track,
          },
        ]}
      />

      {/* Ambient glow behind active ring */}
      {isActive && (
        <View
          style={[
            styles.centered,
            {
              width: diameter + 30,
              height: diameter + 30,
              borderRadius: (diameter + 30) / 2,
              backgroundColor: color,
              opacity: 0.06,
            },
          ]}
        />
      )}

      {/* Main ring */}
      <View
        style={[
          styles.centered,
          {
            width: diameter,
            height: diameter,
            borderRadius: radius,
            borderWidth: RING_STROKE,
            borderColor: color,
            opacity: isActive ? 0.85 : 0.25,
            shadowColor: color,
            shadowOpacity: isActive ? 0.15 : 0,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 0 },
          },
        ]}
      />

      {/* Inner content */}
      <View style={styles.innerContent}>
        {isActive ? (
          <>
            {/* Active: phase label + countdown */}
            <Text style={[styles.phaseLabel, { color }]}>{phaseLabel}</Text>
            <Text style={[styles.phaseCountdown, { color }]}>{phaseRemaining}s</Text>
            <Text style={styles.elapsed}>{formatTime(totalElapsed)}</Text>
          </>
        ) : (
          <>
            {/* Pre-session: target duration + technique name */}
            <Text style={styles.targetDuration}>{formatTime(targetDuration)}</Text>
            <Text style={styles.techniqueNameInner}>{techniqueName}</Text>
          </>
        )}
      </View>

      {/* Tick mark */}
      {isActive && (
        <View
          style={{
            position: 'absolute',
            left: tickX,
            top: tickY,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: color,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    position: 'absolute',
  },
  innerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseLabel: {
    fontFamily: 'DMMono-Regular',
    fontSize: 16,
    letterSpacing: 6,
    textTransform: 'uppercase',
  },
  phaseCountdown: {
    fontFamily: 'DMMono-Medium',
    fontSize: 36,
    letterSpacing: 2,
    marginTop: 4,
  },
  elapsed: {
    fontFamily: 'DMMono-Regular',
    fontSize: 12,
    letterSpacing: 1,
    color: colors.text.tertiary,
    marginTop: 12,
  },
  targetDuration: {
    fontFamily: 'DMMono-Medium',
    fontSize: 48,
    letterSpacing: 3,
    color: colors.text.primary,
  },
  techniqueNameInner: {
    fontFamily: 'Fraunces-Regular',
    fontSize: 15,
    color: colors.text.secondary,
    marginTop: 6,
    textAlign: 'center',
  },
});
