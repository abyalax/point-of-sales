import { api } from '~/lib/axios/api';
import type { TAxiosResponse } from '~/common/types/response';
import type { PayloadSupplier, Supplier } from './supplier.scema';

export const getSuppliers = async (): Promise<TAxiosResponse<Supplier[]>> => {
  return api.get('/supplier');
};

export const updateSupplier = (payload: PayloadSupplier): Promise<TAxiosResponse<Supplier>> => {
  return api.patch(`/supplier/${payload.id}`, payload);
};

export const deleteSupplier = (params: { id: string }): Promise<TAxiosResponse<boolean>> => {
  return api.delete(`/supplier/${params.id}`);
};

export const createSupplier = (payload: PayloadSupplier): Promise<TAxiosResponse<Supplier>> => {
  return api.post('/supplier', payload);
};
