import { Button, Container, Flex, NumberInput, Table } from '@mantine/core';
import { Select, Modal, TextInput, Group, Switch, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { createFileRoute } from '@tanstack/react-router';

import { zodResolver } from 'mantine-form-zod-resolver';
import { FaMinus, FaPlus } from 'react-icons/fa';
import z from 'zod';

import useGetProductCategories from '../_hooks/use-get-categories';
import { useCreateProduct } from './_hooks/use-create-products';
import { EProductStatus } from '~/api/product/type';
import { useCreateCategory } from './_hooks/use-create-category';
import { formatCurrency } from '~/utils/format';

export const Route = createFileRoute('/(protected)/products/create/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: dataCategories } = useGetProductCategories();
  const [opened, { open, close }] = useDisclosure(false);

  const categories = dataCategories?.data.data?.map(e => {
    return {
      label: e.name,
      value: e.id.toString(),
    };
  });

  const navigate = Route.useNavigate();
  const { mutate: mutateCreateProduct } = useCreateProduct();
  const { mutate: mutateCreateCategory } = useCreateCategory();

  const schema = z.object({
    name: z.string().min(3, 'Must be at least 3 characters'),
    price: z.string().min(0, 'Negative price is not allowed'),
    stock: z.number().min(0, 'Negative stock is not allowed'),
    status: z.enum([EProductStatus.AVAILABLE, EProductStatus.UNAVAILABLE]),
    category: z.string().min(3, 'Must be at least 3 characters'),
  });

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      name: '',
      price: '0',
      stock: 0,
      status: EProductStatus.AVAILABLE,
      category: '',
    },
    validate: zodResolver(schema),
    validateInputOnBlur: true,
  });

  const formCategory = useForm({
    mode: 'controlled',
    initialValues: {
      name: '',
    },
    validate: zodResolver(z.object({ name: z.string().min(3, 'Must be at least 3 characters') })),
    validateInputOnBlur: true,
  });

  const handleSubmit = form.onSubmit(values => {
    console.log(values);
    mutateCreateProduct(values);
    navigate({ to: '/products' });
  });

  const handleSubmitCategory = formCategory.onSubmit(values => {
    mutateCreateCategory(values);
    close();
  });

  return (
    <Container bdrs={'md'} p={'1rem'}>
      <Modal opened={opened} onClose={close} title="New Category">
        <form onSubmit={handleSubmitCategory}>
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
        </form>
      </Modal>
      <Flex justify={'space-between'} gap={'sm'}>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Flex gap={'md'} direction={'column'}>
            <TextInput label="Name" placeholder="Product Name" key={form.key('name')} {...form.getInputProps('name')} />
            <NumberInput
              label="Price"
              allowDecimal={true}
              prefix="Rp "
              placeholder="Product Price"
              value={form.values.price}
              onChange={value => form.setFieldValue('price', value.toString())}
              key={form.key('price')}
            />
            <NumberInput label="Stock" placeholder="Product Stock" key={form.key('stock')} {...form.getInputProps('stock')} />
            <Group>
              <Select
                label="Category"
                value={form.values.category}
                onChange={form.getInputProps('category').onChange}
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
                checked={form.values.status === EProductStatus.AVAILABLE}
                onChange={e => form.setFieldValue('status', e.target.checked ? EProductStatus.AVAILABLE : EProductStatus.UNAVAILABLE)}
              />
            </Group>
            <Button fullWidth m={'1rem 0'} type="submit" loading={form.submitting}>
              Create
            </Button>
          </Flex>
        </form>
        <Container unstyled bdrs={'md'} style={{ padding: '1rem' }}>
          <Table variant="vertical" withTableBorder w={'100%'}>
            <Table.Tbody>
              <Table.Tr>
                <Table.Th w={80}>Name</Table.Th>
                <Table.Td w={'300px'}>{form.values.name}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Th w={80}>Price</Table.Th>
                <Table.Td w={'300px'}>{form.values.price && formatCurrency(form.values.price)}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Th w={80}>Stock</Table.Th>
                <Table.Td w={'300px'}>{form.values.stock}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Th w={80}>Category</Table.Th>
                <Table.Td w={'300px'}>{categories?.find(e => e.value === form.values.category)?.label}</Table.Td>
              </Table.Tr>

              <Table.Tr>
                <Table.Th w={80}>Status</Table.Th>
                <Table.Td w={'300px'}>{form.values.status === EProductStatus.AVAILABLE ? 'Available' : 'UnAvailable'}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Container>
      </Flex>
    </Container>
  );
}
