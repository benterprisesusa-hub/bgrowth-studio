import html2pdf from 'html2pdf.js';
import type { ChecklistConfig, ChecklistData } from '../engine/types';

export async function downloadElementAsPdf(_element: HTMLElement, _filename: string): Promise<void> {
  // não usado
}

export async function downloadChecklistAsPdf(
  config: ChecklistConfig,
  data: ChecklistData,
  percent: number,
  filename: string,
  companyName: string,
  logoUrl: string | null
): Promise<void> {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const sectionsHtml = config.sections.map((section) => {
    let content = '';

    if (section.type === 'form') {
      content = section.fields.map((f) => {
        const val = (data[section.id] as Record<string, string>)?.[f.id] || '';
        if (!val) return '';
        return `<div style="display:flex;gap:8px;margin-bottom:6px;font-size:12px">
          <span style="width:150px;font-weight:600;color:#64748b;flex-shrink:0">${f.label}</span>
          <span style="color:#1e293b">${val}</span>
        </div>`;
      }).join('');
    } else if (section.type ===
