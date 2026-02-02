import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "offlineFirst",

      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 2,

      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,

      retry: 1,
      retryDelay: (attemptIndex) => {
        return Math.min(1000 * 2 ** attemptIndex, 1000 * 8);
      },
    },
  },
});

export const QueryProvider = (props: React.PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
};
