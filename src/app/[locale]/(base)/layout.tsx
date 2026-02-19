import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Header } from "../_components/Header";
import { PartnersSection } from "../_components/PartnersSection";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const t = await getTranslations()
    return <section >
        <Header />
        <main className="px-2 md:px-0 my-5">
            {children}
        </main>
        <PartnersSection />
        <footer>
            <div className="mx-auto max-w-[1200px] p-2.5 sm:p-2.5 xl:p-0">
                <Link
                    href="/policy"
                    className="block text-center text-gray-500 lg:text-start"
                >
                    {t("policy.title")}
                </Link>
                <p className="py-2.5 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} {t("footer")}
                </p>
            </div>
        </footer>

    </section>
}


