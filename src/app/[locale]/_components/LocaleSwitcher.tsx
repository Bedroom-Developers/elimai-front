'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { ComponentProps } from "react";

const LOCALE_LABELS: Record<string, string> = {
    ru: "Рус",
    kz: "Каз",
};
type LocaleSwitcherProps = ComponentProps<typeof SelectTrigger>
export default function LocaleSwitcher({ ...props }: LocaleSwitcherProps) {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();

    function onValueChange(value: string) {
        const nextPath = pathname.replace(`/${locale}`, `/${value}`);
        router.replace(nextPath);
    }

    return (
        <Select value={locale} onValueChange={onValueChange}>
            <SelectTrigger className="w-[80px] text-base" {...props}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="ru" className="text-base">
                    {LOCALE_LABELS.ru}
                </SelectItem>
                <SelectItem value="kz" className="text-base">
                    {LOCALE_LABELS.kz}
                </SelectItem>
            </SelectContent>
        </Select>
    );
}
