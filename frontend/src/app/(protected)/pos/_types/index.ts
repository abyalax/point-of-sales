export enum EPaymentMethod {
  Cash = 'cash',
  Qris = 'qris',
  Debit = 'debit',
  Ewallet = 'ewallet',
}

export interface ICartItem {
  id: string;
  barcode: string;
  name: string;
  category: string;
  price: number;
  cost_price: number;
  tax_rate: number;
  discount: number;
  quantity: number;
}

export interface ICartState {
  items: ICartItem[];
  subtotal: number;
  total: number;
  total_item: number;
  total_discount: number;
  payment_method: EPaymentMethod;
  pay_received: number;
  pay_return: number;
  tax: number;
  notes: string;
}
