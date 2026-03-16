import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { BreathingTechnique, BreathingPhase } from '../constants/techniques';

export type EngineState = 'idle' | 'running' | 'paused' | 'completed';

export function useBreathingEngine(
  technique: BreathingTechnique,
  onPhaseChange?: (phase: BreathingPhase) => void
) {
  const [state, setState] = useState<EngineState>('idle');
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseElapsed, setPhaseElapsed] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickRef = useRef<number>(0);
  const stateRef = useRef(state);
  const phaseIndexRef = useRef(0);
  const phaseElapsedRef = useRef(0);
  const totalElapsedRef = useRef(0);
  const cycleCountRef = useRef(0);
  const onPhaseChangeRef = useRef(onPhaseChange);

  stateRef.current = state;
  onPhaseChangeRef.current = onPhaseChange;

  // Stabilize phases reference
  const phases = useMemo(() => technique.phases, [technique.id]);

  const currentPhase = phases.length > 0 ? phases[currentPhaseIndex] : null;
  const phaseProgress = currentPhase ? Math.min(phaseElapsed / currentPhase.duration, 1) : 0;

  const tick = useCallback(() => {
    if (stateRef.current !== 'running' || phases.length === 0) return;

    const now = Date.now();
    const delta = (now - lastTickRef.current) / 1000;
    lastTickRef.current = now;

    // Clamp delta to avoid huge jumps if app was backgrounded
    const clampedDelta = Math.min(delta, 0.5);

    const newPhaseElapsed = phaseElapsedRef.current + clampedDelta;
    const newTotalElapsed = totalElapsedRef.current + clampedDelta;

    const currentPhaseDuration = phases[phaseIndexRef.current].duration;

    if (newPhaseElapsed >= currentPhaseDuration) {
      let nextIndex = phaseIndexRef.current + 1;
      let newCycleCount = cycleCountRef.current;

      if (nextIndex >= phases.length) {
        nextIndex = 0;
        newCycleCount += 1;
      }

      phaseIndexRef.current = nextIndex;
      phaseElapsedRef.current = newPhaseElapsed - currentPhaseDuration;
      cycleCountRef.current = newCycleCount;

      setCurrentPhaseIndex(nextIndex);
      setPhaseElapsed(phaseElapsedRef.current);
      setCycleCount(newCycleCount);

      if (onPhaseChangeRef.current) {
        onPhaseChangeRef.current(phases[nextIndex]);
      }
    } else {
      phaseElapsedRef.current = newPhaseElapsed;
      setPhaseElapsed(newPhaseElapsed);
    }

    totalElapsedRef.current = newTotalElapsed;
    setTotalElapsed(newTotalElapsed);
  }, [phases]);

  useEffect(() => {
    if (state === 'running') {
      lastTickRef.current = Date.now();
      intervalRef.current = setInterval(tick, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state, tick]);

  const start = useCallback(() => {
    setCurrentPhaseIndex(0);
    setPhaseElapsed(0);
    setTotalElapsed(0);
    setCycleCount(0);
    phaseIndexRef.current = 0;
    phaseElapsedRef.current = 0;
    totalElapsedRef.current = 0;
    cycleCountRef.current = 0;
    lastTickRef.current = Date.now();
    setState('running');
    if (onPhaseChangeRef.current && phases.length > 0) {
      onPhaseChangeRef.current(phases[0]);
    }
  }, [phases]);

  const pause = useCallback(() => setState('paused'), []);
  const resume = useCallback(() => setState('running'), []);

  const stop = useCallback(() => {
    setState('idle');
    setCurrentPhaseIndex(0);
    setPhaseElapsed(0);
    phaseIndexRef.current = 0;
    phaseElapsedRef.current = 0;
  }, []);

  return {
    state,
    currentPhaseIndex,
    currentPhase,
    phaseProgress,
    totalElapsed,
    cycleCount,
    start,
    pause,
    resume,
    stop,
  };
}
