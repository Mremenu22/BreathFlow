import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Canvas, Circle, Group, Paint, Shadow, vec, BlurMask } from '@shopify/react-native-skia';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CANVAS_SIZE = SCREEN_WIDTH * 0.85;
const CENTER = CANVAS_SIZE / 2;
const BASE_RADIUS = CANVAS_SIZE * 0.28;
const MAX_RADIUS = CANVAS_SIZE * 0.38;
const RING_STROKE = 6;

interface BreathingRingProps {
  progress: number; // 0-1 within current phase
  phaseType: 'inhale' | 'hold' | 'exhale' | 'holdEmpty' | null;
  color: string;
  isActive: boolean;
}

export default function BreathingRing({ progress, phaseType, color, isActive }: BreathingRingProps) {
  const radius = React.useMemo(() => {
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
  }, [progress, phaseType, isActive]);

  const glowOpacity = isActive ? 0.3 + progress * 0.3 : 0.1;

  return (
    <View style={styles.container}>
      <Canvas style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
        {/* Outer glow */}
        <Circle cx={CENTER} cy={CENTER} r={radius + 20} color={color} opacity={glowOpacity * 0.15}>
          <BlurMask blur={40} style="normal" />
        </Circle>

        {/* Inner glow */}
        <Circle cx={CENTER} cy={CENTER} r={radius + 8} color={color} opacity={glowOpacity * 0.25}>
          <BlurMask blur={20} style="normal" />
        </Circle>

        {/* Main ring */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={radius}
          color="transparent"
          style="stroke"
          strokeWidth={RING_STROKE}
        >
          <Paint color={color} style="stroke" strokeWidth={RING_STROKE} opacity={0.9} />
        </Circle>

        {/* Inner subtle ring */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={radius - 15}
          color={color}
          style="stroke"
          strokeWidth={1}
          opacity={0.15}
        />

        {/* Outer subtle ring */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={radius + 15}
          color={color}
          style="stroke"
          strokeWidth={1}
          opacity={0.1}
        />

        {/* Center dot */}
        <Circle cx={CENTER} cy={CENTER} r={3} color={color} opacity={isActive ? 0.6 : 0.2} />

        {/* Tick mark (progress indicator around ring) */}
        {isActive && (
          <Circle
            cx={CENTER + radius * Math.cos(progress * Math.PI * 2 - Math.PI / 2)}
            cy={CENTER + radius * Math.sin(progress * Math.PI * 2 - Math.PI / 2)}
            r={4}
            color={color}
            opacity={0.9}
          />
        )}
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
