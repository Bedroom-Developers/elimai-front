import { theme } from "@/app/theme";
import { routing } from "@/i18n/routing";
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Nunito } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
const nunito = Nunito({
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported but less commonly used
  // interactiveWidget: 'resizes-visual',
};
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const t = await getTranslations("meta");
  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "билеты Елимай",
      "купить билеты Елимай",
      "футбол Елимай билеты",
      "Елимай матчи билеты",
      "футбольные билеты",
      "Елімай билет",
      "Елімай футбол билеттері",
    ],
    openGraph: {
      url: process.env.NEXT_PUBLIC_FRONT_URL,
      type: "website",
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "/e-team.webp",
          width: 1200,
          height: 630,
          alt: "Елимай билеты",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "https://elimai-tickets.kz/images/home/thumbnail.png",
          width: 1200,
          height: 630,
          alt: "Елимай билеты",
        },
      ],
    },
    alternates: {
      canonical: process.env.NEXT_PUBLIC_FRONT_URL,
      languages: {
        ru: `${process.env.NEXT_PUBLIC_FRONT_URL}/ru`,
        kk: `${process.env.NEXT_PUBLIC_FRONT_URL}/kk`,
      },
    },
  };
}
export default async function RootLayout({
  params,
  children,
}: {
  params: { locale: string };
  children: any;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const t = await getTranslations();
  return (
    <html lang={locale} className={nunito.className} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />

        <Script
          defer
          src="https://stats.ispark.kz/script.js"
          data-website-id="bc8a5915-2f7c-4289-a564-c2c3f9b728e7"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <NextIntlClientProvider messages={messages}>
            <Notifications />
            {children}
          </NextIntlClientProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
