"use client";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import { useParams } from "next/navigation";

import QrCode from "qrcode";

import "/public/Nunito-Bold-normal.js";

import { Ticket } from "@/shared/types";
export const useCreatePdf = () => {
  const { locale } = useParams();
  const createSub = (code: string) => {
    const doc = new jsPDF(); // Default is 'portrait', 'px' unit
    const templateImage = new Image();
    const pageWidth = doc.internal.pageSize.getWidth();

    const pageHeight = doc.internal.pageSize.getHeight();
    const pageHalf = pageWidth / 2;
    const qrDim = 100;
    const qrImage = new Image();

    templateImage.onload = () => {
      QrCode.toDataURL(code, function (err, url) {
        if (err) {
          console.error("Error generating QR code:", err);
          return;
        }
        qrImage.src = url;
      });
      doc.addImage(templateImage, "JPG", 0, 0, pageWidth, pageHeight);
      doc.addImage(
        qrImage,
        "PNG",
        (pageWidth - qrDim) / 2,
        pageHeight / 2 - qrDim / 2,
        qrDim,
        qrDim,
      );
      doc.save(`Абонемент Eлимай.pdf`);
    };
    templateImage.src = "/2.PNG"; // Path to the template image
  };
  const createTicket = (tickets: Ticket[]) => {
    const elimai = locale == "ru" ? "Елимай" : "Елімай";
    const enemy = locale == "ru" ? tickets[0].name_ru : tickets[0].name_kz;
    const doc = new jsPDF(); // Default is 'portrait', 'px' unit
    const templateImage = new Image();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageHalf = pageWidth / 2;
    const qrDim = 100;

    const generatePage = (ticket: Ticket, idx: number) => {
      const dateStr = dayjs(ticket.date).format("DD.MM.YYYY");
      const timeStr = dayjs(ticket.date).format("HH:mm");

      const qrImage = new Image();
      QrCode.toDataURL(ticket.code, function (err, url) {
        if (err) {
          console.error("Error generating QR code:", err);
          return;
        }
        qrImage.src = url;
      });

      doc.setFont("Nunito-Bold", "normal");
      doc.addImage(templateImage, "JPG", 0, 0, pageWidth, pageHeight);
      doc.addImage(
        qrImage,
        "PNG",
        (pageWidth - qrDim) / 2,
        (pageHeight - qrDim - 12) / 2,
        qrDim,
        qrDim,
      );
      doc.setFontSize(20);
      doc.setTextColor("#697BD3");
      doc.text(enemy.toUpperCase(), pageHalf / 1.6, pageHeight / 2 + 65, {
        align: "center",
      });
      doc.text(
        elimai.toUpperCase(),
        pageHalf + pageHalf / 2.8,
        pageHeight / 2 + 65,
        { align: "center" },
      );

      doc.setFontSize(18);
      doc.setTextColor("#fff");
      doc.text(dateStr, pageHalf, pageHeight / 2 + 83, { align: "center" });

      doc.setFontSize(26);
      doc.setTextColor("#ECE720");
      doc.text(timeStr, pageHalf, pageHeight / 2 + 103, { align: "center" });

      if (idx < tickets.length - 1) {
        doc.addPage();
      }
    };
    templateImage.onload = function () {
      tickets.forEach((ticket, idx) => {
        generatePage(ticket, idx);
      });

      // Save the PDF
      doc.save(`Билет ${elimai} - ${enemy}.pdf`);
    };

    templateImage.src = "/4.png"; // Path to the template image
  };
  return { createTicket, createSub };
};
