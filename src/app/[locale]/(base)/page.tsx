import { GamesTable, HeroSection } from '@/widgets';
import { Box } from '@mantine/core';
import { getTranslations } from 'next-intl/server';


export default async function HomePage() {
    const t = await getTranslations();
    const formatter = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    return (<Box>
        <HeroSection />
        <GamesTable />
    </Box>
    );
}



