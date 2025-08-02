export enum EPaymentMethod {
  Cash = 'Cash',
  Qris = 'Qris',
  Debit = 'Debit',
  Ewallet = 'E-Wallet',
}

export interface ICartItem {
  id: string;
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
  subtotal: string;
  total: string;
  total_item: number;
  total_discount: string;
  payment_method: EPaymentMethod;
  pay_received: string;
  pay_return: string;
  tax: string;
  notes: string;
}
