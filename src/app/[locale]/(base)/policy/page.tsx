import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
    const t = await getTranslations();
    return {
        title: t("policy.title"),
        description: t("policy.description"),
    };
}

export default async function Page() {
    const t = await getTranslations();
    return (
        <div>
            <div
                className="relative h-[30vh] w-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/policy.jpg')" }}
            >
                <div className="absolute inset-0 z-1 bg-black/40" />
                <div className="relative z-2 mx-auto flex h-full max-w-[1200px] flex-col justify-center gap-2.5 px-4 xl:px-0">
                    <h1 className="text-3xl font-bold text-white">
                        {t("policy.title")}
                    </h1>
                </div>
            </div>
            <p className="mx-auto my-20 max-w-4xl px-2.5 text-center lg:px-0">
                {t.rich("policy.value", {
                    a: (chunk) => (
                        <a
                            href="https://tickets.fcelimai.kz/"
                            className="font-bold hover:underline"
                        >
                            {chunk}
                        </a>
                    ),
                })}
            </p>
        </div>
    );
}
