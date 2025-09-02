import z from 'zod';
import { EProductStatus } from '../product/product.schema';

export enum EInventoryStockType {
  ORDER = 'Order',
  PRE_ORDER = 'Pre Order',
  SALES = 'Sales',
  CANCEL = 'Cancel',
}

export enum EStatusDelivery {
  PENDING = 'Pending',
  DELIVERED = 'Delivered',
  DROPPED = 'Dropped',
  COMPLETED = 'Completed',
  CANCEL = 'Cancel',
}

export enum EStatusPayment {
  PAID = 'Paid',
  UNPAID = 'Unpaid',
}

export enum EInventoryLogType {
  ORDER = 'Order',
  PRE_ORDER = 'Pre Order',
  SALES = 'Sales',
  CANCEL = 'Cancel',
  ADJUSTMENT = 'Adjustment',
}

export const BaseInventorySchema = z.object({
  id: z.number(),
  stock: z.number(),
  min_stock: z.number(),
  max_stock: z.number(),
  product_id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const InventorySchema = z.intersection(
  BaseInventorySchema,
  z.object({
    product_name: z.string(),
    supplier_name: z.string(),
    product_barcode: z.string(),
    product_status: z.enum([EProductStatus.AVAILABLE, EProductStatus.UNAVAILABLE]),
  }),
);

export type Inventories = z.infer<typeof InventorySchema>;
