"use client";
import { AuthContext } from "@/modules/auth/ui/components/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "dayjs/locale/ru";
import { ReactNode, useState } from "react";
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [client] = useState(() => queryClient);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <AuthContext>
      <QueryProvider>{children}</QueryProvider>
    </AuthContext>
  );
};
