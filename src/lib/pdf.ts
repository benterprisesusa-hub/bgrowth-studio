import html2pdf from 'html2pdf.js';

export async function downloadElementAsPdf(
  element: HTMLElement,
  filename: string,
  pdfOptions?: {
    format?: string;
    orientation?: 'portrait' | 'landscape';
  }
): Promise<void> {
  const options = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    },
    jsPDF: {
      unit: 'mm',
      format: (pdfOptions?.format || 'letter').toLowerCase(),
      orientation: pdfOptions?.orientation || ('portrait' as const),
    },
  };

  await html2pdf().set(options).from(element).save();
}
