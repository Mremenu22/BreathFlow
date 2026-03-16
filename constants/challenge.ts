export interface ChallengeDay {
  day: number;
  title: string;
  mood: string | null;
  duration: number | null;
  description: string;
}

export interface Challenge {
  id: string;
  title: string;
  subtitle: string;
  days: ChallengeDay[];
}

export const breathworkBasics: Challenge = {
  id: 'basics-7day',
  title: 'Breathwork Basics',
  subtitle: '7 days to build your practice',
  days: [
    { day: 1, title: 'Find Your Rhythm', mood: 'calm', duration: 180, description: 'Start with 3 minutes of coherent breathing' },
    { day: 2, title: 'The Relaxing Breath', mood: 'sleep', duration: 240, description: 'Learn the 4-7-8 technique for deep calm' },
    { day: 3, title: 'Focused Precision', mood: 'focus', duration: 240, description: 'Box breathing for clarity and control' },
    { day: 4, title: 'Stress Release', mood: 'stress', duration: 180, description: 'The physiological sigh — a Stanford-backed reset' },
    { day: 5, title: 'Morning Energy', mood: 'energy', duration: 180, description: 'Activate your body with power breathing' },
    { day: 6, title: 'Extend Your Practice', mood: 'calm', duration: 360, description: 'Your longest session yet — 6 minutes of calm' },
    { day: 7, title: 'Your Breath, Your Way', mood: null, duration: null, description: 'Choose any technique and set your own duration' },
  ],
};
