"use client";
import { Ticket } from "@/shared/types";

import { Button } from "@mantine/core";

import "/public/Nunito-Bold-normal.js";

import { useCreatePdf } from "@/shared/hooks";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface DownloadBtnProps {
  tickets: Ticket[];
  type: "ticket" | "sub";
}
export const DownloadBtn = ({ type, tickets }: DownloadBtnProps) => {
  const [loading, setLoading] = useState(false);
  const { createTicket, createSub } = useCreatePdf();
  const download = async () => {
    if (tickets) {
      setLoading(true);
      try {
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
