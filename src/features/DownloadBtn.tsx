"use client";
import { Shareholder, Ticket } from "@/shared/types";

import { Button } from "@mantine/core";

import "/public/Nunito-Bold-normal.js";

import { useCreatePdf } from "@/shared/hooks";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface DownloadBtnProps {
  tickets: Ticket[];
  cert?: Shareholder;
  type: "ticket" | "sub" | "cert";
}
export const DownloadBtn = ({ type, tickets, cert }: DownloadBtnProps) => {
  const [loading, setLoading] = useState(false);
  const { createTicket, createSub, createCert } = useCreatePdf();
  const download = async () => {
    if (tickets) {
      setLoading(true);
      try {
        if (type === "cert") {
          if (cert) {
            await createCert(
              cert.code,
              cert.full_name,
              cert.shareholder_level,
              cert.bonus_status
            );
          }
          return;
        }
        if (type === "ticket") {
          await createTicket(tickets);
        } else {
          await createSub(tickets[0].code);
        }
      } catch (err) {
        console.error("Ошибка при создании PDF:", err);
      } finally {
        setLoading(false);
      }
    }
  };
  const t = useTranslations();
  return (
    <Button
      variant="base"
      onClick={download}
      disabled={loading}
      loading={loading}
    >
      {t("result.download")}
    </Button>
  );
};
