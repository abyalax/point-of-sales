import { Button, Flex, Table, Text } from '@mantine/core';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import styles from '../styles.module.css';

export function TableMain() {
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
          <Table.Tr>
            <Table.Td>8998765432101</Table.Td>
            <Table.Td>Aqua Botol 500ml</Table.Td>
            <Table.Td>
              <Flex align={'center'}>
                <Button variant="default" size="xs" p={'5px'}>
                  <FaPlus className={styles.icon} />
                </Button>
                <Text fz={'h3'} fw={350} size="lg" style={{ margin: '0 10px' }}>
                  2
                </Text>
                <Button variant="default" size="xs" p={'5px'}>
                  <FaMinus className={styles.icon} />
                </Button>
              </Flex>
            </Table.Td>
            <Table.Td>1000</Table.Td>
            <Table.Td>0</Table.Td>
            <Table.Td>1000</Table.Td>
            <Table.Td>
              <Button size="xs" variant="default">
                <FaTrash />
              </Button>
            </Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>8998765432101</Table.Td>
            <Table.Td>NIVEA MEN Extra Bright 50ml</Table.Td>
            <Table.Td>
              <Flex align={'center'}>
                <Button variant="default" size="xs" p={'5px'}>
                  <FaPlus className={styles.icon} />
                </Button>
                <Text fz={'h3'} fw={350} size="lg" style={{ margin: '0 10px' }}>
                  2
                </Text>
                <Button variant="default" size="xs" p={'5px'}>
                  <FaMinus className={styles.icon} />
                </Button>
              </Flex>
            </Table.Td>
            <Table.Td>1000</Table.Td>
            <Table.Td>0</Table.Td>
            <Table.Td>1000</Table.Td>
            <Table.Td>
              <Button size="xs" variant="default">
                <FaTrash />
              </Button>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
