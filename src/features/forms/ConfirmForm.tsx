"use client";
import { useRouter } from "@/i18n/routing";
import {
  rResetPassword as rRestorePassword,
  rSendCode,
  rVerifyCode,
} from "@/shared/api/auth";
import { showErrorNotification } from "@/shared/notifications";
import { Button, PinInput, Stack, Text, Title } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next/client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface ConfirmFormProps {
  userData: { email: string; password: string };
  mode: "register" | "restore";
}
export const ConfirmForm = ({ mode, userData }: ConfirmFormProps) => {
  const [otp, setOtp] = useState("");
  const t = useTranslations();

  const router = useRouter();
  const { mutate: register, isPending: registerIsLoading } = useMutation({
    mutationKey: ["register"],
    mutationFn: rVerifyCode,
    onSuccess: (data) => {
      deleteCookie("rg-body");
      router.replace("/login");
    },
    onError: (e) => {
      console.log(e);
      showErrorNotification({
        title: t("errors.auth.otp.title"),
        message: t("errors.auth.otp.message"),
      });
    },
  });
  const { mutate: restore, isPending: restoreIsLoading } = useMutation({
    mutationKey: ["restore"],
    mutationFn: rRestorePassword,
    onSuccess: (data) => {
      deleteCookie("rs-body");
      router.replace("/login");
    },
    onError: (e) => {
      console.log(e);
      showErrorNotification({
        title: t("errors.auth.otp.title"),
        message: t("errors.auth.otp.message"),
      });
    },
  });

  const verify = () => {
    if (!userData) {
      console.error("No data");
      return;
    }
    switch (mode) {
      case "register":
        register({ ...userData, code: otp });
        break;
      case "restore":
        restore({
          email: userData.email,
          code: otp,
          new_password: userData.password,
        });
        break;
    }
  };
  const handleBack = () => {
    deleteCookie(mode == "register" ? "rg-body" : "rs-body");
    router.push("/login");
  };
  return (
    <Stack w={"100%"} maw={600} px={10} gap={20}>
      <Title order={2}>{t("auth.confirm.title")}</Title>
      <Text c={"slate.5"}>Email: {userData.email}</Text>
      <PinInput
        styles={{
          root: { width: "100%" },
          pinInput: { flex: 1 },
        }}
        oneTimeCode
        value={otp}
        onChange={setOtp}
        mx={"auto"}
        length={6}
        type={"number"}
        size="xl"
      />
      <OtpTimer mode={mode} email={userData.email} />
      <Button
        loading={registerIsLoading || restoreIsLoading}
        onClick={verify}
        disabled={otp.length !== 6 || registerIsLoading || restoreIsLoading}
        variant="base"
      >
        {t("auth.confirm.btn")}
      </Button>
      <Button onClick={handleBack} variant="outline">
        {t("header.back")}
      </Button>
    </Stack>
  );
};
interface OtpTimerProps {
  email: string | null;
  mode: "register" | "restore";
}
const OtpTimer = ({ email, mode }: OtpTimerProps) => {
  const [timer, setTimer] = useState(60);
  const { mutate: resendCode, isLoading } = useMutation({
    mutationKey: ["resend-code"],
    mutationFn: rSendCode,
    onSuccess: (data) => {
      setTimer(60);
    },
    onError: (e) => {
      console.log(e);
      showErrorNotification({
        title: t("errors.auth.code.title"),
        message: t("errors.auth.code.message"),
      });
    },
  });

  useEffect(() => {
    if (timer > 0) {
      const timer = setInterval(() => {
        setTimer((prevSeconds) => prevSeconds - 1);
      }, 1000); // Update every second
      return () => clearInterval(timer); // Cleanup on unmount
    }
  }, [timer]);
  const t = useTranslations();
  return (
    <Button
      loading={isLoading}
      variant="outline"
      onClick={() => {
        if (!email) {
          console.error("ConfirmForm: No email");
          return;
        }
        resendCode({ email, type: mode == "register" ? "Registr" : "restore" });
      }}
      disabled={timer > 0 || isLoading}
    >
      {t("auth.confirm.timer")} {timer > 0 && t("timer", { timer })}
    </Button>
  );
};
