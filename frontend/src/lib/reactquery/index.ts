import { MutationCache, QueryClient } from '@tanstack/react-query';

const mutationCache = new MutationCache({
  onSuccess: (_data, _variables, _context, mutation) => {
    if (mutation.meta?.invalidateQueries) {
      console.log('[DEBUG] mutation onSuccess:', mutation.meta);
      queryClient.invalidateQueries({
        queryKey: mutation.meta.invalidateQueries,
      });
    }
  },
});

export const queryClient = new QueryClient({
  mutationCache,
});
