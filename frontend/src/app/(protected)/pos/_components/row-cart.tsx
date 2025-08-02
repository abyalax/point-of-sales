import { notifications } from '@mantine/notifications';
import { Button, Flex, Input, Table } from '@mantine/core';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { useEffect, useState } from 'react';

import { formatCurrency } from '~/utils/format';
import { useCartStore } from '../_hooks/use-cart-store';
import styles from '../styles.module.css';
import Big from 'big.js';

import type { ChangeEvent, FocusEvent } from 'react';
import type { ICartItem } from '../_types';

export function RowCart({ cart }: { cart: ICartItem }) {
  const [inputValue, setInputValue] = useState<number>(cart.quantity);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  useEffect(() => {
    setInputValue(cart.quantity);
  }, [cart.quantity]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setInputValue(parseInt(value));
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newQty = parseInt(value);

    if (value === '' || isNaN(newQty) || newQty < 1) {
      const fallbackValue = cart.quantity > 1 ? cart.quantity : 1;
      setInputValue(fallbackValue);
      updateQuantity(cart.id, fallbackValue);
      notifications.show({
        color: 'red',
        title: 'Uppss',
        message: 'Jumlah tidak boleh kosong atau kurang dari 1',
        position: 'top-center',
      });
    } else {
      updateQuantity(cart.id, newQty);
    }
  };

  const subtotal = new Big(cart.price).times(cart.quantity).toString();

  return (
    <Table.Tr key={cart.id}>
      <Table.Td>{cart.barcode}</Table.Td>
      <Table.Td>{cart.name}</Table.Td>
      <Table.Td>
        <Flex align={'center'}>
          <Button variant="default" size="xs" p={'5px'} onClick={() => updateQuantity(cart.id, cart.quantity + 1)}>
            <FaPlus className={styles.icon} />
          </Button>
          <Input
            fw={600}
            size="lg"
            type="number"
            variant="unstyled"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{
              width: '20px',
              margin: '0 10px',
            }}
          />
          <Button
            variant="default"
            size="xs"
            p={'5px'}
            onClick={() => {
              if (cart.quantity > 1) updateQuantity(cart.id, cart.quantity - 1);
              else removeItem(cart.id);
            }}
          >
            <FaMinus className={styles.icon} />
          </Button>
        </Flex>
      </Table.Td>
      <Table.Td>{formatCurrency(cart.price)}</Table.Td>
      <Table.Td>{parseFloat(cart.discount) * 100} %</Table.Td>
      <Table.Td>{formatCurrency(subtotal)}</Table.Td>
      <Table.Td>
        <Button size="xs" variant="default" onClick={() => removeItem(cart.id)}>
          <FaTrash />
        </Button>
      </Table.Td>
    </Table.Tr>
  );
}
