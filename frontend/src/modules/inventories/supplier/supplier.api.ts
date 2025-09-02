import type { PayloadSupplier, Supplier } from './supplier.scema';
import type { TAxiosResponse } from '~/common/types/response';
import { api } from '~/lib/axios/api';

export const getSuppliers = async (): Promise<TAxiosResponse<Supplier[]>> => {
  return api.get('/suppliers');
};

export const updateSupplier = (payload: PayloadSupplier): Promise<TAxiosResponse<Supplier>> => {
  return api.patch(`/suppliers/${payload.id}`, payload);
};

export const deleteSupplier = (params: { id: string }): Promise<TAxiosResponse<boolean>> => {
  return api.delete(`/suppliers/${params.id}`);
};

export const createSupplier = (payload: PayloadSupplier): Promise<TAxiosResponse<Supplier>> => {
  return api.post('/suppliers', payload);
};
