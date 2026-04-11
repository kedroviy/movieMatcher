import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            retry: 2,
        },
    },
});

export const roomMoviesQueryKey = (roomKey: string | undefined) => ['roomMovies', roomKey] as const;

export const roomStateQueryKey = (roomKey: string | undefined) => ['roomState', roomKey] as const;
