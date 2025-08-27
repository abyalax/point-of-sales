import { Autocomplete, Button, Flex, Text, Textarea, Grid, Modal, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { createFileRoute } from '@tanstack/react-router';
import { IconCommand } from '@tabler/icons-react';

import { FaExternalLinkAlt, FaPlus, FaSearch } from 'react-icons/fa';

import { queryProductsSchema, type Product } from '~/modules/product/product.schema';
import { Container } from '~/components/ui/container/container';

import { useInfiniteProducts } from './_hooks/use-infinite-products';
import { useCartState } from './_hooks/use-cart-state';
import { usePOSSearch } from './_hooks/use-pos-search';
import { useCartStore } from './_hooks/use-cart-store';
import { TableModal } from './_components/table-modal';
import { TableCard } from './_components/table-card';
import { InputPay } from './_components/input-pay';
import { RowCart } from './_components/row-cart';
import { useMemo, useState } from 'react';

export const Route = createFileRoute('/(protected)/sales/pos/')({
  component: RouteComponent,
  validateSearch: queryProductsSchema,
});

function RouteComponent() {
  const search = Route.useSearch();
  const {
    data: dataProducts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts({
    ...search,
    sort_by: search.sort_by as keyof Partial<Product>,
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = Route.useNavigate();

  const { data } = usePOSSearch(searchQuery);
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartState((s) => s.items);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const products = useMemo<Product[]>(() => {
    return dataProducts?.pages?.flatMap((page) => (page?.data ?? []).filter((e): e is Product => e !== undefined)) ?? [];
  }, [dataProducts?.pages]);

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 12, lg: 9 }}>
        <Container unstyled p={'md'}>
          <Flex justify="space-between" align="center" mb="md">
            <Autocomplete
              data={data.map((product) => product.name)}
              style={{ minWidth: '300px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e)}
              clearable
              leftSection={<FaSearch />}
              rightSection={
                <FaPlus
                  onClick={() => {
                    const findProduct = data?.find((product) => product.name === searchQuery);
                    if (findProduct) {
                      addItem({
                        quantity: 1,
                        barcode: findProduct.barcode,
                        category: findProduct.category.name,
                        discount: findProduct.discount,
                        cost_price: findProduct.cost_price,
                        name: findProduct.name,
                        price: findProduct.price,
                        id: findProduct.id,
                        tax_rate: findProduct.tax_rate,
                      });
                      navigate({
                        search: (prev) => ({
                          ...prev,
                          search: '',
                        }),
                      });
                    }
                  }}
                />
              }
              placeholder="Search..."
            />
            <Modal
              opened={opened}
              onClose={close}
              title={
                <Text fz={'h4'} fw={400}>
                  List Products
                </Text>
              }
              centered
              size={'auto'}
            >
              <TableModal products={products} handleLoadMore={handleLoadMore} />
            </Modal>
            <Button variant="default" onClick={open} rightSection={<FaExternalLinkAlt />}>
              Select
            </Button>
          </Flex>
          <Container style={{ overflow: 'auto', maxHeight: '65vh', minWidth: '100%' }}>
            <Table.ScrollContainer minWidth={'100%'} maxHeight={'45vh'}>
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
                  {items.map((cart) => (
                    <RowCart cart={cart} key={cart.id} />
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Container>
          <Flex justify={'space-between'} w={'100%'} align={'end'} mt={'lg'}>
            <Flex w={'100%'} direction={'column'}>
              <Textarea minRows={2} w={'100%'} maxRows={4} autosize placeholder="Anything about the order" description="Note Transaction" />
              <Text m={'20px 0'} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <IconCommand />
                Shortcut Keyboard
              </Text>
              <Flex gap={'lg'}>
                <Flex direction={'column'}>
                  <Text size="sm">F7 = Tambah Baris Baru</Text>
                  <Text size="sm">F8 = Fokus ke field bayar</Text>
                </Flex>
                <Flex direction={'column'}>
                  <Text size="sm">F9 = Cetak Struct</Text>
                  <Text size="sm">F10 = Simpan Transaksi</Text>
                </Flex>
              </Flex>
            </Flex>
            <InputPay />
          </Flex>
        </Container>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 12, lg: 3 }}>
        <Container unstyled p={'md'}>
          <TableCard />
        </Container>
      </Grid.Col>
    </Grid>
  );
}
