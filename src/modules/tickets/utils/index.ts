import { ShareholderScanList200 } from "@/shared/api/generated";
import { IDetectedBarcode } from "@yudiel/react-qr-scanner";

export { downloadPDF } from "./pdf";
export { generateQrDataUrl } from "./qr";

export const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
};

export const isTicketCountValid = ({ count, ticketsCount, limit }: { count: number, ticketsCount: number, limit: number }) => {
    if (count > ticketsCount) return false
    if (count + limit >= 4) return false
    return true
}

export const extractCertLevel = (level?: string) => {
    if (!level) return 0;
    return Number(level.split("-")[0]);
}
export const getSuccessCertScanMessage = (data: ShareholderScanList200, level: number) => {
    return `\n${data.full_name}\nУровень: ${data.shareholder_level}\nБонусы: ${data.bonus_status ? "Активны" : "Не активны"
        }\n ${level <= 2 ? "Срок действия: 31.12.2026" : ""}`
}
export const extractCodeAndType = (value: IDetectedBarcode) => {
    const code = value.rawValue;
    const type = code.split("-")[0];
    return { type, code };
}
