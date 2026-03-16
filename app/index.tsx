import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { moods, MoodOption } from '../constants/moods';
import { breathworkBasics } from '../constants/challenge';
import { getStreakDisplay, StreakData, getChallengeProgress, ChallengeProgress, formatMinutesDisplay, startChallenge } from '../utils/storage';
import TechniqueSelector from '../components/TechniqueSelector';
import { techniques } from '../constants/techniques';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_PADDING = 24;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_PADDING * 2 - CARD_GAP) / 2;

export default function HomeScreen() {
  const router = useRouter();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [challenge, setChallenge] = useState<ChallengeProgress | null>(null);
  const [showTechniques, setShowTechniques] = useState(false);

  const loadData = useCallback(async () => {
    const [s, c] = await Promise.all([getStreakDisplay(), getChallengeProgress()]);
    setStreak(s);
    setChallenge(c);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleMoodPress = (mood: MoodOption) => {
    router.push({
      pathname: '/breathe',
      params: {
        moodId: mood.id,
        techniqueId: mood.techniqueId,
        duration: mood.defaultDuration.toString(),
        color: mood.color,
        subtitle: mood.subtitle,
      },
    });
  };

  const handleTechniqueSelect = (technique: typeof techniques[0]) => {
    router.push({
      pathname: '/breathe',
      params: {
        moodId: 'manual',
        techniqueId: technique.id,
        duration: '300',
        color: technique.color,
        subtitle: technique.description,
      },
    });
  };

  const handleChallengeStart = async () => {
    let c = challenge;
    if (!c) {
      c = await startChallenge(breathworkBasics.id);
      setChallenge(c);
    }
    const day = breathworkBasics.days[(c.currentDay || 1) - 1];
    if (!day || !day.mood || !day.duration) return;
    const mood = moods.find((m) => m.id === day.mood);
    if (!mood) return;
    router.push({
      pathname: '/breathe',
      params: {
        moodId: day.mood,
        techniqueId: mood.techniqueId,
        duration: day.duration.toString(),
        color: mood.color,
        subtitle: day.description,
        challengeDay: day.day.toString(),
      },
    });
  };

  const currentChallengeDay = challenge && !challenge.isComplete
    ? breathworkBasics.days[(challenge.currentDay || 1) - 1]
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>breathflow</Text>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>{'\u2699'}</Text>
          </TouchableOpacity>
        </View>

        {/* Question */}
        <Text style={styles.question}>What do you need{'\n'}right now?</Text>

        {/* Challenge Banner */}
        {currentChallengeDay && (
          <TouchableOpacity style={styles.challengeBanner} onPress={handleChallengeStart} activeOpacity={0.7}>
            <View style={styles.challengeLeft}>
              <Text style={styles.challengeDay}>Day {currentChallengeDay.day} of 7</Text>
              <Text style={styles.challengeTitle}>{currentChallengeDay.title}</Text>
            </View>
            <View style={styles.challengeAction}>
              <Text style={styles.challengeActionText}>Start {'\u203A'}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Show "Start Challenge" if no challenge started */}
        {!challenge && (
          <TouchableOpacity style={styles.challengeBanner} onPress={handleChallengeStart} activeOpacity={0.7}>
            <View style={styles.challengeLeft}>
              <Text style={styles.challengeDay}>7-Day Challenge</Text>
              <Text style={styles.challengeTitle}>{breathworkBasics.subtitle}</Text>
            </View>
            <View style={styles.challengeAction}>
              <Text style={styles.challengeActionText}>Begin {'\u203A'}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Mood Grid */}
        <View style={styles.moodGrid}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[styles.moodCard, { borderLeftColor: mood.color }]}
              onPress={() => handleMoodPress(mood)}
              activeOpacity={0.7}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={styles.moodTitle}>{mood.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Choose technique link */}
        <TouchableOpacity style={styles.techniqueLink} onPress={() => setShowTechniques(true)}>
          <Text style={styles.techniqueLinkText}>or choose a technique {'\u203A'}</Text>
        </TouchableOpacity>

        {/* Streak Bar */}
        {streak && streak.totalSessions > 0 && (
          <TouchableOpacity style={styles.streakBar} onPress={() => router.push('/history')} activeOpacity={0.7}>
            <Text style={styles.streakText}>
              {'\uD83D\uDD25'} {streak.currentStreak > 0 ? `Day ${streak.currentStreak}` : 'Start a streak'} · {streak.totalSessions} sessions · {formatMinutesDisplay(streak.totalMinutes)} total
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <TechniqueSelector
        visible={showTechniques}
        selectedId=""
        onSelect={handleTechniqueSelect}
        onClose={() => setShowTechniques(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  scroll: {
    paddingHorizontal: CARD_PADDING,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    marginBottom: 28,
  },
  logo: {
    fontFamily: 'Fraunces-SemiBold',
    fontSize: 18,
    color: colors.text.tertiary,
    letterSpacing: 0.5,
  },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 20,
    color: colors.text.tertiary,
  },
  question: {
    fontFamily: 'Fraunces-SemiBold',
    fontSize: 28,
    letterSpacing: -0.3,
    color: colors.text.primary,
    marginBottom: 24,
    lineHeight: 36,
  },
  challengeBanner: {
    backgroundColor: colors.accent.muted,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  challengeLeft: {
    flex: 1,
  },
  challengeDay: {
    fontFamily: 'DMMono-Regular',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.accent.dark,
    marginBottom: 2,
  },
  challengeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent.dark,
  },
  challengeAction: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  challengeActionText: {
    fontFamily: 'DMMono-Medium',
    fontSize: 12,
    letterSpacing: 1,
    color: colors.text.inverse,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  moodCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.bg.secondary,
    borderRadius: 16,
    padding: 18,
    borderLeftWidth: 3,
    shadowColor: '#2C2520',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 10,
  },
  moodTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    lineHeight: 20,
  },
  techniqueLink: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  techniqueLinkText: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  streakBar: {
    backgroundColor: colors.accent.muted,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  streakText: {
    fontFamily: 'DMMono-Regular',
    fontSize: 12,
    letterSpacing: 0.5,
    color: colors.accent.dark,
  },
});
