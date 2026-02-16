"use client";

import { rScanCert, rScanSub, rScanTicket } from "@/shared/api/games";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import dayjs from "dayjs";
import { CheckIcon, Loader2, QrCode, XIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

const resultMsg = {
  event:
    "Ваш билет не соответствует текущему матчу. Проверьте информацию на билете или обратитесь в службу поддержки.",
  scan: "Сканирование успешно! Добро пожаловать на матч.",
  "not-scan": "Ошибка: данный билет уже использован.",
  "not-found": "Билет не найден.",
  volunteer:
    "Ошибка: проверять билеты могут только волонтеры. Обратитесь к ответственному лицу.",
  parameter: "Ошибка: предоставленные данные некорректны.",
  used: "Ошибка: абонемент на данный матч уже использован. Повторный вход невозможен.",
  finally: "Ошибка:Что-то пошло не так",
  certUsedError: "Ошибка: Сертификат уже использован.",
  certBonusError: "Ошибка: Бонусы не активны.",
  certNotFoundError: "Ошибка: Сертификат не найден.",
};

function ResultView({
  loading,
  result,
}: {
  loading: boolean;
  result: { status: number; message: string } | null;
}) {
  if (loading) {
    return (
      <Alert variant="default" className="flex items-center gap-2">
        <Loader2 className="size-4 animate-spin" />
        <AlertTitle>Сканирование...</AlertTitle>
        <AlertDescription>Обработка билета</AlertDescription>
      </Alert>
    );
  }
  if (result?.status === 200) {
    return (
      <Alert variant="success" className="whitespace-pre-line">
        <CheckIcon className="size-4" />
        <AlertTitle>Успешно!</AlertTitle>
        <AlertDescription>{result.message}</AlertDescription>
      </Alert>
    );
  }
  if (result !== null) {
    return (
      <Alert variant="error">
        <XIcon className="size-4" />
        <AlertTitle>Ошибка!</AlertTitle>
        <AlertDescription>{result.message}</AlertDescription>
      </Alert>
    );
  }
  return (
    <Alert variant="success">
      <CheckIcon className="size-4" />
      <AlertTitle>QR Сканнер готов</AlertTitle>
      <AlertDescription>Начните сканирование</AlertDescription>
    </Alert>
  );
}

export function QRScannerDialog() {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [res, setRes] = useState<{ status: number; message: string } | null>(
    null
  );

  const { mutate: scanTicket, isPending: isLoadingTicket } = useMutation({
    mutationKey: ["scan ticket"],
    mutationFn: rScanTicket,
    onSettled: () => setPaused(false),
    onSuccess: () => setRes({ status: 200, message: resultMsg.scan }),
    onError: (e: {
      status: number;
      message: keyof typeof resultMsg;
      time?: string;
    }) => {
      setRes({
        status: 400,
        message:
          resultMsg[e.message] +
          (e.time
            ? `Время последнего сканирования: ${dayjs(e.time).format(
              "YYYY-MM-DD HH:mm"
            )}`
            : ""),
      });
    },
  });

  const { mutate: scanSub, isPending: isLoadingSub } = useMutation({
    mutationKey: ["scan sub"],
    mutationFn: rScanSub,
    onSettled: () => setPaused(false),
    onSuccess: () => setRes({ status: 200, message: resultMsg.scan }),
    onError: (e: {
      message: keyof typeof resultMsg;
      status: number;
      time?: string;
    }) => {
      setRes({
        status: 400,
        message:
          resultMsg[e.message] +
          (e.time
            ? `Время последнего сканирования: ${e.time.replace("+", " ")}`
            : ""),
      });
    },
  });

  const { mutate: scanCert, isPending: isLoadingCert } = useMutation({
    mutationKey: ["scan cert"],
    mutationFn: rScanCert,
    onSettled: () => setPaused(false),
    onSuccess: (data) => {
      const lvl = Number(data.shareholder_level.split("-")[0]);
      setRes({
        status: 200,
        message:
          resultMsg.scan +
          `\n${data.full_name}\nУровень: ${data.shareholder_level}\nБонусы: ${data.bonus_status ? "Активны" : "Не активны"
          }\n ${lvl <= 2 ? "Срок действия: 31.12.2026" : ""}`,
      });
    },
    onError: (e: { message: string; time: string; bonusStatus: boolean }) => {
      if (e.bonusStatus === false) {
        setRes({ status: 400, message: resultMsg.certBonusError });
        return;
      }
      if (e.message === "used") {
        setRes({
          status: 400,
          message:
            resultMsg.certUsedError +
            (e.time
              ? `Время последнего сканирования: ${e.time.replace("+", " ")}`
              : ""),
        });
      } else if (e.message === "not-found") {
        setRes({ status: 400, message: resultMsg.certNotFoundError });
      } else {
        setRes({ status: 400, message: resultMsg.finally });
      }
    },
  });

  const onScan = (result: IDetectedBarcode[]) => {
    setPaused(true);
    setRes(null);
    if (!result[0] && !id) return;
    const code = result[0].rawValue;
    const type = code.split("-")[0];

    try {
      switch (type) {
        case "ticket":
          scanTicket({ event_id: id as string, code });
          break;
        case "aboniment":
          scanSub({ event_id: id as string, code });
          break;
        case "cert":
          scanCert({ event_id: id as string, code });
          break;
        default:
          setRes({
            status: 404,
            message:
              "Неправильный формат билета! Пожалуйста, проверьте номер билета или свяжитесь с организаторами.",
          });
          setPaused(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) setRes(null);
    setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full">
          <QrCode />
          <span>
            Скан билета
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle>QR Сканнер</DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 flex-col items-center justify-center gap-5">
          <div className="h-[358px] w-[358px] overflow-hidden rounded-lg border">
            <Scanner
              allowMultiple
              scanDelay={2000}
              onScan={onScan}
              paused={paused}
            />
          </div>
          <div className="w-full max-w-[358px]">
            <ResultView
              loading={isLoadingTicket || isLoadingSub || isLoadingCert}
              result={res}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
