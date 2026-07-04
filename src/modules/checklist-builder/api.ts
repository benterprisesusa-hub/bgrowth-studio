/**
 * API client for the Checklist Builder GAS backend.
 *
 * All calls go through /api/gas-proxy (a Vercel serverless function) which
 * forwards the request to Google Apps Script server-side. This avoids all
 * CORS and JSONP issues on any browser, device, or incognito mode.
 */
import type { ChecklistTemplate, ChecklistInstance } from './types';
import type { ChecklistData } from '../../engine/types';

// In development, point directly at the mock server.
// In production, use the Vercel proxy.
const IS_DEV = import.meta.env.DEV;
const DEV_URL = 'http://localhost:8787';

async function gasGet<T>(params: Record<string, string>): Promise<T> {
  let url: URL;

  if (IS_DEV) {
    url = new URL(DEV_URL);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  } else {
    url = new URL('/api/gas-proxy', window.location.origin);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString());
  const json = (await res.json()) as { ok: boolean; data: T; error?: string };
  if (!json.ok) throw new Error(json.error ?? 'Unknown GAS error');
  return json.data;
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
