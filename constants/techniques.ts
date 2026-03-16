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
    color: '#D4915C',
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
    color: '#5C8BD4',
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
    color: '#5CB88A',
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
    color: '#B88AD4',
    isPremium: true,
  },
  {
    id: 'custom',
    name: 'Custom Pattern',
    description: 'Build your own breathing rhythm',
    phases: [],
    color: '#E8B88A',
    isPremium: true,
  },
];

export const PHASE_LABELS: Record<string, string> = {
  inhale: 'INHALE',
  hold: 'HOLD',
  exhale: 'EXHALE',
  holdEmpty: 'HOLD',
};
