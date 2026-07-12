import html2pdf from 'html2pdf.js';

export async function downloadElementAsPdf(
  element: HTMLElement,
  filename: string,
  pdfOptions?: {
    format?: string;
    orientation?: 'portrait' | 'landscape';
  }
): Promise<void> {
  // Save original style properties
  const originalPosition = element.style.position;
  const originalLeft = element.style.left;
  const originalTop = element.style.top;
  const originalWidth = element.style.width;
  const originalZIndex = element.style.zIndex;
  const originalVisibility = element.style.visibility;
  const originalOpacity = element.style.opacity;

  // Temporarily style it so that html2canvas can capture it perfectly.
  // It must be visible and placed in the layout flow for html2canvas to render it,
  // but we can position it at fixed left: 0, top: 0 with z-index: -99999 so it remains
  // completely invisible to the user behind other elements.
  element.style.setProperty('position', 'fixed', 'important');
  element.style.setProperty('left', '0px', 'important');
  element.style.setProperty('top', '0px', 'important');
  element.style.setProperty('width', '800px', 'important');
  element.style.setProperty('z-index', '-99999', 'important');
  element.style.setProperty('visibility', 'visible', 'important');
  element.style.setProperty('opacity', '1', 'important');

  const options = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
    },
    jsPDF: {
      unit: 'mm',
      format: (pdfOptions?.format || 'letter').toLowerCase(),
      orientation: pdfOptions?.orientation || 'portrait' as const,
    },
  };

  try {
    await html2pdf().set(options).from(element).save();
  } finally {
    // Restore original styles
    element.style.position = originalPosition;
    element.style.left = originalLeft;
    element.style.top = originalTop;
    element.style.width = originalWidth;
    element.style.zIndex = originalZIndex;
    element.style.visibility = originalVisibility;
    element.style.opacity = originalOpacity;
  }
}
