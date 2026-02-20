import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { Suspense } from 'react';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false, refetchOnWindowFocus: false, staleTime: Infinity }
    }
});

export const decorators = [
    (Story) => (
        <QueryClientProvider client={queryClient} >
            <Suspense fallback={<div> Error loading tickets </div>}>
                <Story />
            </Suspense>
        </QueryClientProvider>
    )
];
