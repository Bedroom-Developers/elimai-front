import { shareholderScanList, ShareholderScanList200, ShareholderScanList409, ShareholderScanListParams, ShareholderScanListQueryError, ticketScanList, TicketScanList200, TicketScanList409, TicketScanListParams, TicketScanListQueryError } from "@/shared/api/generated";
import { useMutation } from "@tanstack/react-query";
import { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { AxiosError } from "axios";
import { useState } from "react";
import { ScanResult } from "../types";
import { extractCertLevel, extractCodeAndType, getSuccessCertScanMessage } from "../utils";

const resultMessages = {
    event:
        "Ваш билет не соответствует текущему матчу. Проверьте информацию на билете или обратитесь в службу поддержки.",
    scan: "Сканирование успешно! Добро пожаловать на матч.",
    "not-scan": "Ошибка: данный билет уже использован.",
    "not-found": "Билет не найден.",
    volunteer:
        "Ошибка: проверять билеты могут только волонтеры. Обратитесь к ответственному лицу.",
    parameter: "Ошибка: предоставленные данные некорректны.",
    finally: "Ошибка:Что-то пошло не так",
    certUsedError: "Ошибка: Сертификат уже использован.",
    certBonusError: "Ошибка: Бонусы не активны.",
    certNotFoundError: "Ошибка: Сертификат не найден.",
};
const isShareholderScanList409 = (data: ShareholderScanListQueryError): data is AxiosError<ShareholderScanList409> => {
    return data.response?.status === 409;
}

const isTicketScanList409 = (data: TicketScanListQueryError): data is AxiosError<TicketScanList409> => {
    return data.response?.status === 409;
}

interface UseQrScannerProps {
    id: string;
}
export const useQrScanner = ({ id }: UseQrScannerProps) => {
    const [result, setResult] = useState<ScanResult>({ status: "idle" });
    const [openScannerDialog, setOpenScannerDialog] = useState(false);

    const onScanTicketSuccess = (data: TicketScanList200) => {
        setResult({ status: "success", message: resultMessages.scan });
    }
    const onScanTicketError = (e: TicketScanListQueryError) => {
        if (!e.response) return;
        if (!e.response.data?.error) return;

        const error = e.response.data.error as keyof typeof resultMessages;
        if (isTicketScanList409(e)) {
            setResult({ status: "error", message: resultMessages[error] + `Время последнего сканирования: ${e.response.data?.time?.replace("+", " ")}` });
            return;
        }
        setResult({ status: "error", message: resultMessages[error] });
    }
    const onScanCertSuccess = (data: ShareholderScanList200) => {
        const level = extractCertLevel(data.shareholder_level);
        if (level == 0) {
            setResult({ status: "error", message: resultMessages.certNotFoundError });
            return;
        }
        setResult({
            status: "success", message:
                resultMessages.scan +
                getSuccessCertScanMessage(data, level),
        });
    }


    const onScanCertError = (e: ShareholderScanListQueryError) => {
        if (!e.response) return;
        console.log(e.response.data);

        if (e.response.status == 400) {
            setResult({ status: "error", message: resultMessages.finally });
            return;
        }
        if (e.response.status == 404) {
            setResult({ status: "error", message: resultMessages.certNotFoundError });
            return;
        }

        if (isShareholderScanList409(e)) {
            const data = e.response.data;
            if (data.error == 'used') {
                setResult({ status: "error", message: resultMessages.certUsedError + `Время последнего сканирования: ${data?.time?.replace("+", " ")}` });
                return;
            }
            if (data.bonus_status === false) {
                setResult({ status: "error", message: resultMessages.certBonusError });
                return;
            }
        }



    }
    const { mutate: scanTicket } = useMutation({
        mutationKey: ["scan ticket"],
        mutationFn: (params: TicketScanListParams) => ticketScanList(params),
        onSuccess: (data) => onScanTicketSuccess(data),
        onError: (e: TicketScanListQueryError) => onScanTicketError(e),
    });
    const { mutate: scanCert } = useMutation({
        mutationKey: ["scan cert"],
        mutationFn: (params: ShareholderScanListParams) => shareholderScanList(params),
        onSuccess: (data) => onScanCertSuccess(data),
        onError: (e: ShareholderScanListQueryError) => onScanCertError(e),
    });

    const handleOpenChange = (next: boolean) => {
        if (!next) setResult({ status: "idle" });
        setOpenScannerDialog(next);
    };

    const onScan = (result: IDetectedBarcode[]) => {
        if (!result[0] && !id) return;
        setResult({ status: "loading" });
        const { type, code } = extractCodeAndType(result[0]);

        try {
            switch (type) {
                case "ticket":
                    scanTicket({ event_id: id as string, code });
                    break;
                case "cert":
                    scanCert({ event_id: id as string, code });
                    break;
                default:
                    setResult({
                        status: 'error',
                        message:
                            "Неправильный формат билета! Пожалуйста, проверьте номер билета или свяжитесь с организаторами.",
                    });
            }
        } catch (e) {
            console.error(e);
        }
    };

    return {
        result,
        onScan,
        openScannerDialog,
        handleOpenChange,
    }

}