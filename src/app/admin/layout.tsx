import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core"

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
                {children}
            </body>
        </html>
    )
}
