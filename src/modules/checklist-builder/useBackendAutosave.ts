import { useCallback, useEffect, useRef, useState } from 'react';
import { api_saveInstance, serializeData } from './api';
import type { ChecklistData } from '../../engine/types';

interface UseBackendAutosaveOptions {
  instanceId: string | null;
  templateId: string;
  ownerEmail: string;
  clientOrJobRef: string;
  data: ChecklistData;
  progressPercent: number;
  /** Debounce delay in ms. Default: 800. */
  delay?: number;
  onInstanceCreated?: (instanceId: string) => void;
}

export function useBackendAutosave({
  instanceId,
  templateId,
  ownerEmail,
  clientOrJobRef,
  data,
  progressPercent,
  delay = 800,
  onInstanceCreated,
}: UseBackendAutosaveOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  // Keep mutable refs so the timer callback always has the latest values
  // without needing to re-register a new timer on every change.
  const instanceIdRef = useRef<string | null>(instanceId);
  const dataRef = useRef(data);
  const progressRef = useRef(progressPercent);
  const clientOrJobRefRef = useRef(clientOrJobRef);
  const onInstanceCreatedRef = useRef(onInstanceCreated);

  useEffect(() => { instanceIdRef.current = instanceId; }, [instanceId]);
  useEffect(() => { dataRef.current = data; }, [data]);
  useEffect(() => { progressRef.current = progressPercent; }, [progressPercent]);
  useEffect(() => { clientOrJobRefRef.current = clientOrJobRef; }, [clientOrJobRef]);
  useEffect(() => { onInstanceCreatedRef.current = onInstanceCreated; }, [onInstanceCreated]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const serializedData = JSON.stringify(data);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setIsSaving(true);
      setSaveError(null);
      try {
        const saved = await api_saveInstance({
          instanceId: instanceIdRef.current ?? undefined,
          templateId: instanceIdRef.current ? undefined : templateId,
          ownerEmail,
          clientOrJobRef: clientOrJobRefRef.current,
          dataJson: serializeData(dataRef.current),
          progressPercent: progressRef.current,
        });
        setLastSavedAt(saved.updatedAt);
        if (!instanceIdRef.current && onInstanceCreatedRef.current) {
          onInstanceCreatedRef.current(saved.instanceId);
        }
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : 'Save failed');
      } finally {
        setIsSaving(false);
      }
    }, delay);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedData, progressPercent]);

  const saveNow = useCallback(async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsSaving(true);
    setSaveError(null);
    try {
      const saved = await api_saveInstance({
        instanceId: instanceIdRef.current ?? undefined,
        templateId: instanceIdRef.current ? undefined : templateId,
        ownerEmail,
        clientOrJobRef: clientOrJobRefRef.current,
        dataJson: serializeData(dataRef.current),
        progressPercent: progressRef.current,
        status: progressRef.current >= 100 ? 'Completed' : 'In Progress',
      });
      setLastSavedAt(saved.updatedAt);
      if (!instanceIdRef.current && onInstanceCreatedRef.current) {
        onInstanceCreatedRef.current(saved.instanceId);
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  }, [templateId, ownerEmail]);

  return { isSaving, saveError, lastSavedAt, saveNow };
}
