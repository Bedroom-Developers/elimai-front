import { getTranslations } from "next-intl/server"
import { Header } from "../_components/Header"

export default async function Layout({ params, children }: { params: { locale: string }, children: any }) {
    const t = await getTranslations()
    return <section>
        <Header />
        <main>
            {children}
        </main>
    </section>
}

