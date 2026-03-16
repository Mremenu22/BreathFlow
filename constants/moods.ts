import { colors } from './colors';

export interface MoodOption {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  techniqueId: string;
  defaultDuration: number;
  color: string;
}

export const moods: MoodOption[] = [
  {
    id: 'calm',
    emoji: '😌',
    title: 'Calm me down',
    subtitle: "Let's settle your nervous system",
    techniqueId: 'coherent',
    defaultDuration: 300,
    color: colors.mood.calm,
  },
  {
    id: 'sleep',
    emoji: '😴',
    title: 'Help me sleep',
    subtitle: 'A slow rhythm to ease you into rest',
    techniqueId: '478',
    defaultDuration: 480,
    color: colors.mood.sleep,
  },
  {
    id: 'energy',
    emoji: '⚡',
    title: 'Give me energy',
    subtitle: 'Wake up your body and mind',
    techniqueId: 'power',
    defaultDuration: 180,
    color: colors.mood.energy,
  },
  {
    id: 'focus',
    emoji: '🧠',
    title: 'Sharpen my focus',
    subtitle: 'Clear your mind with precision breathing',
    techniqueId: 'box',
    defaultDuration: 300,
    color: colors.mood.focus,
  },
  {
    id: 'stress',
    emoji: '😮‍💨',
    title: 'Release stress',
    subtitle: 'Let the tension go with each exhale',
    techniqueId: 'physiological-sigh',
    defaultDuration: 180,
    color: colors.mood.stress,
  },
  {
    id: 'reset',
    emoji: '🫁',
    title: 'Quick reset',
    subtitle: '90 seconds to reset your state',
    techniqueId: 'box',
    defaultDuration: 90,
    color: colors.mood.reset,
  },
];
