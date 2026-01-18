"use client";

import { useSendCodeCreate } from "@/shared/api/generated";
import { Button } from "@/shared/components/ui/button";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ResendCodeTimerProps {
  email: string;
  actionType: "register" | "restore";
}
const initialSeconds = 60;
export const ResendCodeTimer = ({
  email,
  actionType,
}: ResendCodeTimerProps) => {
  const t = useTranslations("auth.sendCode");
  const tErrors = useTranslations("errors");
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const { mutate: resendCode, isPending: isResendCodePending } = useSendCodeCreate({mutation:
{
    onSuccess: () => {
      start();
    },
    onError: (e) => {
      console.log(e);
      toast.error(tErrors("auth.code.message"));
    },
  }
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    start();
  }, []);
  const start = useCallback(() => {
    if (intervalRef.current) return;
    setSeconds(initialSeconds);
    setIsRunning(true);
  }, [initialSeconds]);
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  const handleResend = () => {
    resendCode({ data: { email, type: actionType, cabinet: "resend" } });
  };

  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const remainingSeconds = sec % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-2 h-9 justify-center">
      {isRunning ? (
        <p className="text-sm text-muted-foreground  text-center">
          {t("resendAvailableIn")} {formatTime(seconds)}
        </p>
      ) : (
        <Button
          type="button"
          variant="ghost"
          onClick={handleResend}
          disabled={isResendCodePending}
          className="w-full"
        >
          {t("resendCode")}
        </Button>
      )}
    </div>
  );
};
