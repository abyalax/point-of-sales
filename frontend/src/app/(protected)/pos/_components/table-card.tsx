import { Button, Flex, Table } from '@mantine/core';
import { FaEraser, FaEye } from 'react-icons/fa';
import { useCartState } from '../_hooks/use-cart-state';
import { formatCurrency } from '~/utils/format';
import dayjs from 'dayjs';

export function TableCard() {
  const total_item = useCartState((s) => s.total_item);
  const subtotal = useCartState((s) => s.subtotal);
  const tax = useCartState((s) => s.tax);
  const total_discount = useCartState((s) => s.total_discount);
  const total = useCartState((s) => s.total);
  const payment_method = useCartState((s) => s.payment_method);
  const day = dayjs(new Date()).format('DD MMMM YYYY');

  return (
    <Table variant="vertical">
      <Table.Caption mt={'lg'}>
        <Flex gap={'md'} justify={'center'}>
          <Button variant="default" leftSection={<FaEye size={16} />}>
            Preview Struct
          </Button>
          <Button variant="default" leftSection={<FaEraser size={16} />}>
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
          <Table.Td>{formatCurrency(subtotal)}</Table.Td>
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
          <Table.Td>{payment_method}</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Last updated at</Table.Th>
          <Table.Td>September 26, 2024 17:41:26</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
