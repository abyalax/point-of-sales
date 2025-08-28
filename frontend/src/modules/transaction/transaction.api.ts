import type {
  TransactionState,
  QueryReportSales,
  QueryTransaction,
  ReportSales,
  SalesByCategory,
  Transaction,
  TransactionPaginated,
} from './transaction.schema';
import type { CartState } from '~/app/(protected)/sales/pos/_types';
import type { FilterPeriode } from '~/common/types/filter';
import type { TAxiosResponse } from '~/common/types/response';

import { api } from '~/lib/axios/api';
import type { ProductProfitable } from '../product/product.schema';

export const createTransaction = async (params: CartState): Promise<TAxiosResponse<TransactionState>> => {
  return api.post('/transaction', params);
};

export const filterTransactions = async (params: QueryTransaction): Promise<TAxiosResponse<TransactionPaginated>> => {
  return api.get('/transaction', { params });
};

export const getTransactionByID = async (params: { id: string }): Promise<TAxiosResponse<Transaction>> => {
  return api.get(`/transaction/${params.id}`);
};

export const getReportProductProfitable = async (query: FilterPeriode): Promise<TAxiosResponse<ProductProfitable[]>> => {
  return api.get('/transaction/sales/products/profitable', { params: query });
};

export const getReportSalesByYear = async (query: QueryReportSales): Promise<TAxiosResponse<ReportSales>> => {
  return api.get('/transaction/sales', { params: query });
};

export const getReportSalesPerMonth = async (year: string): Promise<TAxiosResponse<ReportSales[]>> => {
  return api.get(`/transaction/sales/month/${year}`);
};

export const getReportSalesByCategory = async (year: string): Promise<TAxiosResponse<SalesByCategory[]>> => {
  return api.get(`/transaction/sales/category/${year}`);
};
