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
    } else if (section.type === 'checklist' || section.type === 'outcome') {
      content = `<ul style="list-style:none;padding:0;margin:0">` +
        section.items.map((item) => {
          const checked = !!(data[section.id] as Record<string, boolean>)?.[item.id];
          return `<li style="display:flex;align-items:center;gap:8px;margin-bottom:4px;font-size:12px">
            <span style="width:16px;height:16px;border:2px solid ${checked ? '#10b981' : '#94a3b8'};border-radius:3px;background:${checked ? '#10b981' : 'transparent'};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;color:white;font-size:10px">${checked ? '✓' : ''}</span>
            <span style="color:${checked ? '#1e293b' : '#94a3b8'}">${item.label}</span>
          </li>`;
        }).join('') + `</ul>`;
    } else {
      const val = data[section.id] as string || '';
      if (!val) return '';
      content = `<p style="font-size:12px;color:#334155;white-space:pre-wrap">${val}</p>`;
    }

    if (!content.trim()) return '';

    return `<div style="margin-bottom:20px;padding:16px;border:1px solid #e2e8f0;border-radius:8px;break-inside:avoid">
      <h3 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#1061ec;margin:0 0 12px">${section.number}. ${section.title}</h3>
      ${content}
    </div>`;
  }).join('');

  const html = `
    <div style="font-family:Arial,sans-serif;padding:32px;background:#ffffff;color:#1e293b;width:700px">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #e2e8f0;padding-bottom:16px;margin-bottom:24px">
        <div style="display:flex;align-items:center;gap:12px">
          ${logoUrl ? `<img src="${logoUrl}" style="width:48px;height:48px;border-radius:8px;object-fit:cover" />` : ''}
          <div>
            <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#1061ec;margin:0">${companyName}</p>
            <h1 style="font-size:20px;font-weight:700;margin:2px 0 0;color:#0f172a">${config.brand.name}</h1>
          </div>
        </div>
        <div style="text-align:right;font-size:11px;color:#94a3b8">
          <p style="margin:0">Generated ${today}</p>
          <p style="margin:4px 0 0">${percent}% complete</p>
        </div>
      </div>
      ${sectionsHtml}
      <p style="text-align:center;font-size:10px;color:#94a3b8;margin-top:16px">${companyName} — ${config.brand.name}</p>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = html;
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.zIndex = '-1';
  document.body.appendChild(container);

  const options = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' as const },
  };

  try {
    await html2pdf().set(options).from(container).save();
    console.log('PDF saved successfully');
  } catch (err) {
    console.error('PDF error:', err);
  } finally {
    document.body.removeChild(container);
  }
}
