import { getTranslations } from "next-intl/server"
import { Header } from "../_components/Header"
import { PartnersSection } from "../_components/PartnersSection"

export default async function Layout({ params, children }: { params: { locale: string }, children: any }) {
    const t = await getTranslations()
    return <section>
        <Header />
        <main>
            {children}
        </main>
        <PartnersSection />
    </section>
}


