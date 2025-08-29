import { api } from '~/lib/axios/api';
import type { TAxiosResponse } from '~/common/types/response';
import type { PayloadPurchaseOrder, PurchaseOrder } from './purchase.schema';

export const getPurchases = async (): Promise<TAxiosResponse<PurchaseOrder[]>> => {
  return api.get('/purchase');
};

export const updatePurchase = (payload: PayloadPurchaseOrder): Promise<TAxiosResponse<PurchaseOrder>> => {
  return api.patch(`/purchase/${payload.id}`, payload);
};

export const deletePurchase = (params: { id: string }): Promise<TAxiosResponse<boolean>> => {
  return api.delete(`/purchase/${params.id}`);
};

export const createPurchase = (payload: PayloadPurchaseOrder): Promise<TAxiosResponse<PurchaseOrder>> => {
  return api.post('/purchase', payload);
};
