import z from 'zod';
import { stringNumber } from '~/common/schema';
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

export const productFrequencySoldSchema = z.object({
  name: z.string(),
  category: z.string(),
  total_product: stringNumber('Total product must be a valid number'),
});

export type ProductFrequencySold = z.infer<typeof productFrequencySoldSchema>;

export const productDiscountImpactSchema = z.object({
  name: z.string(),
  with_discount: stringNumber('With discount must be a valid number'),
  without_discount: stringNumber('With discount must be a valid number'),
});

export type ProductDiscountImpact = z.infer<typeof productDiscountImpactSchema>;
