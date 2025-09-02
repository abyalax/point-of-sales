import z from 'zod';
import { stringNumber } from '~/common/schema';

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

export const CategorySchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  products: z.array(z.any()).optional(),
  suppliers: z.array(z.any()).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const ProductSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  barcode: z.string(),
  price: z.string(),
  cost_price: z.string(),
  tax_rate: z.string(),
  discount: z.string(),
  status: z.enum([EProductStatus.AVAILABLE, EProductStatus.UNAVAILABLE]),
  category_id: z.coerce.number(),
  category: CategorySchema,
  inventories: z.array(z.any()).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const ProductTrendingSchema = z.object({
  name: z.string(),
  periode: z.coerce.number(),
  id: z.coerce.number(),
  total_qty: z.coerce.number(),
});

export type ProductTrending = z.infer<typeof ProductTrendingSchema>;

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
