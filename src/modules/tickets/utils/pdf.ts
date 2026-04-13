import type { PDFDocument } from "pdf-lib";

const revokePdfUrl = (url: string) => {
  URL.revokeObjectURL(url);
};

export const downloadPDF = async (pdfDoc: PDFDocument, name: string) => {
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], {
    type: "application/pdf",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${name}.pdf`;
  link.click();
  revokePdfUrl(link.href);
};
