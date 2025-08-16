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

export interface ICartItem {
  id: number;
  barcode: string;
  name: string;
  category: string;
  price: string;
  cost_price: string;
  tax_rate: string;
  discount: string;
  quantity: number;
}

export interface ICartState {
  items: ICartItem[];
  sub_total: string;
  total: string;
  total_item: number;
  total_discount: string;
  payment_method: EPaymentMethod;
  pay_received: string;
  pay_return: string;
  tax: string;
  notes: string;
}

export interface ItemSummary {
  name: string;
  sub_total: string;
  total_discount: string;
  total_price: string;
  unit_profit: string;
  total_profit: string;
  total_tax: string;
  last_price: string;
}

export interface ItemTransaction {
  name: string;
  category: string;
  quantity: number;
  price: string;
  cost_price: string;
  discount: string;
  tax_rate: string;
  summary?: ItemSummary;
}

export interface ITransactionState {
  status: EStatusTransactions;
  items: ItemTransaction[];
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
  created_at?: string;
  updated_at?: string;
}
