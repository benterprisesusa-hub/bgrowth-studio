import html2pdf from 'html2pdf.js';

export async function downloadElementAsPdf(element: HTMLElement, filename: string): Promise<void> {
  // Temporarily make element visible for capture
  const prevVisibility = element.style.visibility;
  const prevPosition = element.style.position;
  const prevLeft = element.style.left;
  const prevWidth = element.style.width;
  const prevHeight = element.style.height;
  const prevZIndex = element.style.zIndex;

  element.style.visibility = 'visible';
  element.style.position = 'fixed';
  element.style.left = '0';
  element.style.top = '0';
  element.style.width = '740px';
  element.style.height = 'auto';
  element.style.zIndex = '9999';

  await new Promise((r) => setTimeout(r, 100));

  const options = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' as const },
  };

  try {
    await html2pdf().set(options).from(element).save();
  } finally {
    element.style.visibility = prevVisibility;
    element.style.position = prevPosition;
    element.style.left = prevLeft;
    element.style.width = prevWidth;
    element.style.height = prevHeight;
    element.style.zIndex = prevZIndex;
  }
}
