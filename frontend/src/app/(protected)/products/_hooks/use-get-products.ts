import { useQuery } from '@tanstack/react-query';
import { getProducts } from '~/api/product/api';
import type { QueryProducts } from '~/api/product/type';
import { QUERY_KEY } from '~/common/const/querykey';

export const queryProducts = (query: QueryProducts = { engine: 'server_side' }) => ({
  queryKey: [QUERY_KEY.PRODUCT.GET_ALL, query],
  queryFn: () => getProducts(query),
});

const useGetProducts = (query: QueryProducts = {}) => {
  return useQuery(queryProducts(query));
};

export default useGetProducts;
