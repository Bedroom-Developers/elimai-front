"use client";
import { rScanCert, rScanSub, rScanTicket } from "@/shared/api/games";
import { Box, Button, Loader, Modal, Notification, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import dayjs from "dayjs";
import { CheckIcon, XIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useMutation } from "react-query";

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
};
export const QRScanner = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { id } = useParams();
  const [paused, setPaused] = useState<boolean>(false);
  const [res, setRes] = useState<{ status: number; message: string } | null>(
    null
  );
  const { mutate: scanTicket, isLoading: isLoadingTicket } = useMutation({
    mutationKey: ["scan ticket"],
    mutationFn: rScanTicket,
    onSettled: () => {
      setPaused(false);
    },
    onSuccess: (data) => {
      setRes({ status: 200, message: resultMsg.scan });
    },
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
  const { mutate: scanSub, isLoading: isLoadingSub } = useMutation({
    mutationKey: ["scan sub"],
    mutationFn: rScanSub,
    onSettled: () => {
      setPaused(false);
    },
    onSuccess: (data) => {
      setRes({ status: 200, message: resultMsg.scan });
    },
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
  const { mutate: scanCert, isLoading: isLoadingCert } = useMutation({
    mutationKey: ["scan cert"],
    mutationFn: rScanCert,
    onSettled: () => {
      setPaused(false);
    },
    onSuccess: (data) => {
      console.log(data);
      setRes({
        status: 200,
        message:
          resultMsg.scan +
          `\n${data.full_name}\nУровень: ${data.shareholder_level}\nБонусы: ${
            data.bonus_status ? "Активны" : "Не активны"
          }\nСрок действия: ${data.expiry}`,
      });
    },
    onError: (e: { message: string; time: string; bonusStatus: boolean }) => {
      if (e.bonusStatus == false) {
        setRes({
          status: 400,
          message: resultMsg.certBonusError,
        });
        return;
      }
      if (e.message == "used") {
        setRes({
          status: 400,
          message:
            resultMsg.certUsedError +
            (e.time
              ? `Время последнего сканирования: ${e.time.replace("+", " ")}
              `
              : ""),
        });
      } else {
        setRes({
          status: 400,
          message: resultMsg.finally,
        });
      }
    },
  });

  const onScan = (result: IDetectedBarcode[]) => {
    setPaused(true);
    setRes(null);
    if (!result[0] && !id) {
      return;
    }
    const code = result[0].rawValue;
    const type = code.split("-")[0];
    console.log(type);

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
  return (
    <>
      <Modal
        fullScreen
        opened={opened}
        onClose={() => {
          setRes(null);
          close();
        }}
        title={"QR Сканнер"}
      >
        <Stack align="center">
          <Box w={358} h={358}>
            <Scanner
              allowMultiple
              scanDelay={2000}
              onScan={onScan}
              paused={paused}
            />
          </Box>

          <Box mt={20}>
            <ResultView
              loading={isLoadingTicket || isLoadingSub || isLoadingCert}
              result={res}
            />
          </Box>
        </Stack>
      </Modal>
      <Button w={"100%"} variant="base" onClick={open}>
        {" "}
        Скан билета
      </Button>
    </>
  );
};

const ResultView = ({
  loading,
  result,
}: {
  loading: boolean;
  result: { status: number; message: string } | null;
}) => {
  console.log(result);
  if (loading) {
    return <Loader />;
  }
  if (result?.status == 200) {
    return (
      <Notification
        withCloseButton={false}
        color="green"
        icon={<CheckIcon size={20} />}
        title="Успешно!"
        style={{ whiteSpace: "pre-line" }}
      >
        {result.message}
      </Notification>
    );
  } else if (result !== null) {
    return (
      <Notification
        withCloseButton={false}
        icon={<XIcon size={20} />}
        color="red"
        title="Ошибка!"
      >
        {result.message}
      </Notification>
    );
  } else if (result === null) {
    return (
      <Notification
        withCloseButton={false}
        color="green"
        icon={<CheckIcon size={20} />}
        title="QR Сканнер готов"
      >
        Начните сканирование
      </Notification>
    );
  } else {
    return (
      <Notification
        withCloseButton={false}
        icon={<XIcon size={20} />}
        color="red"
        title="Ошибка!"
      >
        {resultMsg.finally}
      </Notification>
    );
  }
};
