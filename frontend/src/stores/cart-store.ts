import { notifications } from '@mantine/notifications';
import type { ICartState, ICartItem } from '~/app/(protected)/pos/_types';
import { EPaymentMethod } from '~/app/(protected)/pos/_types';
import { produce } from '~/utils';
import Big from 'big.js';

export class CartStore {
  public _stateCart: ICartState;
  private _listeners: Set<VoidFunction>;

  constructor() {
    this._stateCart = {
      subtotal: '0',
      tax: '0',
      total: '0',
      total_item: 0,
      total_discount: '0',
      payment_method: EPaymentMethod.Cash,
      pay_return: '0',
      pay_received: '0',
      notes: '',
      items: [],
    };
    console.log('create new CartStore');
    this._listeners = new Set();
    this.loadFromStorage();
  }

  public subscribe = (listener: VoidFunction) => {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  };

  private notify = () => {
    this._listeners.forEach((listener) => listener());
  };

  public addItem = (product: ICartItem): void => {
    console.log('Adding item:', product);
    this._stateCart = produce(this._stateCart, (draft) => {
      const existingItem = draft.items.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += product.quantity ?? 1;
      } else {
        draft.items.push({
          ...product,
          quantity: product.quantity ?? '1',
        });
      }
    });
    this.calculateTotals();
    this.save();
    console.log('trigger notify addItem');
    this.notify();
  };

  public removeItem = (productId: string): void => {
    this._stateCart = produce(this._stateCart, (draft) => {
      draft.items = draft.items.filter((item) => item.id !== productId);
    });
    this.calculateTotals();
    this.save();
    console.log('trigger notify removeItem');
    this.notify();
  };

  public updateQuantity = (productId: string, qty: number | string): void => {
    if (qty === '') return;
    const newQty = parseInt(qty.toString());
    if (newQty < 1) {
      notifications.show({
        color: 'yellow',
        title: 'Failed to update quantity',
        message: 'Quantity must be greater than 0',
      });
      return;
    }

    this._stateCart = produce(this._stateCart, (draft) => {
      const item = draft.items.find((item) => item.id === productId);
      if (item) {
        item.quantity = newQty;
      } else {
        notifications.show({
          color: 'red',
          title: 'Failed to update quantity',
          message: 'Item not found in cart',
        });
      }
    });
    this.calculateTotals();
    this.save();
    console.log('trigger notify updateQuantity');
    this.notify();
  };

  private calculateTotals = (): void => {
    this._stateCart = produce(this._stateCart, (draft) => {
      let subtotal = new Big(0);
      let total_discount = new Big(0);
      let tax = new Big(0);
      let total_quantity = 0;

      for (let i = 0; i < draft.items.length; i++) {
        const item = draft.items[i];

        const price = new Big(item.price);
        const quantity = new Big(item.quantity);
        const discount = new Big(item.discount);
        const tax_rate = new Big(item.tax_rate);

        const item_total = price.times(quantity);
        const total_item_discount = price.times(discount).times(quantity);
        const item_tax = tax_rate.times(price).times(quantity);

        subtotal = subtotal.plus(item_total);
        total_discount = total_discount.plus(total_item_discount);
        tax = tax.plus(item_tax);
        total_quantity += quantity.toNumber();

        draft.items[i] = {
          ...item,
          price: price.toString(),
          quantity: quantity.toNumber(),
          discount: discount.toString(),
          tax_rate: tax_rate.toString(),
        };
      }

      draft.subtotal = subtotal.toString();
      draft.total_discount = total_discount.toString();
      draft.tax = tax.toString();
      draft.total = subtotal.minus(total_discount).plus(tax).toString();
      draft.total_item = total_quantity;
    });
  };

  private save = (): void => {
    console.log('Save To Storage...');
    localStorage.setItem('pos_cart', JSON.stringify(this._stateCart));
  };

  public loadFromStorage = () => {
    console.log('Load from storage...');
    const savedCart = localStorage.getItem('pos_cart');
    if (savedCart) {
      console.log('stateCart : ', this._stateCart);
      this._stateCart = produce(this._stateCart, (draft) => {
        Object.assign(draft, JSON.parse(savedCart));
      });
      console.log('trigger notify loadFromStorage');
      this.notify();
    }
  };

  public isEmptyCart = (): boolean => {
    return this._stateCart.items.length === 0;
  };

  public clearCart = (): void => {
    this._stateCart = produce(this._stateCart, (draft) => {
      draft.items = [];
      draft.subtotal = '0';
      draft.tax = '0';
      draft.total = '0';
      draft.total_item = 0;
      draft.total_discount = '0';
      draft.payment_method = EPaymentMethod.Cash;
      draft.pay_return = '0';
      draft.pay_received = '0';
      draft.notes = '';
    });
    this.save();
    console.log('trigger notify clearCart');
    this.notify();
  };

  public getCart = (): ICartState => this._stateCart;

  public setPaymentMethod = (paymentMethod: EPaymentMethod) => {
    this._stateCart = produce(this._stateCart, (draft) => {
      draft.payment_method = paymentMethod;
    });
  };

  public setPayReceived = (pay: string) => {
    console.log('setPayReceived: ', pay);
    this._stateCart = produce(this._stateCart, (draft) => {
      draft.pay_received = pay;
    });
  };

  public setPayChange = (pay: string) => {
    console.log('setPayChange: ', pay);
    this._stateCart = produce(this._stateCart, (draft) => {
      draft.pay_return = pay;
    });
  };

  public setNotes = (notes: string) => {
    this._stateCart = produce(this._stateCart, (draft) => {
      draft.notes = notes;
    });
  };
}
