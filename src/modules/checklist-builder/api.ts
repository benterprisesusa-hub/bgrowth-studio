/**
 * API client for the Checklist Builder GAS backend.
 *
 * All calls are GET-based (matching BGrowth Club's existing CORS workaround).
 * Writes pass a JSON payload as a single URL-encoded query param.
 *
 * The base URL is read from import.meta.env.VITE_GAS_URL — the same env
 * variable used by all other BGrowth Club modules.  During local development
 * point it at the mock server (see scripts/mock-gas-server.mjs).
 */
import type { ChecklistTemplate, ChecklistInstance } from './types';
import type { ChecklistData } from '../../engine/types';

const BASE = import.meta.env.VITE_GAS_URL as string;

// -----------------------------------------------------------------------
// Core JSONP helper — avoids CORS issues with Google Apps Script.
// GAS doesn't return Access-Control-Allow-Origin headers, so standard
// fetch() gets blocked by the browser. JSONP works by injecting a
// <script> tag instead, which is not subject to CORS restrictions.
// -----------------------------------------------------------------------
function gasGet<T>(params: Record<string, string>): Promise<T> {
  return new Promise((resolve, reject) => {
    const callbackName = `gasCallback_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const url = new URL(BASE);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    url.searchParams.set('callback', callbackName);

    const script = document.createElement('script');
    script.src = url.toString();

    const cleanup = () => {
      delete (window as Record<string, unknown>)[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
    };

    (window as Record<string, unknown>)[callbackName] = (response: { ok: boolean; data: T; error?: string }) => {
      cleanup();
      if (response.ok) {
        resolve(response.data);
      } else {
        reject(new Error(response.error ?? 'Unknown GAS error'));
      }
    };

    script.onerror = () => {
      cleanup();
      reject(new Error('Failed to reach the GAS backend. Check your VITE_GAS_URL.'));
    };

    document.head.appendChild(script);
  });
}

// -----------------------------------------------------------------------
// Templates
// -----------------------------------------------------------------------
export async function api_getTemplates(ownerEmail: string): Promise<ChecklistTemplate[]> {
  return gasGet({ action: 'checklist_getTemplates', ownerEmail });
}

export async function api_getTemplate(templateId: string): Promise<ChecklistTemplate> {
  return gasGet({ action: 'checklist_getTemplate', templateId });
}

/** Create (no templateId) or update (with templateId) a template. */
export async function api_saveTemplate(payload: {
  templateId?: string;
  ownerEmail: string;
  name: string;
  configJson: string;
  status?: string;
}): Promise<ChecklistTemplate> {
  return gasGet({ action: 'checklist_saveTemplate', payload: JSON.stringify(payload) });
}

export async function api_archiveTemplate(templateId: string): Promise<{ templateId: string; status: string }> {
  return gasGet({ action: 'checklist_archiveTemplate', templateId });
}

export async function api_deleteTemplate(templateId: string): Promise<{ templateId: string; deleted: boolean }> {
  return gasGet({ action: 'checklist_deleteTemplate', templateId });
}

// -----------------------------------------------------------------------
// Instances
// -----------------------------------------------------------------------
export async function api_getInstances(templateId: string, ownerEmail: string): Promise<ChecklistInstance[]> {
  return gasGet({ action: 'checklist_getInstances', templateId, ownerEmail });
}

export async function api_getInstance(instanceId: string): Promise<ChecklistInstance> {
  return gasGet({ action: 'checklist_getInstance', instanceId });
}

/** Create (no instanceId) or autosave (with instanceId) an instance. */
export async function api_saveInstance(payload: {
  instanceId?: string;
  templateId?: string;
  ownerEmail: string;
  clientOrJobRef?: string;
  dataJson: string;
  progressPercent: number;
  status?: string;
}): Promise<ChecklistInstance> {
  return gasGet({ action: 'checklist_saveInstance', payload: JSON.stringify(payload) });
}

// -----------------------------------------------------------------------
// Convenience helpers used by the Fill screen
// -----------------------------------------------------------------------
export function serializeData(data: ChecklistData): string {
  return JSON.stringify(data);
}

export function deserializeData(dataJson: string): ChecklistData {
  try {
    return JSON.parse(dataJson) as ChecklistData;
  } catch {
    return {};
  }
}
