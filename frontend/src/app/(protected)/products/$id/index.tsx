import { Container, Loader, Table } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';

import { Suspense } from 'react';
import dayjs from 'dayjs';

import useGetProduct from '../_hooks/use-get-product-by-id';
import { formatCurrency } from '~/utils/format';

export const Route = createFileRoute('/(protected)/products/$id/')({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const { data } = useGetProduct({ id: params.id });
  const product = data?.data.data;
  return (
    <Suspense fallback={<Loader />}>
      <Container bdrs={'md'} p={'md'}>
        <Table variant="vertical" layout="fixed" withTableBorder>
          <Table.Tbody>
            <Table.Tr>
              <Table.Th w={160}>Name</Table.Th>
              <Table.Td>{product?.name}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Th>Category</Table.Th>
              <Table.Td>{product?.category.name}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Th>Price</Table.Th>
              <Table.Td>{product?.price && formatCurrency(product.price)}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Th>Status</Table.Th>
              <Table.Td>{product?.status}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Th>Last updated at</Table.Th>
              <Table.Td>{dayjs(product?.created_at).format('YYYY-MM-DD HH:mm:ss')}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Container>
    </Suspense>
  );
}
