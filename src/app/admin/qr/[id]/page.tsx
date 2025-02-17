import { QRScanner } from "@/features";
import { Image, Stack } from "@mantine/core";

export default function Page() {
    return <Stack maw={600} justify="center" mx={'auto'} mih={'100svg'} align="center" px={10}>
        <Image src={'/qr.jpg'} alt="qr" w={'100%'} height={400} />
        <QRScanner />
    </Stack>
}
