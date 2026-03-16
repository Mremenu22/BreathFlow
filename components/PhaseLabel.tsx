import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { PHASE_LABELS } from '../constants/techniques';

interface PhaseLabelProps {
  phaseType: 'inhale' | 'hold' | 'exhale' | 'holdEmpty' | null;
  isActive: boolean;
}

export default function PhaseLabel({ phaseType, isActive }: PhaseLabelProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive && phaseType) {
      opacity.setValue(0);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [phaseType, isActive]);

  const label = phaseType ? PHASE_LABELS[phaseType] : 'READY';

  return (
    <Animated.Text style={[styles.label, { opacity }]}>
      {label}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.label,
    fontSize: 14,
    letterSpacing: 6,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
