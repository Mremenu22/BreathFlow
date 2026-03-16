export interface BreathingPhase {
  type: 'inhale' | 'hold' | 'exhale' | 'holdEmpty';
  duration: number;
}

export interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  phases: BreathingPhase[];
  color: string;
  isPremium: boolean;
}

export const techniques: BreathingTechnique[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: '4-4-4-4 pattern used by Navy SEALs for calm focus',
    phases: [
      { type: 'inhale', duration: 4 },
      { type: 'hold', duration: 4 },
      { type: 'exhale', duration: 4 },
      { type: 'holdEmpty', duration: 4 },
    ],
    color: '#A48BBD',
    isPremium: false,
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    description: 'The "relaxing breath" for sleep and anxiety relief',
    phases: [
      { type: 'inhale', duration: 4 },
      { type: 'hold', duration: 7 },
      { type: 'exhale', duration: 8 },
    ],
    color: '#7B8DB5',
    isPremium: false,
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing',
    description: '5.5 breaths per minute for optimal heart rate variability',
    phases: [
      { type: 'inhale', duration: 5.5 },
      { type: 'exhale', duration: 5.5 },
    ],
    color: '#8BA89A',
    isPremium: false,
  },
  {
    id: 'power',
    name: 'Power Breathing',
    description: 'Fast rhythm to boost energy and alertness',
    phases: [
      { type: 'inhale', duration: 2 },
      { type: 'exhale', duration: 2 },
    ],
    color: '#D4915C',
    isPremium: false,
  },
  {
    id: 'wimhof',
    name: 'Wim Hof Power Breath',
    description: '30 rapid breaths then hold. Advanced energizing technique.',
    phases: [
      { type: 'inhale', duration: 1.5 },
      { type: 'exhale', duration: 1.5 },
    ],
    color: '#D45C5C',
    isPremium: true,
  },
  {
    id: 'physiological-sigh',
    name: 'Physiological Sigh',
    description: 'Double inhale + long exhale. Stanford-researched stress reset.',
    phases: [
      { type: 'inhale', duration: 2 },
      { type: 'inhale', duration: 1 },
      { type: 'exhale', duration: 6 },
    ],
    color: '#C17F5E',
    isPremium: true,
  },
  {
    id: 'custom',
    name: 'Custom Pattern',
    description: 'Build your own breathing rhythm',
    phases: [],
    color: '#D4A484',
    isPremium: true,
  },
];

export const PHASE_LABELS: Record<string, string> = {
  inhale: 'INHALE',
  hold: 'HOLD',
  exhale: 'EXHALE',
  holdEmpty: 'HOLD',
};
