import { useQuery } from '@tanstack/react-query';
import { getProductByID } from '~/api/product/api';
import { QUERY_KEY } from '~/common/const/querykey';

export const queryProductByID = (query: { id: string }) => ({
  queryKey: [QUERY_KEY.PRODUCT.GET_ALL, query],
  queryFn: () => getProductByID(query),
});

const useGetProduct = (query: { id: string }) => {
  return useQuery(queryProductByID(query));
};

export default useGetProduct;
