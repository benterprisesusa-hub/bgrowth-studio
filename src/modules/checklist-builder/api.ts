/**
 * API client for the Checklist Builder GAS backend.
 */
import type { ChecklistTemplate, ChecklistInstance } from './types';
import type { ChecklistData } from '../../engine/types';

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

async function gasPost<T>(params: Record<string, string>): Promise<T> {
  // Ajustado para bater na mesma rota unificada '/api/gas-proxy' usando POST
  const endpoint = IS_DEV ? DEV_URL : '/api/gas-proxy'; 
  
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json as T;
}
export async function api_getTemplates(ownerEmail: string): Promise<ChecklistTemplate[]> {
  return gasGet({ action: 'checklist_getTemplates', ownerEmail });
}

export async function api_getTemplate(templateId: string): Promise<ChecklistTemplate> {
  return gasGet({ action: 'checklist_getTemplate', templateId });
}

export async function api_saveTemplate(payload: { ... }) {
  return gasPost({
    action: 'checklist_saveTemplate',
    ownerEmail: payload.ownerEmail,
    payload: JSON.stringify(payload), // Garante que o payload vá serializado em string
  });
}
export async function api_archiveTemplate(templateId: string): Promise<{ templateId: string; status: string }> {
  return gasGet({ action: 'checklist_archiveTemplate', templateId });
}

export async function api_deleteTemplate(templateId: string): Promise<{ templateId: string; deleted: boolean }> {
  return gasGet({ action: 'checklist_deleteTemplate', templateId });
}

export async function api_getInstances(templateId: string, ownerEmail: string): Promise<ChecklistInstance[]> {
  return gasGet({ action: 'checklist_getInstances', templateId, ownerEmail });
}

export async function api_getInstance(instanceId: string): Promise<ChecklistInstance> {
  return gasGet({ action: 'checklist_getInstance', instanceId });
}

export async function api_saveInstance(payload: { ... }) {
  return gasPost({
    action: 'checklist_saveInstance',
    ownerEmail: payload.ownerEmail,
    payload: JSON.stringify(payload), // Garante que o payload vá serializado em string
  });
}
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
