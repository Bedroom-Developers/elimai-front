"use client";
import { getEventTeams } from "@/modules/events/utils";
import { Certificate } from "@/modules/users/types";
import dayjsTZ, { tz_5 } from "@/shared/dayjs";
import { useRef } from "react";
import { Ticket } from "../types";
import { generateQrDataUrl } from "../utils";
import { useCacheTemplateImage } from "./useCacheTemplateImage";
interface DataProps<T> {
    templateUrl: string;
    kind: string;
    data: T
}
export type CanvasData = Ticket | Certificate

const MAX_HEIGHT = 800;
const MAX_WIDTH = 564;
const QR_SIZE = 100;

function isCertificate(data: DataProps<CanvasData>): data is DataProps<Certificate> {
    return data.kind === 'certificate';
}

function isTicket(data: DataProps<CanvasData>): data is DataProps<Ticket> {
    return data.kind === 'ticket';
}


interface ResizeCanvasProps<T> {
    data: T
    c: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    observedWidth: number,
    observedHeight: number,

}
export const useCanvas = <T extends DataProps<CanvasData>>() => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { loadTemplateImage } = useCacheTemplateImage();
    let lastObservedWidth = 0;
    let lastObservedHeight = 0;
    let lastCanvasWidth = 0;
    let lastCanvasHeight = 0;
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const fillCertificate = async (ctx: CanvasRenderingContext2D, width: number, height: number, data: Certificate) => {
        try {
            if (!ctx) {
                throw new Error("Failed to get canvas context");

            }
            const { full_name, count, shareholder_level, position } = data;
            const font = "Helvetica Neue";
            const qrSize = (QR_SIZE / MAX_WIDTH) * width;
            //qr
            const qrUrl = await generateQrDataUrl(data.code);
            const qrImage = await loadTemplateImage(qrUrl);
            ctx.drawImage(
                qrImage,
                width / 2 + (100 / MAX_WIDTH) * width + qrSize / 2,
                height / 2 + (280 / MAX_HEIGHT) * height - qrSize / 2,
                qrSize,
                qrSize
            );

            //name
            ctx.fillStyle = "black";
            ctx.font = `${width * 0.05}px  ${font}`;
            ctx.fillText(
                full_name,
                width / 2 - ctx.measureText(full_name).width / 2,
                height / 2 + (34 / MAX_HEIGHT) * height
            );
            //count
            ctx.fillStyle = "black";
            ctx.font = `${width * 0.04}px  ${font}`;
            ctx.fillText(
                count,
                width / 3 + (17 / MAX_WIDTH) * width - ctx.measureText(count).width / 2,
                height / 2 + (193 / MAX_HEIGHT) * height
            );
            //level
            ctx.fillStyle = "black";
            ctx.font = `${width * 0.065}px  ${font}`;
            ctx.fillText(
                shareholder_level,
                width / 2 + (120 / MAX_WIDTH) * width - ctx.measureText(shareholder_level).width / 2,
                height / 2 + (236 / MAX_HEIGHT) * height
            );
            ctx.fillStyle = "black";
            ctx.font = `${width * 0.05}px  ${font}`;
            ctx.fillText(
                position,
                width / 4 - 10 - ctx.measureText(position).width / 2,
                height / 2 + (280 / MAX_HEIGHT) * height
            );
            //code
        } catch (e) {
            console.error(e);
        }
    }
    const fillTicket = async (ctx: CanvasRenderingContext2D, width: number, height: number, data: Ticket) => {
        try {
            if (!ctx) {
                throw new Error("Failed to get canvas context");
            }

            const pageWidth = width;
            const pageHeight = height;
            const pageHalf = pageWidth / 2;

            // QR‑код по центру билета (как в PDF-версии)
            const QR_BASE_SIZE = 150;
            const qrSize = (QR_BASE_SIZE / (pageWidth / 3)) * pageWidth;

            const qrUrl = await generateQrDataUrl(data.code);
            const qrImage = await loadTemplateImage(qrUrl);

            ctx.drawImage(
                qrImage,
                (pageWidth - qrSize) / 2,
                (pageHeight - qrSize - 12) / 2,
                qrSize,
                qrSize
            );

            // Команды (Елимай / соперник)
            const { elimai, enemy } = getEventTeams(
                { name_kz: data.name_kz, name_ru: data.name_ru },
                "ru"
            );

            const fontFamily = "Helvetica Neue";
            const teamFontSize = pageWidth * 0.035;
            ctx.font = `${teamFontSize}px ${fontFamily}`;
            ctx.fillStyle = "#697BD3"; // #697BD3

            // В PDF координаты считаются от нижнего края,
            // здесь конвертируем те же значения под систему canvas (от верхнего края).
            const teamYFromBottom = pageHeight / 3.55;
            const teamY = pageHeight - teamYFromBottom;

            // Элимай — центрируем вокруг x = pageHalf / 1.6
            const elimaiText = elimai.toUpperCase();
            const elimaiWidth = ctx.measureText(elimaiText).width;
            const elimaiCenterX = pageHalf / 1.6;
            const elimaiX = elimaiCenterX - elimaiWidth / 2;

            ctx.fillText(elimaiText, elimaiX, teamY);

            // Соперник — центрируем вокруг x = pageHalf + pageHalf / 2.8
            const enemyText = enemy.toUpperCase();
            const enemyWidth = ctx.measureText(enemyText).width;
            const enemyCenterX = pageHalf + pageHalf / 2.8;
            const enemyX = enemyCenterX - enemyWidth / 2;

            ctx.fillText(enemyText, enemyX, teamY);

            // Дата — по центру под линией команд
            const dateStr = dayjsTZ(data.date).tz(tz_5).format("DD.MM.YYYY");
            const dateFontSize = pageWidth * 0.035;
            ctx.font = `${dateFontSize}px ${fontFamily}`;
            ctx.fillStyle = "#FFFFFF";
            const dateWidth = ctx.measureText(dateStr).width;

            const dateYFromBottom = pageHeight / 4.55;
            const dateY = pageHeight - dateYFromBottom;

            ctx.fillText(dateStr, pageHalf - dateWidth / 2, dateY);

            // Время — крупным шрифтом чуть ниже даты
            const timeStr = dayjsTZ(data.date).tz(tz_5).format("HH:mm");
            const timeFontSize = pageWidth * 0.035;
            ctx.font = `${timeFontSize}px ${fontFamily}`;
            ctx.fillStyle = "#ECE720"; // #ECE720
            const timeWidth = ctx.measureText(timeStr).width;

            const timeYFromBottom = pageHeight / 6;
            const timeY = pageHeight - timeYFromBottom;

            ctx.fillText(timeStr, pageHalf - timeWidth / 2, timeY);
        } catch (e) {
            console.error(e);
        }
    }

    const fillTemplate = async (ctx: CanvasRenderingContext2D, width: number, height: number, data: T) => {

        try {
            if (!ctx) {
                throw new Error("Failed to get canvas context");
            }
            const image = await loadTemplateImage(data.templateUrl);
            ctx.drawImage(image, 0, 0, width, height);

            if (isCertificate(data)) {
                fillCertificate(ctx, width, height, data.data);
            }
            if (isTicket(data)) {
                fillTicket(ctx, width, height, data.data);
            }

        } catch (e) {

        }
    }


    const resizeCanvas = (
        { data, c, ctx, observedWidth, observedHeight }: ResizeCanvasProps<T>
    ) => {
        try {
            const dpr = window.devicePixelRatio;
            const desiredHeight = observedHeight * dpr;
            const desiredWidth = desiredHeight * 0.706;

            // Проверяем, изменился ли наблюдаемый размер
            if (
                Math.abs(observedWidth - lastObservedWidth) < 1 &&
                Math.abs(observedHeight - lastObservedHeight) < 1
            ) {
                return; // Размер не изменился
            }

            // Проверяем, изменился ли размер canvas
            if (
                Math.abs(desiredWidth - lastCanvasWidth) < 1 &&
                Math.abs(desiredHeight - lastCanvasHeight) < 1
            ) {
                return; // Canvas уже правильного размера
            }

            lastObservedWidth = observedWidth;
            lastObservedHeight = observedHeight;

            // Очищаем предыдущий timeout
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }

            // Debounce изменение размеров
            resizeTimeout = setTimeout(() => {
                c.width = desiredWidth;
                c.height = desiredHeight;
                lastCanvasWidth = desiredWidth;
                lastCanvasHeight = desiredHeight;

                ctx.clearRect(0, 0, c.width, c.height);
                fillTemplate(ctx, c.width, c.height, data);
            }, 100);
        } catch (error) {
            console.error(error);
        }
    };
    const render = (props: ResizeCanvasProps<T>) => {
        resizeCanvas(props);
    }

    return { render, canvasRef }
};