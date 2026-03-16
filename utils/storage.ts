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
  const data = await AsyncStorage.getItem(SESSIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveSession(session: Session): Promise<void> {
  const sessions = await getSessions();
  sessions.unshift(session);
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export async function getPreferences(): Promise<UserPreferences> {
  const data = await AsyncStorage.getItem(PREFS_KEY);
  return data ? { ...defaultPreferences, ...JSON.parse(data) } : defaultPreferences;
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
  const sortedDays = Array.from(days).sort().reverse();

  let current = 0;
  let longest = 0;
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Current streak must include today or yesterday
  if (sortedDays[0] !== today && sortedDays[0] !== yesterday) {
    current = 0;
  }

  for (let i = 0; i < sortedDays.length; i++) {
    const expected = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
    if (sortedDays.includes(expected)) {
      streak++;
    } else {
      if (i <= 1 || current === 0) current = streak;
      longest = Math.max(longest, streak);
      streak = 1;
    }
  }
  if (current === 0) current = streak;
  longest = Math.max(longest, streak);

  return { current, longest };
}

export function getTotalMinutes(sessions: Session[]): number {
  return Math.round(sessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60);
}
