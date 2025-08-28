import { TransactionItem } from './entities/transaction-item.entity';
import { Transaction } from './entities/transaction.entity';
import { Product } from '../product/entity/product.entity';
import Big from 'big.js';
import z from 'zod';
import { stringNumber } from '~/common/schema';
import { EProductStatus } from '../product/product.schema';

export const isValidStringPrice = () =>
  z.string().superRefine((val, ctx) => {
    try {
      if (val.includes(',')) {
        ctx.addIssue({
          code: 'custom',
          message: 'Use dot as decimal separator',
        });
      }
      const num = new Big(val);
      if (Number.isNaN(num)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Value must be a valid number string',
        });
      }
    } catch {
      ctx.addIssue({ code: 'custom', message: 'Invalid number string' });
    }
  });

export const isValidPercentString = (min: string = '0', max: string = '1') =>
  z.string().superRefine((val, ctx) => {
    try {
      if (val.includes(',')) {
        ctx.addIssue({
          code: 'custom',
          message: 'Use dot as decimal separator',
        });
      }
      const parts = val.split('.');
      if (parts[1] && parts[1].length > 4) {
        ctx.addIssue({
          code: 'custom',
          message: 'Value must have at most 4 decimal places',
        });
        return;
      }
      const num = new Big(val);
      if (Number.isNaN(Number(num.toString()))) {
        ctx.addIssue({
          code: 'custom',
          message: 'Value must be a valid number string',
        });
        return;
      }
      if (num.lt(min) || num.gt(max)) {
        ctx.addIssue({
          code: 'custom',
          message: `Percentage must be between ${min} and ${max}`,
        });
      }
    } catch {
      ctx.addIssue({ code: 'custom', message: 'Invalid number string' });
    }
  });

export enum EStatusTransactions {
  Draft = 'Draft',
  Pending = 'Pending',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded',
}

export enum EPaymentMethod {
  Cash = 'Cash',
  Qris = 'Qris',
  Debit = 'Debit',
  Ewallet = 'Ewallet',
}

export const cartItemSchema = z.object({
  barcode: z.string(),
  name: z.string(),
  category: z.string(),
  price: isValidStringPrice(),
  cost_price: isValidStringPrice(),
  tax_rate: isValidPercentString(),
  discount: isValidPercentString('0', '0.9'),
  quantity: z.number(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const CartStateSchema = z.object({
  items: z.array(cartItemSchema),
  sub_total: isValidStringPrice(),
  total: isValidStringPrice(),
  total_item: z.number(),
  total_discount: isValidStringPrice(),
  payment_method: z.string(),
  pay_received: isValidStringPrice(),
  pay_return: isValidStringPrice(),
  tax: isValidStringPrice(),
  notes: z.string().optional(),
});

export type CartState = z.infer<typeof CartStateSchema>;

export const ItemSummarySchema = z.object({
  name: z.string(),
  sub_total: isValidStringPrice(),
  total_discount: isValidStringPrice(),
  total_price: isValidStringPrice(),
  unit_profit: isValidStringPrice(),
  total_profit: isValidStringPrice(),
  total_tax: isValidStringPrice(),
  last_price: isValidStringPrice(),
});

export type ItemSummary = z.infer<typeof ItemSummarySchema>;

export const PreTransactionItemSchema = z.object({
  name: z.string(),
  category: z.string(),
  quantity: z.number(),
  price: isValidStringPrice(),
  cost_price: isValidStringPrice(),
  discount: isValidPercentString(),
  tax_rate: isValidPercentString(),
  summary: ItemSummarySchema.optional(),
});

export type PreTransactionItem = z.infer<typeof PreTransactionItemSchema>;

export const CartItemDtoSchema = z.object({
  barcode: z.string(),
  name: z.string(),
  category: z.string(),
  price: isValidStringPrice(),
  cost_price: isValidStringPrice(),
  tax_rate: isValidPercentString(),
  discount: isValidPercentString(),
  quantity: z.number(),
});

export type CartItemDto = z.infer<typeof CartItemDtoSchema>;

export const CartDtoSchema = z.object({
  items: z.array(CartItemDtoSchema),
  sub_total: isValidStringPrice(),
  total: isValidStringPrice(),
  total_item: z.number(),
  total_discount: isValidStringPrice(),
  payment_method: z.string(),
  pay_received: isValidStringPrice(),
  pay_return: isValidStringPrice(),
  tax: isValidStringPrice(),
  notes: z.string().optional(),
});

export type CartDto = z.infer<typeof CartDtoSchema>;

export const TransactionStateItemSchema = z.object({
  name: z.string(),
  category: z.string(),
  barcode: z.string(),
  quantity: z.number(),
  price: isValidStringPrice(),
  cost_price: isValidStringPrice(),
  discount: isValidPercentString(),
  tax_rate: isValidPercentString(),
  sell_price: isValidStringPrice(),
  final_price: isValidStringPrice(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type TransactionStateItem = z.infer<typeof TransactionStateItemSchema>;

export const TransactionStateSchema = z.object({
  status: z.enum(['Completed', 'Draft', 'Pending', 'Refunded', 'Canceled']),
  items: z.array(TransactionStateItemSchema),
  sub_total: isValidStringPrice(),
  total_discount: isValidStringPrice(),
  total_price: isValidStringPrice(),
  total_profit: isValidStringPrice(),
  total_tax: isValidStringPrice(),
  pay_return: isValidStringPrice(),
  pay_received: isValidStringPrice(),
  payment_method: z.string(),
  last_price: isValidStringPrice(),
  notes: z.string().optional(),
  user_id: z.number(),
  cashier: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type TransactionState = z.infer<typeof TransactionStateSchema>;

export type OmitTransactionItem = Omit<PreTransactionItem & TransactionItem, 'id'>;
export type OmitTransaction = Omit<Transaction, 'items' | 'cashier' | 'user' | 'id' | 'created_at' | 'updated_at'> & {
  items: OmitTransactionItem[];
};

export const ReportSalesSchema = z.object({
  total_sales: isValidStringPrice(),
  total_profit: isValidStringPrice(),
  total_revenue: isValidStringPrice(),
  total_tax: isValidStringPrice(),
});

export type ReportSales = z.infer<typeof ReportSalesSchema>;

export const ProductProfitableSchema = z.object({
  category: z.string(),
  name: z.string(),
  quantity: stringNumber('Quantity must be a valid number'),
  margin_percentage: isValidPercentString(),
  revenue: isValidStringPrice(),
});

export type ProductProfitable = z.infer<typeof ProductProfitableSchema>;

export const SalesByCategorySchema = z.object({
  category: z.string(),
  total_revenue: isValidStringPrice(),
  total_sales: isValidStringPrice(),
  total_profit: isValidStringPrice(),
  total_qty: isValidStringPrice(),
});

export type SalesByCategory = z.infer<typeof SalesByCategorySchema>;

export const OmitProductSchema = z.object({
  category: z.string(),
  name: z.string(),
  barcode: z.string(),
  price: z.string(),
  cost_price: z.string(),
  tax_rate: z.string(),
  discount: z.string(),
  status: z.enum([EProductStatus.AVAILABLE, EProductStatus.UNAVAILABLE]),
});

export type OmitProduct = Omit<Product, 'id' | 'category' | 'category_id' | 'stock' | 'created_at' | 'updated_at'> & {
  category: string;
};

export type OmitTransactionState = Omit<TransactionState, 'status'> & { status: EStatusTransactions };
