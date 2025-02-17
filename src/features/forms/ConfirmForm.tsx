'use client'
import { useRouter } from "@/i18n/routing";
import { rResetPassword as rRestorePassword, rSendCode, rVerifyCode } from "@/shared/api/auth";
import { showErrorNotification } from "@/shared/notifications";
import { Button, Stack, Title } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { useMutation } from "react-query";

interface ConfirmFormProps {
    userData: { email: string, password: string }
    mode: 'register' | 'restore'
}
export const ConfirmForm = ({ mode, userData }: ConfirmFormProps) => {
    const [otp, setOtp] = useState('');
    const t = useTranslations()

    const router = useRouter();
    const { mutate: register, isLoading: registerIsLoading } = useMutation({
        mutationKey: ["register"],
        mutationFn: rVerifyCode,
        onSuccess: (data) => {
            router.replace('/login')
        },
        onError: (e) => {
            console.log(e)
            showErrorNotification({ title: t('errors.auth.otp.title'), message: t('errors.auth.otp.message') });
        }
    });
    const { mutate: restore, isLoading: restoreIsLoading } = useMutation({
        mutationKey: ["restore"],
        mutationFn: rRestorePassword,
        onSuccess: (data) => {
            router.replace('/login')
        },
        onError: (e) => {
            console.log(e)
            showErrorNotification({ title: t('errors.auth.otp.title'), message: t('errors.auth.otp.message') });
        }
    });


    const verify = () => {
        switch (mode) {
            case 'register': register({ ...userData, code: otp })
                break;
            case 'restore': restore({ email: userData.email, code: otp, new_password: userData.password })
                break;
        }
    }
    return <Stack w={'100%'} maw={600} px={10} gap={20}>
        <Title order={2}>{t('auth.confirm.title')}</Title>
        <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            inputStyle={{ width: '100%', height: 40, }}
            containerStyle={{ width: '100%', height: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 5px' }}
            renderSeparator={<span style={{ width: 10, height: 10 }} />}
            renderInput={(props) => <input  {...props} />}
        />
        <OtpTimer mode={mode} email={userData.email} />
        <Button loading={registerIsLoading || restoreIsLoading} onClick={verify} disabled={otp.length !== 6 || registerIsLoading || restoreIsLoading} variant="base">{t('auth.confirm.btn')}</Button>
    </Stack>
}
interface OtpTimerProps {
    email: string
    mode: 'register' | 'restore'
}
const OtpTimer = ({ email, mode }: OtpTimerProps) => {
    const [timer, setTimer] = useState(60)
    const { mutate: resendCode, isLoading } = useMutation({
        mutationKey: ["resend-code"],
        mutationFn: rSendCode,
        onSuccess: (data) => {
            setTimer(60)
        },
        onError: (e) => {
            console.log(e)
            showErrorNotification({ title: t('errors.auth.code.title'), message: t('errors.auth.code.message') });
        }
    });

    useEffect(() => {
        if (timer > 0) {
            const timer = setInterval(() => {
                setTimer((prevSeconds) => prevSeconds - 1);
            }, 1000); // Update every second
            return () => clearInterval(timer); // Cleanup on unmount
        }
    }, [timer]);
    const t = useTranslations()
    return <Button loading={isLoading} variant="outline" onClick={() => resendCode({ email, type: mode == 'register' ? "Registr" : "restore" })} disabled={timer > 0 || isLoading}  >
        {t('auth.confirm.timer')}  {timer > 0 && t('timer', { timer })}
    </Button>

}
