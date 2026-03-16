import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Session {
  id: string;
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

const SESSIONS_KEY = 'breathflow_sessions';
const PREFS_KEY = 'breathflow_preferences';

const defaultPreferences: UserPreferences = {
  hapticsEnabled: true,
  soundEnabled: true,
  selectedTechniqueId: 'box',
  hasCompletedOnboarding: false,
};

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
}

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

export function getStreak(sessions: Session[]): { current: number; longest: number } {
  if (sessions.length === 0) return { current: 0, longest: 0 };

  const days = new Set(
    sessions.map((s) => new Date(s.startedAt).toISOString().split('T')[0])
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Walk backwards from today counting consecutive days
  let current = 0;
  let d = new Date(today);

  // Check if today or yesterday has a session (otherwise current streak is 0)
  const todayStr = d.toISOString().split('T')[0];
  const yesterdayStr = new Date(d.getTime() - 86400000).toISOString().split('T')[0];

  if (!days.has(todayStr) && !days.has(yesterdayStr)) {
    current = 0;
  } else {
    // If no session today, start from yesterday
    if (!days.has(todayStr)) {
      d = new Date(d.getTime() - 86400000);
    }
    while (days.has(d.toISOString().split('T')[0])) {
      current++;
      d = new Date(d.getTime() - 86400000);
    }
  }

  // Find longest streak by sorting all days and walking forward
  const sortedDays = Array.from(days).sort();
  let longest = 0;
  let streak = 1;

  for (let i = 1; i < sortedDays.length; i++) {
    const prev = new Date(sortedDays[i - 1]).getTime();
    const curr = new Date(sortedDays[i]).getTime();
    if (curr - prev <= 86400000) {
      streak++;
    } else {
      longest = Math.max(longest, streak);
      streak = 1;
    }
  }
  longest = Math.max(longest, streak, current);

  return { current, longest };
}

export function getTotalMinutes(sessions: Session[]): number {
  return Math.round(sessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60);
}
