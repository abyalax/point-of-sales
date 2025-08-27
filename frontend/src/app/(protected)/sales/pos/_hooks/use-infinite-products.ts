import { useInfiniteQuery } from '@tanstack/react-query';
import { filterProducts } from '~/modules/product/product.api';
import type { QueryProducts } from '~/modules/product/product.schema';
import { QUERY_KEY } from '~/common/const/querykey';

export const useInfiniteProducts = (query: QueryProducts) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.PRODUCT.GET_INFINITE, query],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await filterProducts({
        ...query,
        page: pageParam,
        engine: 'server_side',
      });
      return res.data.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage?.meta?.total_pages ?? 1;
      return allPages.length < totalPages ? allPages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};
