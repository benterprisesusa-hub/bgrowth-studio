import html2pdf from 'html2pdf.js';

export async function downloadElementAsPdf(element: HTMLElement, filename: string): Promise<void> {
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = 'fixed';
  clone.style.top = '0';
  clone.style.left = '0';
  clone.style.width = '740px';
  clone.style.zIndex = '-9999';
  clone.style.backgroundColor = '#ffffff';
  document.body.appendChild(clone);

  const options = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' as const },
  };

  try {
    await html2pdf().set(options).from(clone).save();
  } finally {
    document.body.removeChild(clone);
  }
}
