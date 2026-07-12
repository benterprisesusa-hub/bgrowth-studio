import jsPDF from 'jspdf';

export async function downloadElementAsPdf(_element: HTMLElement, filename: string, data?: {
  title: string;
  company: string;
  percent: number;
  sections: { title: string; fields: { label: string; value: string }[] }[];
}): Promise<void> {
  if (!data) return;

  const doc = new jsPDF({ unit: 'mm', format: 'letter', orientation: 'portrait' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentW = pageW - margin * 2;
  let y = margin;

  // Header
  doc.setFontSize(18);
  doc.setTextColor(16, 97, 236);
  doc.text(data.title, margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`${data.company} — ${data.percent}% complete`, margin, y);
  y += 10;

  // Sections
  for (const section of data.sections) {
    if (y > 250) { doc.addPage(); y = margin; }

    doc.setFontSize(11);
    doc.setTextColor(16, 97, 236);
    doc.text(section.title, margin, y);
    y += 6;

    for (const field of section.fields) {
      if (!field.value) continue;
      if (y > 260) { doc.addPage(); y = margin; }

      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(`${field.label}:`, margin, y);
      doc.setTextColor(30, 30, 30);
      const lines = doc.splitTextToSize(field.value, contentW - 40);
      doc.text(lines, margin + 40, y);
      y += lines.length * 5 + 2;
    }
    y += 4;
  }

  doc.save(filename);
}
