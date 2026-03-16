import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  timer: {
    fontFamily: 'DMMono-Medium',
    fontSize: 56,
    letterSpacing: 3,
  },
  heading: {
    fontFamily: 'Fraunces-SemiBold',
    fontSize: 24,
    letterSpacing: -0.3,
  },
  subheading: {
    fontFamily: 'Fraunces-Regular',
    fontSize: 17,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  bodyBold: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
  label: {
    fontFamily: 'DMMono-Regular',
    fontSize: 11,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  stat: {
    fontFamily: 'DMMono-Medium',
    fontSize: 28,
    letterSpacing: 1,
  },
};
