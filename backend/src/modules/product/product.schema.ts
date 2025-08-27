import type { MetaRequest } from '~/common/types/meta';

export enum EProductStatus {
  AVAILABLE = 'Available',
  UNAVAILABLE = 'UnAvailable',
}

export enum ESortBy {
  NAME = 'name',
  PRICE = 'price',
  STATUS = 'status',
  CATEGORY = 'category',
  STOCK = 'stock',
}

interface IFilter {
  price?: number;
  status?: EProductStatus;
  category?: string;
  stock?: number;
}

export interface Product {
  id: string;
  name: string;
  barcode: string;
  price: string;
  cost_price: string;
  tax_rate: string;
  discount: string;
  status: EProductStatus;
  category: ICategory;
  stock: number;
  created_at?: string;
  updated_at?: string;
}

export interface ICategory {
  id: string;
  name: string;
  products?: Product[];
  created_at?: string;
  updated_at?: string;
}

export interface IQueryProducts extends MetaRequest<Product>, IFilter {}

export interface ProductTrending {
  name: string;
  periode: number;
  id: number;
  total_qty: number;
}

export type ProductTrendPeriode = 'week' | 'month';
