import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

export async function downloadElementAsPdf(element: HTMLElement, fileName: string) {
  const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#ffffff" });
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgHeight = (canvas.height * pageWidth) / canvas.width;

  let remaining = imgHeight;
  let position = 0;
  const image = canvas.toDataURL("image/jpeg", 0.95);

  pdf.addImage(image, "JPEG", 0, 0, pageWidth, imgHeight);
  remaining -= pageHeight;
  while (remaining > 0) {
    position -= pageHeight;
    pdf.addPage();
    pdf.addImage(image, "JPEG", 0, position, pageWidth, imgHeight);
    remaining -= pageHeight;
  }
  pdf.save(`${fileName}.pdf`);
}

export async function shareDocument(title: string, text: string) {
  const url = window.location.href;
  const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
  if (nav.share) {
    await nav.share({ title, text, url });
    return "shared";
  }
  await navigator.clipboard.writeText(`${text} ${url}`);
  return "copied";
}
