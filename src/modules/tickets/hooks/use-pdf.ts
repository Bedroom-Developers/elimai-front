"use client";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, PDFFont, PDFPage, rgb } from "pdf-lib";

import { getEventTeams } from "@/modules/events/utils";
import dayjsTZ, { tz_5 } from "@/shared/dayjs";

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
const fillTicketTemplate = async (
    pdfDoc: PDFDocument,
    page: PDFPage,
    font: PDFFont,
    ticket: Ticket
) => {
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();
    const pageHalf = pageWidth / 2;

    // QR‑код по центру билета (как в исходной jsPDF‑версии),
    // но масштабируем относительно ширины шаблона.
    const QR_BASE_SIZE = 150;
    const qrSize = (QR_BASE_SIZE / (pageWidth / 3)) * pageWidth;

    const qrUrl = await generateQrDataUrl(ticket.code);
    const qrImageBytes = await fetch(qrUrl).then((res) => res.arrayBuffer());
    const qrPngImage = await pdfDoc.embedPng(qrImageBytes);
    page.drawImage(qrPngImage, {
        x: (pageWidth - qrSize) / 2,
        y: (pageHeight - qrSize - 12) / 2,
        width: qrSize,
        height: qrSize,
    });

    // Команды (Елимай / соперник) — в белой плашке вокруг "VS".
    const { elimai, enemy } = getEventTeams(
        { name_kz: ticket.name_kz, name_ru: ticket.name_ru },
        "ru"
    );

    const teamFontSize = pageWidth * 0.035;
    page.setFont(font);
    page.setFontSize(teamFontSize);

    const titleColor = rgb(0x69 / 255, 0x7b / 255, 0xd3 / 255); // #697BD3

    // В jsPDF координаты шли от верхнего края:
    //   y = pageHeight / 2 + 65
    // Для pdf-lib (система координат от нижнего края) инвертируем:
    const teamCenterYFromTop = pageHeight / 2 + 65;
    const teamY = pageHeight / 3.55;

    // Элимай — центрируем вокруг x = pageHalf / 1.6
    const elimaiText = elimai.toUpperCase();
    const elimaiWidth = font.widthOfTextAtSize(elimaiText, teamFontSize);
    const elimaiCenterX = pageHalf / 1.6;
    const elimaiX = elimaiCenterX - elimaiWidth / 2;

    page.drawText(elimaiText, {
        x: elimaiX,
        y: teamY,
        color: titleColor,
    });

    // Соперник — центрируем вокруг x = pageHalf + pageHalf / 2.8
    const enemyText = enemy.toUpperCase();
    const enemyWidth = font.widthOfTextAtSize(enemyText, teamFontSize);
    const enemyCenterX = pageHalf + pageHalf / 2.8;
    const enemyX = enemyCenterX - enemyWidth / 2;

    page.drawText(enemyText, {
        x: enemyX,
        y: teamY,
        color: titleColor,
    });

    // Дата — по центру под линией команд
    const dateStr = dayjsTZ(ticket.date).tz(tz_5).format("DD.MM.YYYY");
    const dateFontSize = pageWidth * 0.035;
    page.setFontSize(dateFontSize);
    const dateWidth = font.widthOfTextAtSize(dateStr, dateFontSize);

    const dateY = pageHeight / 4.55;

    page.drawText(dateStr, {
        x: pageHalf - dateWidth / 2,
        y: dateY,
        color: rgb(1, 1, 1), // #ffffff
    });

    // Время — крупным шрифтом чуть ниже даты
    const timeStr = dayjsTZ(ticket.date).tz(tz_5).format("HH:mm");
    const timeFontSize = pageWidth * 0.035;
    page.setFontSize(timeFontSize);
    const timeWidth = font.widthOfTextAtSize(timeStr, timeFontSize);

    const timeY = pageHeight / 6;

    page.drawText(timeStr, {
        x: pageHalf - timeWidth / 2,
        y: timeY,
        color: rgb(0xec / 255, 0xe7 / 255, 0x20 / 255), // #ECE720
    });
};
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
            const page = await addTemplate(pdfDoc, "/ticket-template.png");
            if (!page) continue;
            await fillTicketTemplate(pdfDoc, page, font, ticket);
        }

        downloadPDF(pdfDoc, "tickets");
    }
    const renderTicketsPDF = async (tickets: Ticket[]) => {
        if (tickets.length === 0) return null;

        const pdfDoc = await initPdf();
        const font = await initFont(pdfDoc, "/fonts/HelveticaNeue-Roman.otf");

        for (const ticket of tickets) {
            const page = await addTemplate(pdfDoc, "/ticket-template.png");
            if (!page) continue;
            await fillTicketTemplate(pdfDoc, page, font, ticket);
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], {
            type: "application/pdf",
        });

        const url = URL.createObjectURL(blob);
        return url;
    };

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
        await fillCertTemplate(
            pdfDoc,
            page,
            font,
            cert.code,
            cert.full_name,
            cert.count,
            cert.shareholder_level,
            cert.id
        );
        downloadPDF(pdfDoc, `Certificate - ${cert.full_name}.pdf`);
    };
    return { downloadTicketsPDF, downloadCertPDF, renderTicketsPDF };
};
