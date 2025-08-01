import { Button, Flex, Table, Text } from '@mantine/core';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import styles from '../styles.module.css';
import type { ICartItem } from '../_types';
import { useCartStore } from '../_hooks/use-cart-store';

export function TableMain({ carts }: { carts: ICartItem[] }) {
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <Table.ScrollContainer minWidth={'100%'} maxHeight={'60vh'}>
      <Table highlightOnHover striped style={{ width: '100%' }}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Barcode</Table.Th>
            <Table.Th>Product</Table.Th>
            <Table.Th>Quantity</Table.Th>
            <Table.Th>Unit Price</Table.Th>
            <Table.Th>Discount</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Delete</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {carts.map((cart) => (
            <Table.Tr key={cart.id}>
              <Table.Td>{cart.barcode}</Table.Td>
              <Table.Td>{cart.name}</Table.Td>
              <Table.Td>
                <Flex align={'center'}>
                  <Button variant="default" size="xs" p={'5px'}>
                    <FaPlus className={styles.icon} />
                  </Button>
                  <Text fz={'h3'} fw={350} size="lg" style={{ margin: '0 10px' }}>
                    {cart.quantity}
                  </Text>
                  <Button variant="default" size="xs" p={'5px'}>
                    <FaMinus className={styles.icon} />
                  </Button>
                </Flex>
              </Table.Td>
              <Table.Td>{cart.price}</Table.Td>
              <Table.Td>{cart.discount}</Table.Td>
              <Table.Td>{cart.price * cart.quantity}</Table.Td>
              <Table.Td>
                <Button size="xs" variant="default" onClick={() => removeItem(cart.id)}>
                  <FaTrash />
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
