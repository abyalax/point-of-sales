import type { Product } from '~/modules/product/product.schema';
import type { Supplier } from '../supplier/supplier.scema';

export enum EPurchaseStatus {
  PENDING = 'pending', // baru dibuat
  APPROVED = 'approved', // disetujui untuk diproses
  DELIVERED = 'delivered', // barang sudah dikirim supplier
  COMPLETED = 'completed', // barang sudah diterima penuh
  CANCELLED = 'cancelled',
}

export enum EPaymentStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
  PARTIAL = 'partial',
}

export interface PurchaseOrderItem {
  id: number;
  purchase_order_id: number;
  purchaseOrder: PurchaseOrder;
  product_id: number;
  product: Product;
  quantity: number;
  price: string;
  sub_total: string;
}

export interface PurchaseOrder {
  id: number;
  supplier_id: number;
  supplier: Supplier;
  status: EPurchaseStatus;
  total_amount: string;
  order_date: string;
  expected_date?: string;
  created_at: string;
  updated_at: string;
  items: PurchaseOrderItem[];
}

// TODO
export type OmitPurchaseOrderItem = Omit<PurchaseOrderItem, 'purchaseOrder' | 'product' | 'id' | 'purchase_order_id'>;
export type PayloadPurchaseOrder = Omit<PurchaseOrder, 'supplier' | 'items'> & { items: OmitPurchaseOrderItem[] };
