import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
};
export default withSentryConfig(withNextIntl(nextConfig), {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Document-Policy", value: "js-profiling" }],
      },
    ];
  },
  org: "sentry",
  project: "fc-elimai-ui",
  sentryUrl: "https://sentry.ispark.kz/",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
});
