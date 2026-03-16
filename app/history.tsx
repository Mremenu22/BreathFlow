import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors } from '../constants/colors';
import { techniques } from '../constants/techniques';
import { moods } from '../constants/moods';
import { getSessions, getStreakDisplay, StreakData, Session, formatMinutesDisplay } from '../utils/storage';
import { formatDuration } from '../utils/formatTime';

export default function HistoryScreen() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [streak, setStreak] = useState<StreakData | null>(null);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const [s, st] = await Promise.all([getSessions(), getStreakDisplay()]);
        setSessions(s);
        setStreak(st);
      };
      load();
    }, [])
  );

  const getMoodEmoji = (moodId: string) => {
    const mood = moods.find((m) => m.id === moodId);
    return mood?.emoji || '';
  };

  const getTechniqueName = (id: string) => {
    return techniques.find((t) => t.id === id)?.name || 'Breathing';
  };

  const getTechniqueColor = (id: string) => {
    return techniques.find((t) => t.id === id)?.color || colors.accent.primary;
  };

  // Group sessions by date
  const groupedSessions = sessions.reduce<Record<string, Session[]>>((acc, session) => {
    const date = new Date(session.startedAt);
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);

    let label: string;
    if (date.toDateString() === today.toDateString()) {
      label = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      label = 'Yesterday';
    } else {
      label = date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
    }

    if (!acc[label]) acc[label] = [];
    acc[label].push(session);
    return acc;
  }, {});

  const sectionData = Object.entries(groupedSessions);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{'\u2039'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>History</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Stats bar */}
      {streak && (
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{streak.totalSessions}</Text>
            <Text style={styles.statLabel}>SESSIONS</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{formatMinutesDisplay(streak.totalMinutes)}</Text>
            <Text style={styles.statLabel}>TOTAL TIME</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{streak.currentStreak}</Text>
            <Text style={styles.statLabel}>STREAK</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{streak.longestStreak}</Text>
            <Text style={styles.statLabel}>BEST</Text>
          </View>
        </View>
      )}

      {sessions.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No sessions yet</Text>
          <Text style={styles.emptyText}>Complete a breathing session to see your history here.</Text>
        </View>
      ) : (
        <FlatList
          data={sectionData}
          keyExtractor={([label]) => label}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: [label, groupSessions] }) => (
            <View style={styles.dateGroup}>
              <Text style={styles.dateLabel}>{label}</Text>
              {groupSessions.map((session) => (
                <View key={session.id} style={styles.sessionCard}>
                  <View style={[styles.sessionDot, { backgroundColor: getTechniqueColor(session.techniqueId) }]} />
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionTitle}>
                      {getMoodEmoji(session.mood)} {getTechniqueName(session.techniqueId)}
                    </Text>
                    <Text style={styles.sessionMeta}>
                      {formatDuration(session.durationSeconds)} · {session.cycleCount} cycles · {new Date(session.startedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
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
    fontSize: 16,
    color: colors.accent.primary,
  },
  title: {
    fontFamily: 'Fraunces-SemiBold',
    fontSize: 20,
    color: colors.text.primary,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.bg.secondary,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#2C2520',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  statValue: {
    fontFamily: 'DMMono-Medium',
    fontSize: 18,
    color: colors.text.primary,
  },
  statLabel: {
    fontFamily: 'DMMono-Regular',
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.text.tertiary,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateLabel: {
    fontFamily: 'Fraunces-SemiBold',
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 10,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#2C2520',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  sessionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 14,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  sessionMeta: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontFamily: 'Fraunces-SemiBold',
    fontSize: 20,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
