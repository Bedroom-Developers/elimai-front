import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../../../messages/ru.json";

const queryClient = new QueryClient();
export const renderWithProviders = (component: React.ReactNode) => {
    return <QueryClientProvider client={queryClient}><NextIntlClientProvider locale="ru" messages={messages}>{component}</NextIntlClientProvider></QueryClientProvider>
}