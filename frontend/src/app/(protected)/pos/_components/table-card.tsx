import { Button, Flex, Table } from '@mantine/core';
import { FaEraser, FaEye } from 'react-icons/fa';

export function TableCard() {
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
          <Table.Th w={160}>Epic name</Table.Th>
          <Table.Td>7.x migration</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Status</Table.Th>
          <Table.Td>Open</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Total issues</Table.Th>
          <Table.Td>135</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Total story points</Table.Th>
          <Table.Td>874</Table.Td>
        </Table.Tr>

        <Table.Tr>
          <Table.Th>Last updated at</Table.Th>
          <Table.Td>September 26, 2024 17:41:26</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
