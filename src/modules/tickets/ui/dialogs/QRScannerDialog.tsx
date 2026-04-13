"use client";

import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { CheckIcon, Loader2, QrCode, XIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useQrScanner } from "../../hooks/use-qr-scanner";
import { ScanResult } from "../../types";

const Scanner = dynamic(
  () => import("@yudiel/react-qr-scanner").then((mod) => mod.Scanner),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
        Инициализация камеры...
      </div>
    ),
  }
);



function ResultView({
  result,
}: {
  result: ScanResult;
}) {
  if (result.status === 'loading') {
    return (
      <Alert variant="default" >
        <Loader2 className="size-4 animate-spin" />
        <AlertTitle>Сканирование...</AlertTitle>
        <AlertDescription className="block">Обработка билета</AlertDescription>
      </Alert>
    );
  }
  if (result.status === 'success') {
    return (
      <Alert variant="success" className="whitespace-pre-line">
        <CheckIcon className="size-4" />
        <AlertTitle>Успешно!</AlertTitle>
        <AlertDescription>{result.message}</AlertDescription>
      </Alert>
    );
  }
  if (result.status === 'error') {
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


  const { result, onScan, openScannerDialog, handleOpenChange } = useQrScanner({ id: id as string });




  return (
    <Dialog open={openScannerDialog} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full">
          <QrCode />
          <span>
            Скан билета
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={e => e.preventDefault()}
        showCloseButton={true}
        className="px-4 py-6"
      >
        <DialogHeader>
          <DialogTitle>QR Сканнер</DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 flex-col items-center justify-center gap-5">
          <div className="w-[250px] overflow-hidden rounded-lg border">
            <Scanner
              allowMultiple
              scanDelay={2000}
              onScan={onScan}
              paused={result.status === 'loading'}
            />
          </div>
          <div className="w-full max-w-[358px] min-h-[100px]">
            <ResultView
              result={result}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
