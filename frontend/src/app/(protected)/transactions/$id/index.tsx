import { Container, Loader, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Text } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';

import { Suspense } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { formatCurrency } from '~/utils/format';
import { useGetTransaction } from '../_hooks/use-get-transaction-by-id';

export const Route = createFileRoute('/(protected)/transactions/$id/')({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const { data: transaction } = useGetTransaction({ id: params.id });
  console.log(transaction?.items);

  dayjs.extend(relativeTime);

  return (
    <Suspense fallback={<Loader />}>
      <Container bdrs={'md'} p={'md'}>
        <Table variant="vertical" layout="fixed" withTableBorder withRowBorders={false} withColumnBorders>
          <Table.Tbody>
            <Table.Tr>
              <Table.Th w={160}>Cashier</Table.Th>
              <Table.Td>{transaction?.cashier}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Th>Total Profit</Table.Th>
              <Table.Td>{formatCurrency(transaction?.total_profit ?? '')}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Th>Total Discount</Table.Th>
              <Table.Td>{formatCurrency(transaction?.total_discount ?? '')}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Th>Total Tax</Table.Th>
              <Table.Td>{formatCurrency(transaction?.total_tax ?? '')}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Th>Created</Table.Th>
              <Table.Td>{dayjs(transaction?.updated_at).fromNow()}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>

        <Text m={'md'} fz={'xl'}>
          Items
        </Text>

        <Table highlightOnHover withTableBorder withRowBorders>
          <TableThead>
            <TableTr>
              <TableTh>Barcode</TableTh>
              <TableTh>Name</TableTh>
              <TableTh>Price</TableTh>
              <TableTh>Cost Price</TableTh>
              <TableTh>Sell Price</TableTh>
              <TableTh>Final Price</TableTh>
              <TableTh>Tax Rate</TableTh>
              <TableTh>Discount</TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>
            {transaction?.items.map((item, index) => (
              <TableTr key={index}>
                <TableTd>{item.barcode}</TableTd>
                <TableTd>{item.name}</TableTd>
                <TableTd>{formatCurrency(item.price)}</TableTd>
                <TableTd>{formatCurrency(item.cost_price)}</TableTd>
                <TableTd>{formatCurrency(item.sell_price)}</TableTd>
                <TableTd>{formatCurrency(item.final_price)}</TableTd>
                <TableTd>{item.tax_rate} Rate</TableTd>
                <TableTd>{item.discount}</TableTd>
              </TableTr>
            ))}
          </TableTbody>
        </Table>
      </Container>
    </Suspense>
  );
}
