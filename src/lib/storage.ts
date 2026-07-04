import type { ChecklistData } from '../engine/types';

const NAMESPACE = 'bgrowth.checklist';

const dataKey = (productId: string) => `${NAMESPACE}.${productId}.data.v1`;
const openSectionKey = (productId: string) => `${NAMESPACE}.${productId}.open-section.v1`;
const lastSavedKey = (productId: string) => `${NAMESPACE}.${productId}.last-saved.v1`;

export function loadFormData(productId: string): ChecklistData | null {
  try {
    const raw = window.localStorage.getItem(dataKey(productId));
    if (!raw) return null;
    return JSON.parse(raw) as ChecklistData;
  } catch {
    return null;
  }
}

export function saveFormData(productId: string, data: ChecklistData): void {
  try {
    window.localStorage.setItem(dataKey(productId), JSON.stringify(data));
    window.localStorage.setItem(lastSavedKey(productId), new Date().toISOString());
  } catch {
    // localStorage may be unavailable (private browsing, quota); fail silently.
  }
}

export function clearFormData(productId: string): void {
  try {
    window.localStorage.removeItem(dataKey(productId));
    window.localStorage.removeItem(openSectionKey(productId));
    window.localStorage.removeItem(lastSavedKey(productId));
  } catch {
    // ignore
  }
}

export function loadOpenSection(productId: string): string | null {
  try {
    return window.localStorage.getItem(openSectionKey(productId));
  } catch {
    return null;
  }
}

export function saveOpenSection(productId: string, sectionId: string): void {
  try {
    window.localStorage.setItem(openSectionKey(productId), sectionId);
  } catch {
    // ignore
  }
}

export function getLastSavedAt(productId: string): string | null {
  try {
    return window.localStorage.getItem(lastSavedKey(productId));
  } catch {
    return null;
  }
}
