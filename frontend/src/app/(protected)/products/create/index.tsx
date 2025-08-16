import { Button, Container, Flex, NumberInput, Table } from '@mantine/core';
import { Select, Modal, TextInput, Group, Switch, Text } from '@mantine/core';
import { Form, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { createFileRoute } from '@tanstack/react-router';

import { zodResolver } from 'mantine-form-zod-resolver';
import { FaMinus, FaPlus } from 'react-icons/fa';
import Big from 'big.js';
import z from 'zod';

import { useGetProductCategories } from '../_hooks/use-get-categories';
import { useCreateProduct } from './_hooks/use-create-products';
import { EProductStatus } from '~/api/product/type';
import { useCreateCategory } from './_hooks/use-create-category';
import { formatCurrency } from '~/utils/format';

export const Route = createFileRoute('/(protected)/products/create/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const [opened, { open, close }] = useDisclosure(false);

  const { data: dataCategories } = useGetProductCategories();
  const { mutate: mutateCreateProduct } = useCreateProduct();
  const { mutate: mutateCreateCategory } = useCreateCategory();

  const categories = dataCategories?.map((e) => {
    return {
      label: e.name,
      value: e.name,
    };
  });

  const schema = z.object({
    name: z.string().min(3, 'Must be at least 3 characters'),
    price: z.number().min(0, 'Negative price is not allowed'),
    stock: z.number().min(0, 'Negative stock is not allowed'),
    status: z.enum([EProductStatus.AVAILABLE, EProductStatus.UNAVAILABLE]),
    category: z.string().min(3, 'Must be at least 3 characters'),
    barcode: z.string().min(3, 'Must be at least 3 characters'),
    cost_price: z.number().min(0),
    discount: z.number().min(0).max(10),
    tax_rate: z.number().min(0).max(10),
  });

  const formProduct = useForm({
    mode: 'controlled',
    initialValues: {
      name: '',
      price: '0',
      stock: 0,
      status: EProductStatus.AVAILABLE,
      category: '',
      barcode: '',
      cost_price: '0',
      discount: '0',
      tax_rate: '0',
    },
    validate: zodResolver(schema),
    validateInputOnBlur: true,
    onSubmitPreventDefault: 'always',
  });

  const formCategory = useForm({
    mode: 'controlled',
    initialValues: {
      name: '',
    },
    validate: zodResolver(z.object({ name: z.string().min(3, 'Must be at least 3 characters') })),
    validateInputOnBlur: true,
    onSubmitPreventDefault: 'always',
  });

  const submitProduct = () =>
    formProduct.onSubmit((values) => {
      mutateCreateProduct(values);
      navigate({ to: '/products' });
    })();

  const submitCategory = () =>
    formCategory.onSubmit((values) => {
      mutateCreateCategory(values);
      close();
    })();

  return (
    <Container bdrs={'md'} p={'1rem'}>
      <Modal opened={opened} onClose={close} title="New Category">
        <Form form={formCategory} onSubmit={submitCategory}>
          <TextInput
            rightSection={<FaPlus />}
            label="New Category"
            size="md"
            placeholder="Product Category"
            key={formCategory.key('name')}
            {...formCategory.getInputProps('name')}
          />
          <Button type="submit" loading={formCategory.submitting} m={'1rem 0'}>
            Add Category
          </Button>
        </Form>
      </Modal>
      <Flex justify={'space-between'} gap={'sm'}>
        <Form form={formProduct} onSubmit={submitProduct} style={{ width: '100%' }}>
          <Flex gap={'md'} direction={'column'}>
            <TextInput label="Name" placeholder="Product Name" key={formProduct.key('name')} {...formProduct.getInputProps('name')} />
            <TextInput label="Barcode" placeholder="Product Barcode" key={formProduct.key('barcode')} {...formProduct.getInputProps('barcode')} />
            <NumberInput
              label="Price"
              allowDecimal
              prefix="Rp "
              placeholder="Product Price"
              {...formProduct.getInputProps('price')}
              key={formProduct.key('price')}
            />
            <NumberInput
              label="Cost Price"
              allowDecimal
              prefix="Rp "
              placeholder="Cost Product"
              {...formProduct.getInputProps('cost_price')}
              key={formProduct.key('cost_price')}
            />
            <NumberInput
              label="Discount"
              allowDecimal
              placeholder="Discount Product"
              {...formProduct.getInputProps('discount')}
              key={formProduct.key('discount')}
            />
            <NumberInput
              label="Tax Rate"
              allowDecimal
              placeholder="Tax Rate Product"
              {...formProduct.getInputProps('tax_rate')}
              key={formProduct.key('tax_rate')}
            />
            <NumberInput label="Stock" placeholder="Product Stock" key={formProduct.key('stock')} {...formProduct.getInputProps('stock')} />
            <Group>
              <Select
                label="Category"
                key={formProduct.key('category')}
                {...formProduct.getInputProps('category')}
                placeholder="Product Category"
                data={categories}
                searchable
                nothingFoundMessage={'No Category Found'}
              />
              <Button variant="outline" size="xs" mt={'lg'} leftSection={opened ? <FaMinus /> : <FaPlus />} onClick={open}>
                Add New
              </Button>
            </Group>
            <Group>
              <Text fz={'sm'} fw={'normal'}>
                Status
              </Text>
              <Switch
                defaultChecked={true}
                checked={formProduct.values.status === EProductStatus.AVAILABLE}
                key={formProduct.key('status')}
                {...formProduct.getInputProps('status')}
              />
            </Group>
            <Button type="submit">Create</Button>
          </Flex>
        </Form>
        <Container unstyled bdrs={'md'} style={{ padding: '1rem' }}>
          <Table variant="vertical" withTableBorder w={'100%'}>
            <Table.Tbody>
              <Table.Tr>
                <Table.Th w={100}>Name</Table.Th>
                <Table.Td w={'300px'}>{formProduct.values.name}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Th w={100}>Barcode</Table.Th>
                <Table.Td w={'300px'}>{formProduct.values.barcode}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Th w={100}>Price</Table.Th>
                <Table.Td w={'300px'}>{formProduct.values.price && formatCurrency(new Big(formProduct.values.price).toString())}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Th w={100}>Cost Price</Table.Th>
                <Table.Td w={'300px'}>{formProduct.values.cost_price && formatCurrency(formProduct.values.cost_price)}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Th w={100}>Discount</Table.Th>
                <Table.Td w={'300px'}>{new Big(formProduct.values.discount).times(100).toNumber() + '%'}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Th w={100}>Tax Rate</Table.Th>
                <Table.Td w={'300px'}>{new Big(formProduct.values.tax_rate).times(100).toNumber() + '%'}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Th w={100}>Stock</Table.Th>
                <Table.Td w={'300px'}>{formProduct.values.stock}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Th w={100}>Category</Table.Th>
                <Table.Td w={'300px'}>{formProduct.values.category}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Th w={100}>Status</Table.Th>
                <Table.Td w={'300px'}>{formProduct.values.status === EProductStatus.AVAILABLE ? 'Available' : 'UnAvailable'}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Container>
      </Flex>
    </Container>
  );
}
