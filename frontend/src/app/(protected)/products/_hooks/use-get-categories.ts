import { useQuery } from '@tanstack/react-query';
import { getProductCategories } from '~/api/product/api';
import { QUERY_KEY } from '~/common/const/querykey';

export const queryProductCategories = () => ({
  queryKey: [QUERY_KEY.PRODUCT.GET_CATEGORIES],
  queryFn: () => getProductCategories(),
});

export const useGetProductCategories = () => {
  return useQuery(queryProductCategories());
};
