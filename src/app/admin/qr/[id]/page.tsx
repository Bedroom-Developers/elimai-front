import { QRScannerDialog } from "@/modules/tickets/ui/dialogs/QRScannerDialog";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { QrCodeIcon } from "lucide-react";
import Image from "next/image";

export default function Page() {
    return (
        <div className="flex min-h-[calc(100vh-2rem)] w-full flex-col gap-6 px-4 py-8 sm:px-6">

            <section className="mx-auto flex w-full max-w-[480px] flex-1 flex-col items-center justify-center gap-6">
                <div className="space-y-1 text-center">
                    <h1 className="flex items-center justify-center gap-2 text-2xl font-semibold tracking-tight">
                        <QrCodeIcon className="size-6 text-muted-foreground" />
                        Сканирование билетов
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Откройте сканер и наведите камеру на QR-код билета
                    </p>
                </div>

                <Card className="w-full overflow-hidden border-0 bg-muted/30 shadow-none sm:border sm:bg-card sm:shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Билет на матч</CardTitle>
                        <CardDescription>
                            Нажмите кнопку ниже, чтобы открыть камеру и отсканировать билет
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-6">
                        <div className="relative overflow-hidden rounded-lg border bg-muted/50">
                            <Image
                                src="/qr.jpg"
                                alt="QR-код для сканирования билетов"
                                width={320}
                                height={320}
                                className="object-cover"
                                priority
                            />
                        </div>
                        <QRScannerDialog />
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
