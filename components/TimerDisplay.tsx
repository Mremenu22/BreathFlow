import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { formatTime } from '../utils/formatTime';

interface TimerDisplayProps {
  seconds: number;
  isActive: boolean;
}

export default function TimerDisplay({ seconds, isActive }: TimerDisplayProps) {
  return (
    <Text style={[styles.timer, { opacity: isActive ? 1 : 0.3 }]}>
      {formatTime(seconds)}
    </Text>
  );
}

const styles = StyleSheet.create({
  timer: {
    ...typography.timer,
    color: colors.text.primary,
    textAlign: 'center',
  },
});
