import { useState, useRef, useCallback, useEffect } from 'react';
import { BreathingTechnique, BreathingPhase } from '../constants/techniques';

export type EngineState = 'idle' | 'running' | 'paused' | 'completed';

interface BreathingEngineState {
  state: EngineState;
  currentPhaseIndex: number;
  currentPhase: BreathingPhase | null;
  phaseProgress: number;
  totalElapsed: number;
  cycleCount: number;
}

interface BreathingEngineActions {
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

export function useBreathingEngine(
  technique: BreathingTechnique,
  onPhaseChange?: (phase: BreathingPhase) => void
): BreathingEngineState & BreathingEngineActions {
  const [state, setState] = useState<EngineState>('idle');
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseElapsed, setPhaseElapsed] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef(state);
  const phaseIndexRef = useRef(currentPhaseIndex);
  const phaseElapsedRef = useRef(phaseElapsed);
  const totalElapsedRef = useRef(totalElapsed);
  const cycleCountRef = useRef(cycleCount);
  const onPhaseChangeRef = useRef(onPhaseChange);

  stateRef.current = state;
  phaseIndexRef.current = currentPhaseIndex;
  phaseElapsedRef.current = phaseElapsed;
  totalElapsedRef.current = totalElapsed;
  cycleCountRef.current = cycleCount;
  onPhaseChangeRef.current = onPhaseChange;

  const phases = technique.phases;
  const currentPhase = phases.length > 0 ? phases[currentPhaseIndex] : null;
  const phaseProgress = currentPhase ? Math.min(phaseElapsed / currentPhase.duration, 1) : 0;

  const tick = useCallback(() => {
    if (stateRef.current !== 'running' || phases.length === 0) return;

    const newPhaseElapsed = phaseElapsedRef.current + 0.1;
    const newTotalElapsed = totalElapsedRef.current + 0.1;

    const currentPhaseDuration = phases[phaseIndexRef.current].duration;

    if (newPhaseElapsed >= currentPhaseDuration) {
      let nextIndex = phaseIndexRef.current + 1;
      let newCycleCount = cycleCountRef.current;

      if (nextIndex >= phases.length) {
        nextIndex = 0;
        newCycleCount += 1;
      }

      phaseIndexRef.current = nextIndex;
      phaseElapsedRef.current = 0;
      cycleCountRef.current = newCycleCount;

      setCurrentPhaseIndex(nextIndex);
      setPhaseElapsed(0);
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
    setState('running');
    if (onPhaseChangeRef.current && phases.length > 0) {
      onPhaseChangeRef.current(phases[0]);
    }
  }, [phases]);

  const pause = useCallback(() => {
    setState('paused');
  }, []);

  const resume = useCallback(() => {
    setState('running');
  }, []);

  const stop = useCallback(() => {
    setState('idle');
    setCurrentPhaseIndex(0);
    setPhaseElapsed(0);
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
