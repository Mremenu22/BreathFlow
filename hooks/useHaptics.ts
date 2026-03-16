import * as Haptics from 'expo-haptics';
import { useCallback, useRef } from 'react';

export function useHaptics(enabled: boolean = true) {
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const inhaleStart = useCallback(() => {
    if (enabledRef.current) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const holdStart = useCallback(() => {
    if (enabledRef.current) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const exhaleStart = useCallback(() => {
    if (enabledRef.current) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  }, []);

  const sessionStart = useCallback(() => {
    if (enabledRef.current) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const sessionComplete = useCallback(() => {
    if (enabledRef.current) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const buttonPress = useCallback(() => {
    if (enabledRef.current) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const techniqueSelect = useCallback(() => {
    if (enabledRef.current) Haptics.selectionAsync();
  }, []);

  return {
    inhaleStart,
    holdStart,
    exhaleStart,
    sessionStart,
    sessionComplete,
    buttonPress,
    techniqueSelect,
  };
}
