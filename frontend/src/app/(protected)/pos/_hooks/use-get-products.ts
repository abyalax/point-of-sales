import { useQuery } from '@tanstack/react-query';
import { getProducts } from '~/api/product/api';
import { QUERY_KEY } from '~/common/const/querykey';

export const queryProducts = () => ({
  queryKey: [QUERY_KEY.PRODUCT.GET_ALL],
  queryFn: () => getProducts(),
});

export const useGetProducts = () => {
  return useQuery(queryProducts());
};
