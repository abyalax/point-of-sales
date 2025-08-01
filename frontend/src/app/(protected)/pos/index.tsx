import { Autocomplete, Button, Flex, Text, Input, InputWrapper, Textarea, Grid, Modal, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { createFileRoute } from '@tanstack/react-router';
import { IconCommand } from '@tabler/icons-react';

import { FaExternalLinkAlt, FaPlus, FaPrint, FaSave, FaSearch } from 'react-icons/fa';

import { Container } from '~/components/ui/container/container';

import { useGetProducts } from './_hooks/use-get-products';
import { TableMain } from './_components/table-main';
import { TableCard } from './_components/table-card';
import { useCartStore } from './_hooks/use-cart-store';

export const Route = createFileRoute('/(protected)/pos/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useGetProducts();
  const [opened, { open, close }] = useDisclosure(false);
  const carts = useCartStore((s) => s.getCart().items);
  const addItem = useCartStore((s) => s.addItem);
  const products = data?.data.data;

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 12, lg: 9 }}>
        <Container unstyled p={'md'}>
          <Flex justify="space-between" align="center" mb="md">
            <Autocomplete
              data={products?.map((product) => product.name)}
              style={{ minWidth: '300px' }}
              leftSection={<FaSearch />}
              rightSection={<FaPlus onClick={() => notifications.show({ title: 'Success', message: 'Successfully add product' })} />}
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
              <Table.ScrollContainer minWidth={'100%'} maxHeight={'60vh'}>
                <Table striped stickyHeader highlightOnHover stickyHeaderOffset={-10}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th style={{ fontSize: '1rem' }}>Barcode</Table.Th>
                      <Table.Th style={{ fontSize: '1rem' }}>Name</Table.Th>
                      <Table.Th style={{ fontSize: '1rem' }}>Action</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {products?.map((product) => (
                      <Table.Tr key={product.id}>
                        <Table.Td>{product.barcode}</Table.Td>
                        <Table.Td>{product.name}</Table.Td>
                        <Table.Td>
                          <Button
                            size="xs"
                            onClick={() =>
                              addItem({
                                id: product.id,
                                name: product.name,
                                price: parseInt(product.price),
                                quantity: 1,
                                barcode: product.barcode,
                                category: product.category.name,
                                cost_price: parseInt(product.cost_price),
                                tax_rate: parseFloat(product.tax_rate),
                                discount: parseFloat(product.discount),
                              })
                            }
                          >
                            <FaPlus size={15} />
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Modal>

            <Button variant="default" onClick={open} rightSection={<FaExternalLinkAlt />}>
              Select
            </Button>
          </Flex>
          <Container style={{ overflow: 'auto', maxHeight: '65vh', minWidth: '100%' }}>
            <TableMain carts={carts} />
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
            <Flex w={'100%'} justify={'start'} direction={'column'} gap={'md'}>
              <InputWrapper style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', gap: '10px' }}>
                <label htmlFor="bayar">Bayar</label>
                <Input placeholder="Jumlah Pembayaran" name="bayar" />
              </InputWrapper>
              <InputWrapper style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', gap: '10px' }}>
                <label htmlFor="kembalian">Kembali</label>
                <Input placeholder="Kembalian" disabled name="kembalian" />
              </InputWrapper>
              <Flex gap={'lg'} mt={'lg'} justify={'end'}>
                <Button variant="default" leftSection={<FaPrint />}>
                  Cetak
                </Button>
                <Button variant="default" leftSection={<FaSave />}>
                  Simpan
                </Button>
              </Flex>
            </Flex>
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
