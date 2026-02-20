import LocaleSwitcher from "../_components/LocaleSwitcher";

export default async function RootLayout({ children }: { children: any }) {
    return <>
        <LocaleSwitcher className="absolute top-4 right-4 bg-white" />
        <main className="bg-[url('/bg.webp')]">
            {children}
        </main>
    </>
}
