import { LocaleSwitcher } from "@/widgets";
import { Box } from "@mantine/core";

export default async function RootLayout({ children }: { children: any }) {
    return <>
        <Box style={{
            position: 'absolute',
            top: 20,
            right: 20
        }}>
            <LocaleSwitcher />
        </Box>
        <main className="bg-[url('/bg-item.png')]">
        {children}
        </main>
    </>
}
