import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';
import type { TAxiosResponse, TResponse } from '~/common/types/response';
import type { ICategory } from '~/api/product/type';

import { getProductCategories } from '~/api/product/api';
import { QUERY_KEY } from '~/common/const/querykey';
import { useQuery } from '@tanstack/react-query';

export const queryProductCategories = (): UseQueryOptions<TAxiosResponse<ICategory[]>, TResponse, ICategory[] | undefined, QueryKey> => ({
  queryKey: [QUERY_KEY.PRODUCT.GET_CATEGORIES],
  queryFn: () => getProductCategories(),
  select: (res) => res.data.data,
});

export const useGetProductCategories = () => {
  return useQuery(queryProductCategories());
};
