import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core"
import { AdminSidebar } from "./_components/AdminSidebar"

export const metadata = {

    title: "Админ",
    description: "Админ-панель",
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ru" {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
                />
            </head>
            <body className="min-h-screen">
                <AdminSidebar>{children}</AdminSidebar>
            </body>
        </html>
    )
}
