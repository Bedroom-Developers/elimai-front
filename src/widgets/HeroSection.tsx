
'use client'

import { Box, Stack, Text, Title } from "@mantine/core"
import dayjs from "dayjs"
import { useTranslations } from "next-intl"

import styles from './HeroSection.module.css'
export const HeroSection = () => {
    const t = useTranslations()

    return <div className={styles.image}>
        <Box style={{ zIndex: 1 }} pos={'absolute'} inset={0} bg={'rgba(0,0,0,.4)'} />
        <Stack pos={'relative'} style={{ zIndex: 2 }} px={{ xs: 10, xl: 0 }} h={'100%'} maw={1200} mx={'auto'} justify='center' gap={10}>
            <Box>
                <Text mr={10} fw={'bold'} tt={'uppercase'} py={3} px={10} fz={14} c='white' bg={'#ff8700'} component='span'>{t('hero.subtitle')}</Text>
                <Text fw={'bold'} fz={14} c='white' component='span'>{dayjs(new Date()).format('DD.MM.YYYY')}</Text>
            </Box>
            <Title order={1} c='white'>{t('hero.title')}</Title>
        </Stack>
    </div>

}
