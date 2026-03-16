import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { techniques } from '../constants/techniques';
import { getSessions, getStreak, getTotalMinutes, Session } from '../utils/storage';
import { formatDuration } from '../utils/formatTime';

export default function HistoryScreen() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState({ total: 0, minutes: 0, current: 0, longest: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getSessions();
    setSessions(data);
    const streak = getStreak(data);
    setStats({
      total: data.length,
      minutes: getTotalMinutes(data),
      current: streak.current,
      longest: streak.longest,
    });
  };

  const getTechnique = (id: string) => techniques.find((t) => t.id === id);

  const renderSession = ({ item }: { item: Session }) => {
    const technique = getTechnique(item.techniqueId);
    const date = new Date(item.startedAt);
    return (
      <View style={styles.sessionRow}>
        <View style={[styles.dot, { backgroundColor: technique?.color ?? colors.accent.primary }]} />
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionName}>{technique?.name ?? 'Unknown'}</Text>
          <Text style={styles.sessionDate}>
            {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            {' \u00B7 '}
            {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <View style={styles.sessionStats}>
          <Text style={styles.sessionDuration}>{formatDuration(item.durationSeconds)}</Text>
          <Text style={styles.sessionCycles}>{item.cycleCount} cycles</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{'\u2039'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>History</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Stats summary */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>SESSIONS</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.minutes}</Text>
          <Text style={styles.statLabel}>MINUTES</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.current}</Text>
          <Text style={styles.statLabel}>STREAK</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.longest}</Text>
          <Text style={styles.statLabel}>BEST</Text>
        </View>
      </View>

      {sessions.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No sessions yet</Text>
          <Text style={styles.emptySubtext}>Complete your first breathing session to see it here.</Text>
        </View>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={renderSession}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 60,
  },
  backText: {
    ...typography.body,
    color: colors.accent.primary,
  },
  title: {
    ...typography.heading,
    color: colors.text.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.bg.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    ...typography.stat,
    fontSize: 22,
    color: colors.text.primary,
  },
  statLabel: {
    ...typography.label,
    fontSize: 9,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 16,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 14,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionName: {
    ...typography.body,
    fontFamily: 'Jost-SemiBold',
    color: colors.text.primary,
  },
  sessionDate: {
    ...typography.body,
    fontSize: 12,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  sessionStats: {
    alignItems: 'flex-end',
  },
  sessionDuration: {
    ...typography.label,
    color: colors.text.secondary,
  },
  sessionCycles: {
    ...typography.body,
    fontSize: 11,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    ...typography.heading,
    color: colors.text.secondary,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: 8,
  },
});
