import html2pdf from 'html2pdf.js';

export async function downloadElementAsPdf(
  element: HTMLElement,
  filename: string,
  pdfOptions?: {
    format?: string;
    orientation?: 'portrait' | 'landscape';
  }
): Promise<void> {
  // Create a deep clone of the element to prevent modifying the live UI
  const clone = element.cloneNode(true) as HTMLElement;

  // Remove the css class that places the original offscreen
  clone.classList.remove('printable-summary');

  // Apply clean inline styles to the clone so html2canvas sees it at x=0, y=0,
  // making it fully visible to html2canvas but invisible to the user behind other layers.
  clone.style.setProperty('position', 'fixed', 'important');
  clone.style.setProperty('left', '0px', 'important');
  clone.style.setProperty('top', '0px', 'important');
  clone.style.setProperty('width', '800px', 'important');
  clone.style.setProperty('z-index', '-99999', 'important');
  clone.style.setProperty('display', 'block', 'important');
  clone.style.setProperty('visibility', 'visible', 'important');
  clone.style.setProperty('opacity', '1', 'important');
  clone.style.setProperty('pointer-events', 'none', 'important');
  clone.style.setProperty('background-color', '#ffffff', 'important');

  // Temporarily mount the clone to document.body so the browser lays it out properly
  document.body.appendChild(clone);

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
      windowWidth: 800,
    },
    jsPDF: {
      unit: 'mm',
      format: (pdfOptions?.format || 'letter').toLowerCase(),
      orientation: pdfOptions?.orientation || 'portrait' as const,
    },
  };

  try {
    await html2pdf().set(options).from(clone).save();
  } finally {
    // Remove the temporary clone from the document
    if (clone.parentNode) {
      clone.parentNode.removeChild(clone);
    }
  }
}
