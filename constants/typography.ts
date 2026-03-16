import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  timer: {
    fontFamily: 'DMMono-Medium',
    fontSize: 64,
    letterSpacing: 4,
  },
  heading: {
    fontFamily: 'Jost-SemiBold',
    fontSize: 22,
    letterSpacing: 0.5,
  },
  body: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  label: {
    fontFamily: 'DMMono-Regular',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  stat: {
    fontFamily: 'DMMono-Medium',
    fontSize: 28,
    letterSpacing: 1,
  },
};
