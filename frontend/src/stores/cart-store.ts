import type { CartState, CartItem } from '~/app/(protected)/sales/pos/_types';
import { EPaymentMethod } from '~/app/(protected)/sales/pos/_types';
import { notifications } from '@mantine/notifications';
import { formatCurrency } from '~/utils/format';
import { produce } from '~/utils';
import Big from 'big.js';

export class CartStore {
  public _stateCart: CartState;
  private _listeners: Set<VoidFunction>;

  constructor() {
    this._stateCart = {
      sub_total: '0',
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

  public addItem = (product: CartItem): void => {
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
    this.notify();
  };

  public removeItem = (productId: number): void => {
    this._stateCart = produce(this._stateCart, (draft) => {
      draft.items = draft.items.filter((item) => item.id !== productId);
    });
    this.calculateTotals();
    this.save();
    this.notify();
  };

  public updateQuantity = (productId: number, qty: number | string): void => {
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
    this.notify();
  };

  private calculateTotals = (): void => {
    this._stateCart = produce(this._stateCart, (draft) => {
      let sub_total = new Big(0);
      let total_discount = new Big(0);
      let tax = new Big(0);
      let total_quantity = 0;

      for (const item of draft.items) {
        const i = draft.items.indexOf(item);

        const price = new Big(item.price);
        const quantity = new Big(item.quantity);
        const discount = new Big(item.discount);
        const tax_rate = new Big(item.tax_rate);

        const item_total = price.times(quantity);
        const total_item_discount = price.times(discount).times(quantity);
        const item_tax = tax_rate.times(price).times(quantity);

        sub_total = sub_total.plus(item_total);
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

      draft.sub_total = sub_total.toString();
      draft.total_discount = total_discount.toString();
      draft.tax = tax.toString();
      draft.total = sub_total.minus(total_discount).plus(tax).toString();
      draft.total_item = total_quantity;
    });
  };

  public printStruct = async (carts: CartState, cashier?: string): Promise<void> => {
    console.log('Print Struct : ', { carts });
    if (cashier === undefined) return;

    const receiptDiv = document.createElement('div');
    receiptDiv.id = 'receipt';
    receiptDiv.style.display = 'none';

    // Format tanggal
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];
    console.log('Cashier : ', cashier);

    // Header struk
    let html = `
      <div style="font-family: monospace; font-size: 10px; padding: 10px;color: black;">
          <div style="text-align: center;">
              <strong>Abya's DevStore</strong><br>
              Jl. Kartini Mojokerep, Plemahan<br>
              Kabupaten Kediri<br>
              No. Telp 0812345678<br>
              16413520230802084636
          </div>
          <hr>
          <div style="display: flex; justify-content: space-between;">
              <div>${dateStr}<br>${timeStr}</div>
              <div style="text-align: end;">
                  Kasir<br>
                  ${cashier}<br>
              </div>
          </div>
          <br>Products<br>
          <hr>
        `;

    let itemIndex = 1;
    let totalQty = 0;

    html += carts.items
      .map((item) => {
        const qty = item.quantity;
        const item_price = new Big(item.price);
        const total = item_price.times(qty);
        totalQty += qty;

        return `
              <div style="margin-bottom: 15px;">
                  <strong>${itemIndex++}. ${item.name}</strong>
                  <div style="display:flex;justify-content:space-between;">
                      <div style="margin-left: 30px;">${qty} x Rp ${formatCurrency(item.price)}</div>
                      <div>Rp ${formatCurrency(total.toString())}</div>
                  </div>
              </div>
            `;
      })
      .join('<br>');

    html += `
      <hr>
      <div>Total QTY : ${totalQty}</div>
      <br>
      <div style="display: flex; justify-content: space-between;">
          <span>Sub Total</span>
          <span>${formatCurrency(carts.sub_total)}</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
          <span>Total Tax</span>
          <span>${formatCurrency(carts.tax)}</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
          <span>Total Discount</span>
          <span>${formatCurrency(carts.total_discount)}</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
          <strong>Total</strong>
          <strong>${formatCurrency(carts.total)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between;">
          <span>Bayar (Cash)</span>
          <span>${formatCurrency(carts.pay_received)}</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
          <span>Kembali</span>
          <span>${formatCurrency(carts.pay_return)}</span>
      </div>
      <br>
      <div style="text-align: center;">Terimakasih Telah Berbelanja</div>
      <br>
      <div style="font-size: 10px; text-align: center;">
          Link Kritik dan Saran:<br>
          com/e-receipt/S-00D39U-07G344G
      </div>
      </div>
    `;

    receiptDiv.innerHTML = html;
    document.body.appendChild(receiptDiv);

    // CSS print override
    const style = document.createElement('style');
    style.textContent = `
      @media print {
          body * {
              visibility: hidden !important;
          }
          #receipt, #receipt * {
              visibility: visible !important;
          }
          #receipt {
              position: absolute;
              color: black;
              left: 0;
              top: 0;
              width: 100%;
              padding: 10px;
          }
      }
    `;
    document.head.appendChild(style);

    // Tampilkan lalu print
    receiptDiv.style.display = 'block';

    setTimeout(() => {
      console.log('Start Print...');
      window.print();
      receiptDiv.remove();
      style.remove();
    }, 200);
  };

  private save = (): void => {
    localStorage.setItem('pos_cart', JSON.stringify(this._stateCart));
  };

  public loadFromStorage = () => {
    const savedCart = localStorage.getItem('pos_cart');
    if (savedCart) {
      this._stateCart = produce(this._stateCart, (draft) => {
        Object.assign(draft, JSON.parse(savedCart));
      });
      this.notify();
    }
  };

  public isEmptyCart = (): boolean => {
    return this._stateCart.items.length === 0;
  };

  public clearCart = (): void => {
    this._stateCart = produce(this._stateCart, (draft) => {
      draft.items = [];
      draft.sub_total = '0';
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
    this.notify();
  };

  public getCart = (): CartState => this._stateCart;

  public setPaymentMethod = (paymentMethod: EPaymentMethod) => {
    this._stateCart = produce(this._stateCart, (draft) => {
      draft.payment_method = paymentMethod;
    });
    this.notify();
  };

  public setPayReceived = (pay: string) => {
    console.log('setPayReceived', pay);
    this._stateCart = produce(this._stateCart, (draft) => {
      draft.pay_received = pay;
    });
    this.notify();
  };

  public setPayReturn = (pay: string) => {
    console.log('setPayChange', pay);
    this._stateCart = produce(this._stateCart, (draft) => {
      draft.pay_return = pay;
    });
    this.notify();
  };

  public setNotes = (notes: string) => {
    this._stateCart = produce(this._stateCart, (draft) => {
      draft.notes = notes;
    });
    this.notify();
  };
}
