import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Session {
  id: string;
  mood: string;
  techniqueId: string;
  startedAt: string;
  durationSeconds: number;
  cycleCount: number;
}

export interface UserPreferences {
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  selectedTechniqueId: string;
  hasCompletedOnboarding: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string;
  totalSessions: number;
  totalMinutes: number;
}

export interface ChallengeProgress {
  challengeId: string;
  currentDay: number;
  completedDays: number[];
  startedAt: string;
  isComplete: boolean;
}

const SESSIONS_KEY = 'breathflow_sessions';
const PREFS_KEY = 'breathflow_preferences';
const STREAK_KEY = 'breathflow_streak';
const CHALLENGE_KEY = 'breathflow_challenge';

const defaultPreferences: UserPreferences = {
  hapticsEnabled: true,
  soundEnabled: true,
  selectedTechniqueId: 'box',
  hasCompletedOnboarding: false,
};

const defaultStreak: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastSessionDate: '',
  totalSessions: 0,
  totalMinutes: 0,
};

// Sessions
export async function getSessions(): Promise<Session[]> {
  try {
    const data = await AsyncStorage.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function saveSession(session: Session): Promise<void> {
  const sessions = await getSessions();
  sessions.unshift(session);
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  await updateStreak(session.durationSeconds);
}

// Preferences
export async function getPreferences(): Promise<UserPreferences> {
  try {
    const data = await AsyncStorage.getItem(PREFS_KEY);
    return data ? { ...defaultPreferences, ...JSON.parse(data) } : defaultPreferences;
  } catch {
    return defaultPreferences;
  }
}

export async function savePreferences(prefs: Partial<UserPreferences>): Promise<void> {
  const current = await getPreferences();
  await AsyncStorage.setItem(PREFS_KEY, JSON.stringify({ ...current, ...prefs }));
}

// Streak
export async function getStreak(): Promise<StreakData> {
  try {
    const data = await AsyncStorage.getItem(STREAK_KEY);
    return data ? { ...defaultStreak, ...JSON.parse(data) } : defaultStreak;
  } catch {
    return defaultStreak;
  }
}

async function updateStreak(durationSeconds: number): Promise<void> {
  const streak = await getStreak();
  const today = new Date().toISOString().split('T')[0];

  streak.totalSessions += 1;
  streak.totalMinutes += Math.round(durationSeconds / 60);

  if (streak.lastSessionDate === today) {
    // Already tracked today, just update totals
  } else {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (streak.lastSessionDate === yesterday) {
      streak.currentStreak += 1;
    } else if (streak.lastSessionDate === '') {
      streak.currentStreak = 1;
    } else {
      streak.currentStreak = 1;
    }
    streak.lastSessionDate = today;
  }

  streak.longestStreak = Math.max(streak.currentStreak, streak.longestStreak);
  await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(streak));
}

export async function getStreakDisplay(): Promise<StreakData> {
  const streak = await getStreak();
  // Check if streak is still valid (user might not have opened app for days)
  if (streak.lastSessionDate) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (streak.lastSessionDate !== today && streak.lastSessionDate !== yesterday) {
      streak.currentStreak = 0;
    }
  }
  return streak;
}

// Challenge Progress
export async function getChallengeProgress(): Promise<ChallengeProgress | null> {
  try {
    const data = await AsyncStorage.getItem(CHALLENGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function startChallenge(challengeId: string): Promise<ChallengeProgress> {
  const progress: ChallengeProgress = {
    challengeId,
    currentDay: 1,
    completedDays: [],
    startedAt: new Date().toISOString(),
    isComplete: false,
  };
  await AsyncStorage.setItem(CHALLENGE_KEY, JSON.stringify(progress));
  return progress;
}

export async function completeChallengeDay(day: number): Promise<ChallengeProgress | null> {
  const progress = await getChallengeProgress();
  if (!progress) return null;

  if (!progress.completedDays.includes(day)) {
    progress.completedDays.push(day);
  }

  if (day < 7) {
    progress.currentDay = day + 1;
  } else {
    progress.isComplete = true;
  }

  await AsyncStorage.setItem(CHALLENGE_KEY, JSON.stringify(progress));
  return progress;
}

// Helper to format minutes
export function formatMinutesDisplay(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
