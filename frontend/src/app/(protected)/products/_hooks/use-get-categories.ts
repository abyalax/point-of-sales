import type { UseQueryOptions } from '@tanstack/react-query';
import type { TAxiosResponse, TResponse } from '~/common/types/response';
import type { ICategory } from '~/modules/product/product.schema';

import { getProductCategories } from '~/modules/product/product.api';
import { QUERY_KEY, type QueryKey } from '~/common/const/querykey';
import { useQuery } from '@tanstack/react-query';

export const queryProductCategories = (): UseQueryOptions<TAxiosResponse<ICategory[]>, TResponse, ICategory[] | undefined, QueryKey[]> => ({
  queryKey: [QUERY_KEY.PRODUCT.GET_CATEGORIES],
  queryFn: () => getProductCategories(),
  select: (res) => res.data.data,
});

export const useGetProductCategories = () => {
  return useQuery(queryProductCategories());
};
