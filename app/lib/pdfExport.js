/**
 * PDF Export utility
 * Generates a single-page, uninterrupted WhatsApp-style PDF
 */

export async function exportToPDF(containerEl, onProgress) {
  const { default: html2canvas } = await import("html2canvas-pro");
  const { jsPDF } = await import("jspdf");

  onProgress?.(10);

  // Clone the container for rendering
  const clone = containerEl.cloneNode(true);
  clone.classList.add("pdf-container");

  // Style the clone for PDF capture
  clone.style.position = "absolute";
  clone.style.left = "-9999px";
  clone.style.top = "0";
  clone.style.width = "800px";
  clone.style.maxHeight = "none";
  clone.style.height = "auto";
  clone.style.overflow = "visible";

  // Determine theme
  const isLight = document.querySelector('[data-theme="light"]');
  const pdfBgColor = isLight ? "#efeae2" : "#0b141a";
  clone.style.background = pdfBgColor;

  document.body.appendChild(clone);

  // Wait for images and fonts to be ready
  await new Promise(resolve => setTimeout(resolve, 800));

  const totalHeight = clone.scrollHeight;
  onProgress?.(30);

  // Create canvas for the entire chat at once
  // Limit total height to prevent browser crash (canvas limit is usually 32k)
  const finalHeight = Math.min(totalHeight, 32000);

  const canvas = await html2canvas(clone, {
    backgroundColor: pdfBgColor,
    width: 800,
    height: finalHeight,
    scale: 1.5,
    useCORS: true,
    logging: false,
    imageTimeout: 0,
  });

  onProgress?.(80);

  // Create a single-page PDF with exact height
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [800, finalHeight],
    hotfixes: ["px_scaling"]
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.85);
  pdf.addImage(imgData, "JPEG", 0, 0, 800, finalHeight);

  // Clean up
  document.body.removeChild(clone);

  onProgress?.(100);

  // Download
  const dateStr = new Date().toISOString().slice(0, 10);
  pdf.save(`rechat-uninterrupted-${dateStr}.pdf`);
}
