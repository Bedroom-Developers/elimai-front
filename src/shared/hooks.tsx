"use client";
import jsPDF from "jspdf";
import { useParams } from "next/navigation";

import QrCode from "qrcode";

import "/public/Nunito-Bold-normal.js";

import dayjsTZ, { tz_5 } from "@/shared/dayjs";
import { Ticket } from "@/shared/types";
export const useCreatePdf = () => {
    const { locale } = useParams();

    const createSub = async (code: string) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const qrDim = 100;

        // Загрузка изображения по URL или пути
        const loadImage = (src: string): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        };

        // Генерация QR-кода в виде data URL
        const generateQrDataUrl = (text: string): Promise<string> => {
            return new Promise((resolve, reject) => {
                QrCode.toDataURL(text, (err, url) => {
                    if (err) return reject(err);
                    resolve(url);
                });
            });
        };

        try {
            const [templateImage, qrUrl] = await Promise.all([
                loadImage("/aboniment-template.jpg"),
                generateQrDataUrl(code),
            ]);

            const qrImage = await loadImage(qrUrl);

            //err
            doc.addImage(templateImage, "JPEG", 0, 0, pageWidth, pageHeight);
            doc.addImage(
                qrImage,
                "JPEG",
                (pageWidth - qrDim) / 2,
                pageHeight / 2 - qrDim / 2,
                qrDim,
                qrDim,
            );

            doc.save(`Абонемент Елимай.pdf`);
        } catch (err) {
            console.error("Ошибка при генерации абонемента:", err);
        }
    };

    const createTicket = async (tickets: Ticket[], isAdminTicket?: boolean) => {
        const elimai = locale == "ru" ? "Елимай" : "Елімай";
        const enemy = locale == "ru" ? tickets[0].name_ru : tickets[0].name_kz;
        const doc = new jsPDF();

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageHalf = pageWidth / 2;
        const qrDim = 100;

        // Helper: генерирует QR-код и возвращает URL
        const generateQrDataUrl = (text: string): Promise<string> => {
            return new Promise((resolve, reject) => {
                QrCode.toDataURL(text, (err, url) => {
                    if (err) return reject(err);
                    resolve(url);
                });
            });
        };

        // Helper: загружает изображение и возвращает HTMLImageElement
        const loadImage = (src: string): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "anonymous"; // если требуется
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        };

        // Helper: конвертирует Image в data URL с помощью canvas
        const getImageDataUrl = (img: HTMLImageElement): string => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Canvas context is null");
            ctx.drawImage(img, 0, 0);
            return canvas.toDataURL("image/jpeg");
        };

        // Загрузить шаблонное изображение один раз
        const templateImg = await loadImage("/ticket-template.jpg");
        const templateDataUrl = getImageDataUrl(templateImg);

        for (let idx = 0; idx < tickets.length; idx++) {
            const ticket = tickets[idx];
            const dateStr = dayjsTZ(ticket.date).format("DD.MM.YYYY");

            // Генерация QR-кода и загрузка его в виде изображения
            const qrUrl = await generateQrDataUrl(ticket.code);
            const qrImage = await loadImage(qrUrl);

            // Добавляем шаблон для текущей страницы, используя data URL
            doc.addImage(templateDataUrl, "JPEG", 0, 0, pageWidth, pageHeight);

            // Добавляем QR-код
            doc.addImage(
                qrImage,
                "JPEG",
                (pageWidth - qrDim) / 2,
                (pageHeight - qrDim - 12) / 2,
                qrDim,
                qrDim,
            );

            // Рисуем текст
            doc.setFont("Nunito-Bold", "normal");
            doc.setFontSize(20);
            doc.setTextColor("#697BD3");
            doc.text(elimai.toUpperCase(), pageHalf / 1.6, pageHeight / 2 + 65, {
                align: "center",
            });
            doc.text(
                enemy.toUpperCase(),
                pageHalf + pageHalf / 2.8,
                pageHeight / 2 + 65,
                { align: "center" },
            );

            doc.setFontSize(18);
            doc.setTextColor("#fff");
            doc.text(dateStr, pageHalf, pageHeight / 2 + 83, { align: "center" });
            if (!isAdminTicket) {
                const timeStr = dayjsTZ(ticket.date).tz(tz_5).format("HH:mm");
                doc.setFontSize(26);
                doc.setTextColor("#ECE720");
                doc.text(timeStr, pageHalf, pageHeight / 2 + 103, { align: "center" });
            }

            // Если билет не последний – добавляем страницу
            if (idx < tickets.length - 1) {
                doc.addPage();
            }
        }

        // Сохраняем PDF
        doc.save(`Билет ${elimai} - ${enemy}.pdf`);
    };

    return { createTicket, createSub };
};
