import * as Haptics from 'expo-haptics';
import { useCallback, useRef, useMemo } from 'react';

export function useHaptics(enabled: boolean = true) {
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const safe = (fn: () => Promise<void>) => {
    try { fn(); } catch {}
  };

  const inhaleStart = useCallback(() => {
    if (enabledRef.current) safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
  }, []);

  const holdStart = useCallback(() => {
    if (enabledRef.current) safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
  }, []);

  const exhaleStart = useCallback(() => {
    if (enabledRef.current) safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft));
  }, []);

  const sessionStart = useCallback(() => {
    if (enabledRef.current) safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
  }, []);

  const sessionComplete = useCallback(() => {
    if (enabledRef.current) safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
  }, []);

  const buttonPress = useCallback(() => {
    if (enabledRef.current) safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
  }, []);

  const techniqueSelect = useCallback(() => {
    if (enabledRef.current) safe(() => Haptics.selectionAsync());
  }, []);

  // Return stable object reference
  return useMemo(() => ({
    inhaleStart,
    holdStart,
    exhaleStart,
    sessionStart,
    sessionComplete,
    buttonPress,
    techniqueSelect,
  }), [inhaleStart, holdStart, exhaleStart, sessionStart, sessionComplete, buttonPress, techniqueSelect]);
}
