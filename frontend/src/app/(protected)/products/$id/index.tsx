import { Button, Container, Loader, Table } from '@mantine/core';
import { createFileRoute, Link } from '@tanstack/react-router';

import { Suspense } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useGetProduct } from '~/app/(protected)/products/_hooks/use-get-product-by-id';
import { formatCurrency } from '~/utils/format';
import { FaPencilAlt } from 'react-icons/fa';
import { EProductStatus } from '~/modules/product/product.schema';

export const Route = createFileRoute('/(protected)/products/$id/')({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  const { data: product } = useGetProduct({ id: params.id });
  dayjs.extend(relativeTime);
  return (
    <Suspense fallback={<Loader />}>
      <Container bdrs={'md'} p={'md'}>
        <Link to="/products/$id/update" params={params}>
          <Button mb={'sm'} leftSection={<FaPencilAlt />}>
            Update
          </Button>
        </Link>
        <Table variant="vertical" layout="fixed" withTableBorder>
          <Table.Tbody>
            <Table.Tr>
              <Table.Th w={160}>Name</Table.Th>
              <Table.Td>{product?.name}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Th>Category</Table.Th>
              <Table.Td>{product?.category?.name ?? '-'}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Th>Price</Table.Th>
              <Table.Td>{product?.price && formatCurrency(product.price)}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Th>Stock</Table.Th>
              <Table.Td>{product?.stock}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Th>Status</Table.Th>
              <Table.Td>{product?.status === EProductStatus.AVAILABLE ? 'Available' : 'Not Available'}</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Th>Last Updated</Table.Th>
              <Table.Td>{dayjs().to(dayjs(product?.updated_at))}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Container>
    </Suspense>
  );
}
