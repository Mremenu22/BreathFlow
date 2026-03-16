import { useCallback } from 'react';
import { saveSession, Session } from '../utils/storage';

export function useSession() {
  const completeSession = useCallback(
    async (
      techniqueId: string,
      durationSeconds: number,
      cycleCount: number,
      startedAt: Date
    ): Promise<Session> => {
      const session: Session = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        techniqueId,
        startedAt: startedAt.toISOString(),
        durationSeconds: Math.round(durationSeconds),
        cycleCount,
      };
      await saveSession(session);
      return session;
    },
    []
  );

  return { completeSession };
}
