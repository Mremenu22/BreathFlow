import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { PHASE_LABELS } from '../constants/techniques';
import { formatTime } from '../utils/formatTime';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RING_SIZE = SCREEN_WIDTH * 0.65;
const BASE_RADIUS = RING_SIZE * 0.42;
const MAX_RADIUS = RING_SIZE * 0.50;
const RING_STROKE = 5;

interface BreathingRingProps {
  progress: number;
  phaseType: 'inhale' | 'hold' | 'exhale' | 'holdEmpty' | null;
  color: string;
  isActive: boolean;
  totalElapsed: number;
  cycleCount: number;
}

export default function BreathingRing({
  progress,
  phaseType,
  color,
  isActive,
  totalElapsed,
  cycleCount,
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

  const glowOpacity = isActive ? 0.3 + progress * 0.3 : 0.1;
  const diameter = radius * 2;

  // Tick mark position
  const tickAngle = progress * Math.PI * 2 - Math.PI / 2;
  const tickX = RING_SIZE / 2 + radius * Math.cos(tickAngle) - 4;
  const tickY = RING_SIZE / 2 + radius * Math.sin(tickAngle) - 4;

  const phaseLabel = phaseType ? PHASE_LABELS[phaseType] : 'READY';

  return (
    <View style={[styles.container, { width: RING_SIZE, height: RING_SIZE }]}>
      {/* Outer glow */}
      <View
        style={[
          styles.centered,
          {
            width: diameter + 50,
            height: diameter + 50,
            borderRadius: (diameter + 50) / 2,
            backgroundColor: color,
            opacity: glowOpacity * 0.08,
          },
        ]}
      />

      {/* Inner glow */}
      <View
        style={[
          styles.centered,
          {
            width: diameter + 20,
            height: diameter + 20,
            borderRadius: (diameter + 20) / 2,
            backgroundColor: color,
            opacity: glowOpacity * 0.12,
          },
        ]}
      />

      {/* Outer subtle ring */}
      <View
        style={[
          styles.centered,
          {
            width: diameter + 24,
            height: diameter + 24,
            borderRadius: (diameter + 24) / 2,
            borderWidth: 1,
            borderColor: color,
            opacity: 0.08,
          },
        ]}
      />

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
            opacity: 0.9,
          },
        ]}
      />

      {/* Inner subtle ring */}
      <View
        style={[
          styles.centered,
          {
            width: diameter - 24,
            height: diameter - 24,
            borderRadius: (diameter - 24) / 2,
            borderWidth: 1,
            borderColor: color,
            opacity: 0.12,
          },
        ]}
      />

      {/* Content INSIDE the ring */}
      <View style={styles.innerContent}>
        <Text style={[styles.timer, { opacity: isActive ? 1 : 0.3 }]}>
          {formatTime(totalElapsed)}
        </Text>
        <Text
          style={[
            styles.phaseLabel,
            {
              color: isActive ? color : colors.text.tertiary,
              opacity: isActive ? 1 : 0.4,
            },
          ]}
        >
          {phaseLabel}
        </Text>
        {isActive && cycleCount > 0 && (
          <Text style={styles.cycleText}>
            {cycleCount} {cycleCount === 1 ? 'cycle' : 'cycles'}
          </Text>
        )}
      </View>

      {/* Center dot */}
      {!isActive && (
        <View
          style={[
            styles.centered,
            {
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: color,
              opacity: 0.2,
            },
          ]}
        />
      )}

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
            opacity: 0.9,
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
  timer: {
    fontFamily: 'DMMono-Medium',
    fontSize: 48,
    letterSpacing: 3,
    color: colors.text.primary,
  },
  phaseLabel: {
    fontFamily: 'DMMono-Regular',
    fontSize: 16,
    letterSpacing: 6,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  cycleText: {
    fontFamily: 'DMMono-Regular',
    fontSize: 11,
    letterSpacing: 2,
    color: colors.text.tertiary,
    marginTop: 10,
    textTransform: 'uppercase',
  },
});
