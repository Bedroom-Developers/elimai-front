import { EventsView } from "@/modules/events/ui/components/EventsView";
import { MyTicketsDialog } from "@/modules/tickets/ui/dialogs/MyTicketsDialog";
import dayjsTZ from "@/shared/dayjs";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import styles from "./page.module.css";

export default async function HomePage() {
  const t = await getTranslations();
  return (
    <section >
      <div className={`${styles.image} w-screen -ml-2 md:ml-0 -mr-2 md:mr-0`}>
        <Image
          src="/hero/1920.avif"
          alt="FC Elimai hero banner"
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 z-1 bg-black/10" />
        <div className="relative z-2 flex h-full max-w-[1200px] mx-auto flex-col justify-center gap-2.5 px-4 xl:px-0">
          <div className="absolute hidden md:block bottom-2.5 bg-black/40 p-2 md:p-4 rounded-lg ">
            <div className="flex items-center gap-2.5">
              <span className="mr-2.5 bg-[#ff8700] px-2.5 py-0.75 text-xs font-bold uppercase text-white md:text-[13px] xl:text-sm">
                {t("hero.subtitle")}
              </span>
              <span className="text-xs font-bold text-white md:text-[13px] lg:text-sm">
                {dayjsTZ(new Date()).format("DD.MM.YYYY")}
              </span>
            </div>
            <h1 className="text-base font-bold text-white md:text-2xl lg:text-[28px]">
              {t("hero.title")}
            </h1>
          </div>
        </div>
      </div>
      <section className="flex justify-end max-w-4xl mx-auto">
        <MyTicketsDialog className="my-2  w-full md:w-fit" />
      </section>
      <EventsView />
    </section>
  );
}
