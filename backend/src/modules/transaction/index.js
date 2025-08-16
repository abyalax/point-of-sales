/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

const Big = require('big.js');

const EStatusTransactions = {
  Draft: 'Draft',
  Pending: 'Pending',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
  Refunded: 'Refunded',
};

const EPaymentMethod = {
  Cash: 'Cash',
  Qris: 'Qris',
  Debit: 'Debit',
  Ewallet: 'Ewallet',
};

const carts = {
  items: [
    {
      id: 8,
      barcode: '8999777888350',
      name: 'NIVEA MEN Extra Bright 50ml',
      price: '25000',
      cost_price: '15000',
      tax_rate: '0.1',
      discount: '0.08',
      category: 'Perawatan Pribadi',
      quantity: 1,
    },
    {
      id: 7,
      barcode: '8999991122334',
      name: 'Shampoo Pantene 180ml',
      price: '23000.00',
      discount: '0.13',
      cost_price: '17000.00',
      tax_rate: '0.10',
      category: 'Perawatan Pribadi',
      quantity: 3,
    },
    {
      id: 1,
      barcode: '8991001101234',
      name: 'Biskuit Roma Kelapa 300g',
      price: '12000',
      cost_price: '8500',
      tax_rate: '0.1',
      discount: '0',
      category: 'Makanan',
      quantity: 2,
    },
  ],
  subtotal: '118000',
  tax: '11800',
  total: '118830',
  total_item: 6,
  total_discount: '10970',
  payment_method: EPaymentMethod.Cash,
  pay_return: '1170',
  pay_received: '120000',
  notes: '',
};

const results = {
  status: 'Pending',
  item: [
    {
      name: 'NIVEA MEN Extra Bright 50ml',
      category: 'Perawatan Pribadi',
      product_id: 8,
      barcode: '8999777888350',
      quantity: 1,
      price: '25000',
      cost_price: '15000',
      discount: '0.08',
      tax_rate: '0.1',
      summary: {
        name: 'NIVEA MEN Extra Bright 50ml',
        sub_total: '25000',
        total_discount: '2000',
        total_price: '23000',
        unit_profit: '8000',
        total_profit: '8000',
        total_tax: '2500',
        last_price: '25500',
      },
    },
    {
      name: 'Shampoo Pantene 180ml',
      category: 'Perawatan Pribadi',
      product_id: 7,
      barcode: '8999991122334',
      quantity: 3,
      price: '23000.00',
      cost_price: '17000.00',
      discount: '0.13',
      tax_rate: '0.10',
      summary: {
        name: 'Shampoo Pantene 180ml',
        sub_total: '69000',
        total_discount: '8970',
        total_price: '60030',
        unit_profit: '3010',
        total_profit: '9030',
        total_tax: '6900',
        last_price: '66930',
      },
    },
    {
      name: 'Biskuit Roma Kelapa 300g',
      category: 'Makanan',
      product_id: 1,
      barcode: '8991001101234',
      quantity: 2,
      price: '12000',
      cost_price: '8500',
      discount: '0',
      tax_rate: '0.1',
      summary: {
        name: 'Biskuit Roma Kelapa 300g',
        sub_total: '24000',
        total_discount: '0',
        total_price: '24000',
        unit_profit: '3500',
        total_profit: '7000',
        total_tax: '2400',
        last_price: '26400',
      },
    },
  ],
  subtotal: '118000',
  total_discount: '10970',
  total_price: '107030',
  total_profit: '24030',
  total_tax: '11800',
  pay_return: '1170',
  pay_received: '120000',
  payment_method: EPaymentMethod.Cash,
  last_price: '118830',
  notes: '',
};

function calculateTransaction(cartState) {
  const items = cartState.items;

  let subtotal_transaction = new Big('0');
  let total_discount_transaction = new Big('0');
  let total_price_transaction = new Big('0');
  let total_profit_transaction = new Big('0');
  let total_tax_transaction = new Big('0');
  let last_price_transaction = new Big('0');

  const item_summaries = [];

  for (const unit of items) {
    const price = new Big(unit.price);
    const discount = new Big(unit.discount);
    const quantity = new Big(unit.quantity);
    const tax_rate = new Big(unit.tax_rate);
    const cost_price = new Big(unit.cost_price);

    const sub_total = price.times(quantity);
    const total_discount = price.times(discount).times(quantity);
    const total_price = sub_total.minus(total_discount);

    const discount_per_unit = price.times(discount);
    const unit_profit = price.minus(cost_price).minus(discount_per_unit);
    const total_profit = unit_profit.times(quantity);

    const total_tax = price.times(tax_rate).times(quantity);
    const last_price = total_price.plus(total_tax);

    subtotal_transaction = subtotal_transaction.plus(sub_total);
    total_discount_transaction = total_discount_transaction.plus(total_discount);
    total_price_transaction = total_price_transaction.plus(total_price);
    total_profit_transaction = total_profit_transaction.plus(total_profit);
    total_tax_transaction = total_tax_transaction.plus(total_tax);
    last_price_transaction = last_price_transaction.plus(last_price);

    const item = {
      name: unit.name,
      sub_total: sub_total.toString(),
      total_discount: total_discount.toString(),
      total_price: total_price.toString(),
      unit_profit: unit_profit.toString(),
      total_profit: total_profit.toString(),
      total_tax: total_tax.toString(),
      last_price: last_price.toString(),
    };
    item_summaries.push(item);
  }

  const item_transaction = items.map((item, i) => ({
    name: item.name,
    category: item.category,
    product_id: item.id,
    barcode: item.barcode,
    quantity: item.quantity,
    price: item.price,
    cost_price: item.cost_price,
    discount: item.discount,
    tax_rate: item.tax_rate,
    summary: item_summaries[i],
  }));

  const transaction = {
    status: EStatusTransactions.Pending,
    item: item_transaction,
    subtotal: subtotal_transaction.toString(),
    total_discount: total_discount_transaction.toString(),
    total_price: total_price_transaction.toString(),
    total_profit: total_profit_transaction.toString(),
    total_tax: total_tax_transaction.toString(),
    pay_return: cartState.pay_return,
    pay_received: cartState.pay_received,
    payment_method: cartState.payment_method,
    last_price: last_price_transaction.toString(),
    notes: cartState.notes,
  };

  return transaction;
}

const calculate = calculateTransaction(carts);
const resultsNew = JSON.stringify(calculate, null, 2);
const resultsOld = JSON.stringify(results, null, 2);
console.log('resultsNew : ', resultsNew);
console.log('resultsOld : ', resultsOld);
console.log(resultsNew === resultsOld);
