import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { formatDuration } from '../utils/formatTime';
import { BreathingTechnique } from '../constants/techniques';

interface SessionSummaryProps {
  visible: boolean;
  technique: BreathingTechnique;
  durationSeconds: number;
  cycleCount: number;
  onDismiss: () => void;
}

export default function SessionSummary({
  visible,
  technique,
  durationSeconds,
  cycleCount,
  onDismiss,
}: SessionSummaryProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={[styles.colorBar, { backgroundColor: technique.color }]} />
          <Text style={styles.title}>Session Complete</Text>
          <Text style={styles.techniqueName}>{technique.name}</Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatDuration(durationSeconds)}</Text>
              <Text style={styles.statLabel}>DURATION</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{cycleCount}</Text>
              <Text style={styles.statLabel}>CYCLES</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={onDismiss} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  card: {
    backgroundColor: colors.bg.secondary,
    borderRadius: 20,
    padding: 32,
    width: '100%',
    alignItems: 'center',
  },
  colorBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 24,
  },
  title: {
    ...typography.heading,
    color: colors.text.primary,
    marginBottom: 4,
  },
  techniqueName: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statValue: {
    ...typography.stat,
    color: colors.text.primary,
  },
  statLabel: {
    ...typography.label,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.bg.tertiary,
  },
  button: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonText: {
    ...typography.body,
    fontFamily: 'Jost-SemiBold',
    color: colors.bg.primary,
  },
});
