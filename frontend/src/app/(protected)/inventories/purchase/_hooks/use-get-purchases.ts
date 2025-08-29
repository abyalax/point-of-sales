import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import type { TAxiosResponse, TResponse } from '~/common/types/response';
import { QUERY_KEY, type QueryKey } from '~/common/const/querykey';
import { getPurchases } from '~/modules/inventories/purchase/purchase.api';
import type { PurchaseOrder } from '~/modules/inventories/purchase/purchase.schema';

type Result = UseQueryOptions<TAxiosResponse<PurchaseOrder[]>, TResponse, PurchaseOrder[] | undefined, QueryKey[]>;

export const queryGetPurchases = (): Result => ({
  queryKey: [QUERY_KEY.INVENTORIES.PURCHASE.GET_ALL],
  queryFn: () => getPurchases(),
  select: (res) => res.data.data,
});

export const useGetPurchases = () => {
  return useQuery(queryGetPurchases());
};
