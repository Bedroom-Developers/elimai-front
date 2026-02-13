import { PDFDocument } from "pdf-lib";
import QrCode from "qrcode";
export const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
};
export const generateQrDataUrl = (text: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        QrCode.toDataURL(text, (err, url) => {
            if (err) return reject(err);
            resolve(url);
        });
    });
};
const revokePdfUrl = (url: string) => {
    URL.revokeObjectURL(url);
};
export const downloadPDF = async (pdfDoc: PDFDocument, name: string) => {
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${name}.pdf`;
    link.click();
    revokePdfUrl(link.href);
};

export const isTicketCountValid = ({ count, ticketsCount, limit }: { count: number, ticketsCount: number, limit: number }) => {
    if (count > ticketsCount) return false
    if (count + limit >= 4) return false
    return true
}