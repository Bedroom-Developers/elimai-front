'use client';

import { Select } from "@mantine/core";
import { useLocale } from "next-intl";
import { useParams, usePathname, useRouter } from "next/navigation";


export default function LocaleSwitcherSelect() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const locale = useLocale()

    function onSelectChange(value: string | null) {
        const nextLocale = value == 'Рус' ? 'ru' : 'kz'
        const nextPath = pathname.replace(`/${nextLocale == 'ru' ? 'kz' : 'ru'}`, nextLocale)
        console.log(nextPath)
        router.replace(nextPath);
    }
    return (
        <Select
            w={80}
            checkIconPosition='right'
            styles={{
                input: {
                    fontSize: '16px', // Change font size of the input field
                },
                option: {
                    fontSize: "16px"
                }
            }}
            data={['Рус', 'Каз']}
            defaultValue={locale == 'ru' ? 'Рус' : "Каз"}
            comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
            onChange={(value) => onSelectChange(value)}

        />
    );
}
