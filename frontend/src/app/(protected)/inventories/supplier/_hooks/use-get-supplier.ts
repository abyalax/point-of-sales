import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import type { Supplier } from '~/modules/inventories/supplier/supplier.scema';
import { getSuppliers } from '~/modules/inventories/supplier/supplier.api';
import type { TAxiosResponse, TResponse } from '~/common/types/response';
import { QUERY_KEY, type QueryKey } from '~/common/const/querykey';

type Result = UseQueryOptions<TAxiosResponse<Supplier[]>, TResponse, Supplier[] | undefined, QueryKey[]>;

export const queryGetSuppliers = (): Result => ({
  queryKey: [QUERY_KEY.INVENTORIES.SUPPLIER.GET_ALL],
  queryFn: () => getSuppliers(),
  select: (res) => res.data.data,
});

export const useGetSuppliers = () => {
  return useQuery(queryGetSuppliers());
};
