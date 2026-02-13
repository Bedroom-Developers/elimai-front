"use client";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, PDFFont, PDFPage, rgb } from "pdf-lib";


import "@/shared/lib/Nunito-Bold-normal";
import { Ticket } from "../types";
import { downloadPDF, generateQrDataUrl } from "../utils";
const initPdf = async () => {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    return pdfDoc;

}
const getImageExtenstion = (src: string): 'png' | 'jpg' | null => {
    const extension = src.split(".").pop();
    if (!extension) return null;
    return extension.toLowerCase() as 'png' | 'jpg';
}
const matchImageExtension = (extension: 'png' | 'jpg') => {
    switch (extension) {
        case 'png':
            return 'embedPng';
        case 'jpg':
            return 'embedJpg';
        default:
            return null;
    }
}
const addTemplate = async (pdfDoc: PDFDocument, templatePath: string) => {
    const templateBytes = await fetch(templatePath).then((res) =>
        res.arrayBuffer()
    );
    const extension = getImageExtenstion(templatePath);
    if (!extension) return null;
    const imageFunction = matchImageExtension(extension);
    if (!imageFunction) return null;
    const image = await pdfDoc[imageFunction](templateBytes);

    const imageDims = image.scale(1);
    const page = pdfDoc.addPage([imageDims.width, imageDims.height]);
    page.drawImage(image, {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
    });
    return page;
}


const initFont = async (pdfDoc: PDFDocument, fontPath: string) => {
    const fontBytes = await fetch(fontPath).then(
        (res) => res.arrayBuffer()
    );
    return pdfDoc.embedFont(fontBytes);
}
const fillTicketTemplate = async (pdfDoc: PDFDocument, page: PDFPage, font: PDFFont, ticket: Ticket) => {
    const width = page.getWidth();
    const height = page.getHeight();
    const QR_DIM = 100;
    const qrUrl = await generateQrDataUrl(ticket.code);
    const qrImageBytes = await fetch(qrUrl).then((res) => res.arrayBuffer());
    const qrPngImage = await pdfDoc.embedPng(qrImageBytes);
    page.drawImage(qrPngImage, {
        x: (width - QR_DIM) / 2,
        y: (height - QR_DIM - 12) / 2,
        width: QR_DIM,
        height: QR_DIM,
    });

}
const fillCertTemplate = async (
    pdfDoc: PDFDocument,
    page: PDFPage,
    font: PDFFont,
    code: string,
    name: string,
    count: string,
    level: string,
    id: string
) => {
    const qrUrl = await generateQrDataUrl(code);
    // Встраиваем QR-код как изображение в PDF
    const qrImageBytes = await fetch(qrUrl).then((res) => res.arrayBuffer());
    const qrPngImage = await pdfDoc.embedPng(qrImageBytes);

    // Вычисляем размер QR-кода (пропорционально, как в canvas)
    const width = page.getWidth();
    const height = page.getHeight();
    const QR_SIZE = 100; // Базовый размер для расчета
    const BASE_WIDTH = 564; // Базовая ширина для пропорций
    const qrSize = (QR_SIZE / BASE_WIDTH) * width;

    // Рисуем QR-код ПОВЕРХ шаблона (позиция как в canvas)
    // В PDF координаты идут от нижнего левого угла, поэтому инвертируем Y
    const qrX = width / 2 + (100 / BASE_WIDTH) * width + qrSize / 2;
    const qrY = height - (height / 2 + (280 / 800) * height - qrSize / 2);

    page.drawImage(qrPngImage, {
        x: qrX,
        y: qrY - qrSize, // Вычитаем размер, так как координата Y - это нижний левый угол
        width: qrSize,
        height: qrSize,
    });
    // В PDF координаты идут от нижнего левого угла, поэтому нужно инвертировать Y
    const pageHeight = height;

    // name - позиция: height / 2 + 34px от центра (пропорционально)
    const nameFontSize = width * 0.05;
    const nameY = pageHeight - (height / 2 + (34 / 800) * height);
    page.setFont(font);
    page.setFontSize(nameFontSize);
    const nameWidth = font.widthOfTextAtSize(name, nameFontSize);
    page.drawText(name, {
        x: width / 2 - nameWidth / 2,
        y: nameY,
        color: rgb(0, 0, 0),
    });

    // count - позиция: height / 2 + 193px от центра (пропорционально)
    const countFontSize = width * 0.04;
    const countY = pageHeight - (height / 2 + (193 / 800) * height);
    page.setFontSize(countFontSize);
    const countWidth = font.widthOfTextAtSize(count, countFontSize);
    page.drawText(count, {
        x: width / 3 + (17 / 564) * width - countWidth / 2,
        y: countY,
        color: rgb(0, 0, 0),
    });

    // level - позиция: height / 2 + 236px от центра (пропорционально)
    const levelFontSize = width * 0.065;
    const levelY = pageHeight - (height / 2 + (236 / 800) * height);
    page.setFontSize(levelFontSize);
    const levelWidth = font.widthOfTextAtSize(level, levelFontSize);
    page.drawText(level, {
        x: width / 2 + (120 / 564) * width - levelWidth / 2,
        y: levelY,
        color: rgb(0, 0, 0),
    });

    // id - позиция: height / 2 + 280px от центра (пропорционально)
    const idFontSize = width * 0.05;
    const idY = pageHeight - (height / 2 + (280 / 800) * height);
    page.setFontSize(idFontSize);
    const idWidth = font.widthOfTextAtSize(id, idFontSize);
    page.drawText(id, {
        x: width / 4 - 10 - idWidth / 2,
        y: idY,
        color: rgb(0, 0, 0),
    });
};

export const useCreatePdf = () => {
    const downloadTicketsPDF = async (tickets: Ticket[]) => {
        if (tickets.length === 0) return;
        const pdfDoc = await initPdf();
        const font = await initFont(pdfDoc, "/fonts/HelveticaNeue-Roman.otf");
        for (const ticket of tickets) {
            const page = await addTemplate(pdfDoc, "/ticket-template.jpg");
            if (!page) continue;
            await fillTicketTemplate(pdfDoc, page, font, ticket);
        }

        downloadPDF(pdfDoc, "tickets");
    }
    const downloadCertPDF = async (cert: {
        code: string;
        full_name: string;
        shareholder_level: string;
        position: string;
        count: string;
        id: string;
    }) => {
        const pdfDoc = await initPdf();
        const font = await initFont(pdfDoc, "/fonts/HelveticaNeue-Roman.otf");
        const page = await addTemplate(pdfDoc, "/cert-template.png");
        if (!page) return;
        await fillCertTemplate(pdfDoc, page, font, cert.code, cert.full_name, cert.count, cert.shareholder_level, cert.id);
        downloadPDF(pdfDoc, `Certificate - ${cert.full_name}.pdf`);
    }
    return { downloadTicketsPDF, downloadCertPDF };
};
