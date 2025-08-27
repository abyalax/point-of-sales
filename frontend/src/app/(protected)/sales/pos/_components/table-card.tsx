import { Button, Flex, Table } from '@mantine/core';

import { useCartState } from '../_hooks/use-cart-state';
import { useCartStore } from '../_hooks/use-cart-store';
import { useSessionStore } from '~/stores/use-session';
import { FaEraser, FaEye } from 'react-icons/fa';
import { formatCurrency } from '~/utils/format';
import { toTitleCase } from '~/utils';

import dayjs from 'dayjs';

export function TableCard() {
  const day = dayjs(new Date()).format('DD MMMM YYYY');
  const total_item = useCartState((s) => s.total_item);
  const sub_total = useCartState((s) => s.sub_total);
  const tax = useCartState((s) => s.tax);
  const total_discount = useCartState((s) => s.total_discount);
  const total = useCartState((s) => s.total);
  const payment_method = useCartState((s) => s.payment_method);
  const carts = useCartState((s) => s);
  const printStruct = useCartStore((s) => s.printStruct);
  const clearCart = useCartStore((s) => s.clearCart);
  const cashier = useSessionStore((s) => s.session.user?.name);
  const isEmptyCart = useCartStore((s) => s.isEmptyCart);

  return (
    <Table variant="vertical">
      <Table.Caption mt={'lg'}>
        <Flex gap={'md'} justify={'center'}>
          <Button variant="default" disabled={isEmptyCart()} onClick={() => printStruct(carts, cashier)} leftSection={<FaEye size={16} />}>
            Preview Struct
          </Button>
          <Button variant="default" disabled={isEmptyCart()} onClick={() => clearCart()} leftSection={<FaEraser size={16} />}>
            Reset
          </Button>
        </Flex>
      </Table.Caption>
      <Table.Tbody>
        <Table.Tr>
          <Table.Th w={160}>Tanggal</Table.Th>
          <Table.Td>{day}</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Total Item</Table.Th>
          <Table.Td>{total_item}</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Subtotal Price</Table.Th>
          <Table.Td>{formatCurrency(sub_total)}</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Total Tax Product</Table.Th>
          <Table.Td>{formatCurrency(tax)}</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Total Discount</Table.Th>
          <Table.Td>{formatCurrency(total_discount)}</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Total Price</Table.Th>
          <Table.Td>{formatCurrency(total)}</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Payment Method</Table.Th>
          <Table.Td>{toTitleCase(payment_method)}</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Last updated at</Table.Th>
          <Table.Td>September 26, 2024 17:41:26</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
