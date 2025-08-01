import type { ICartState, ICartItem } from '~/app/(protected)/pos/_types';
import { EPaymentMethod } from '~/app/(protected)/pos/_types';
import { produce } from '~/utils';

export class CartStore {
  private _stateCart: ICartState;
  private _listeners: Set<VoidFunction>;

  constructor() {
    this._stateCart = {
      subtotal: 0,
      tax: 0,
      total: 0,
      total_item: 0,
      total_discount: 0,
      payment_method: EPaymentMethod.Cash,
      pay_return: 0,
      pay_received: 0,
      notes: '',
      items: [],
    };
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

  public fetchByName = (name: string) => {
    const fetchData = fetch('api/product/name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `name=${encodeURIComponent(name)}`,
    });
    const response = fetchData.then((response) => response.json());
    return response;
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
          quantity: product.quantity || 1,
        });
      }
    });
    this.calculateTotals();
    this.save();
    this.notify();
  };

  public removeItem = (productId: string): void => {
    this._stateCart = produce(this._stateCart, (draft) => {
      draft.items = draft.items.filter((item) => item.id !== productId);
    });
    this.calculateTotals();
    this.save();
    this.notify();
  };

  public updateQuantity = (productId: string, newQuantity: number): void => {
    console.log('Updating item with:', 'productId: ', productId, 'newQuantity: ', newQuantity);
    this._stateCart = produce(this._stateCart, (draft) => {
      const item = draft.items.find((item) => item.id === productId);
      console.log('Updating quantity for item:', item);
      if (item) {
        item.quantity = newQuantity;
        this.calculateTotals();
        this.save();
        this.notify();
        console.log('Cart after update:', this._stateCart);
      }
    });
  };

  private calculateTotals = (): void => {
    console.log('Calculating totals...');
    this._stateCart = produce(this._stateCart, (draft) => {
      const cart = draft;
      const items = cart.items;

      let subtotal = 0;
      let total_discount = 0;
      let tax = 0;
      let total_item = 0;

      for (const item of items) {
        const itemTotal = item.price * item.quantity;
        const itemDiscount = item.price * (item.discount || 0) * item.quantity;
        const itemTax = (item.tax_rate || 0) * item.price * item.quantity;

        subtotal += itemTotal;
        total_discount += itemDiscount;
        tax += itemTax;
        total_item += item.quantity;
      }

      cart.subtotal = subtotal;
      cart.total_discount = total_discount;
      cart.tax = tax;
      cart.total = subtotal - total_discount + tax;
      cart.total_item = total_item;

      console.log('Cart calculated:', {
        subtotal,
        total_discount,
        tax,
        total: cart.total,
        total_item,
      });
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
      this._stateCart = JSON.parse(savedCart);
      console.log('stateCart : ', this._stateCart);
    }
  };

  public isEmptyCart = (): boolean => {
    return this._stateCart.items.length === 0;
  };

  public clearCart = (): void => {
    this._stateCart = produce(this._stateCart, (draft) => {
      draft.items = [];
      draft.subtotal = 0;
      draft.tax = 0;
      draft.total = 0;
      draft.total_item = 0;
      draft.total_discount = 0;
      draft.payment_method = EPaymentMethod.Cash;
      draft.pay_return = 0;
      draft.pay_received = 0;
      draft.notes = '';
    });
    this.save();
    this.notify();
    console.log('Cart cleared...');
  };

  public getCart = (): ICartState => {
    return this._stateCart;
  };

  public setPaymentMethod = (paymentMethod: EPaymentMethod) => {
    this._stateCart = produce(this._stateCart, (draft) => {
      draft.payment_method = paymentMethod;
    });
  };

  public setPayReceived = (pay: number) => {
    console.log('setPayReceived: ', pay);
    this._stateCart = produce(this._stateCart, (draft) => {
      draft.pay_received = pay;
    });
  };

  public setPayChange = (pay: number) => {
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
