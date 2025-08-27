import { basePaginationSchema, isValidPercentString, isValidStringPrice, numberAsString } from '~/common/schema';
import type { MetaRequest, MetaResponse } from '~/common/types/meta';
import { EPaymentMethod } from '~/app/(protected)/sales/pos/_types';
import type { IUser } from '../user/user.schema';
import { CURRENT } from '~/common/const/date';
import z from 'zod';

export enum EStatusTransactions {
  Draft = 'Draft',
  Pending = 'Pending',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded',
}

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
export interface Transaction {
  id: number;
  user: IUser;
  cashier: string;
  status: EStatusTransactions;
  sub_total: string;
  total_discount: string;
  total_price: string;
  total_profit: string;
  total_tax: string;
  last_price: string;
  payment_method: string;
  pay_received: string;
  pay_return: string;
  notes?: string;
  items: TransactionItem[];
  created_at?: string;
  updated_at?: string;
}

export interface TransactionItem {
  id: number;
  barcode: string;
  name: string;
  category: string;
  quantity: number;
  price: string;
  cost_price: string;
  sell_price: string;
  final_price: string;
  discount: string;
  tax_rate: string;
  created_at?: string;
  updated_at?: string;
}

export interface QueryTransaction extends MetaRequest<Transaction> {
  min_total_tax?: number;
  max_total_tax?: number;

  min_total_discount?: number;
  max_total_discount?: number;

  min_total_price?: number;
  max_total_price?: number;

  min_total_profit?: number;
  max_total_profit?: number;

  created_at?: string;
  updated_at?: string;

  status?: EStatusTransactions;
  payment_method?: EPaymentMethod;
  user_id?: number;
}

export interface TransactionPaginated {
  data: Transaction[];
  meta: MetaResponse;
}

export type IPayloadTransaction = TransactionState & {
  cashier: string;
};

export const SalesByCategorySchema = z.object({
  category: z.string(),
  total_revenue: isValidStringPrice(),
  total_sales: isValidStringPrice(),
  total_profit: isValidStringPrice(),
  total_qty: isValidStringPrice(),
});

export type SalesByCategory = z.infer<typeof SalesByCategorySchema>;

export const ReportSalesSchema = z.object({
  month: z.string(),
  total_sales: isValidStringPrice(),
  total_profit: isValidStringPrice(),
  total_revenue: isValidStringPrice(),
  total_tax: isValidStringPrice(),
});

export type ReportSales = z.infer<typeof ReportSalesSchema>;

const transactionKeys = [
  'status',
  'cashier',
  'total_discount',
  'total_price',
  'total_profit',
  'total_tax',
  'payment_method',
  'created_at',
  'updated_at',
] as const satisfies readonly [string, ...(keyof Partial<Transaction>)[]];

export const queryTransactionsSchema = z.intersection(
  basePaginationSchema(transactionKeys),
  z
    .object({
      min_total_tax: z.number().optional(),
      max_total_tax: z.number().optional(),

      min_total_discount: z.number().optional(),
      max_total_discount: z.number().optional(),

      min_total_price: z.number().optional(),
      max_total_price: z.number().optional(),

      min_total_profit: z.number().optional(),
      max_total_profit: z.number().optional(),

      created_at: z.string().optional(),
      updated_at: z.string().optional(),

      payment_method: z.enum([EPaymentMethod.Cash, EPaymentMethod.Debit, EPaymentMethod.Ewallet, EPaymentMethod.Qris]).optional(),
      user_id: z.number().optional(),
      status: z
        .enum([
          EStatusTransactions.Draft,
          EStatusTransactions.Pending,
          EStatusTransactions.Completed,
          EStatusTransactions.Cancelled,
          EStatusTransactions.Refunded,
        ])
        .optional(),
    })
    .catchall(z.any()),
);

export type QueryTransactions = z.infer<typeof queryTransactionsSchema>;

export const queryReportSalesSchema = z
  .object({
    status: z.enum([EStatusTransactions.Completed, EStatusTransactions.Cancelled, EStatusTransactions.Refunded]).optional(),
    year: numberAsString(CURRENT.year - 10, CURRENT.year + 10, 'Invalid Year').optional(),
    month: numberAsString(1, 12, 'Invalid month').optional(),
    week: numberAsString(1, 5, 'Invalid week').optional(),
    start: z.string().optional(),
    end: z.string().optional(),
  })
  .catchall(z.any());

export type QueryReportSales = z.infer<typeof queryReportSalesSchema>;
