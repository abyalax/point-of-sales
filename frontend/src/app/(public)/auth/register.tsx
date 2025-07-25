import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import z from 'zod';
import { zodResolver } from 'mantine-form-zod-resolver';
import { Form, useForm } from '@mantine/form';
import { Button, Checkbox, Text, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';

export const Route = createFileRoute('/(public)/auth/register')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const schema = z.object({
    name: z.string().min(3, 'Must be at least 3 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Must be at least 6 characters'),
    termsOfService: z.boolean().refine(value => value, {
      message: 'You must agree to sell your privacy',
    }),
  });

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      name: '',
      email: '',
      password: '',
      termsOfService: false,
    } as typeof schema._type,
    validate: zodResolver(schema),
    validateInputOnBlur: true,
  });

  const handleSubmit = () =>
    form.onSubmit(values => {
      notifications.show({
        title: 'Success',
        message: 'You have successfully registered',
      });
      console.log(values);
      navigate({ to: '/auth/login' });
    })();

  return (
    <Form onSubmit={handleSubmit} form={form}>
      <TextInput {...form.getInputProps('name')} label="Name" placeholder="Name" withAsterisk />
      <TextInput {...form.getInputProps('email')} mt="md" label="Email" placeholder="Email" withAsterisk />
      <TextInput {...form.getInputProps('password')} mt="md" label="Password" placeholder="Password" type="password" withAsterisk />
      <Checkbox {...form.getInputProps('termsOfService')} mt="md" label="I agree to sell my privacy" />
      <Button type="submit" fullWidth mt="md">
        Register
      </Button>
      <Text>
        Already have an account? <Link to="/auth/login">Login</Link>
      </Text>
    </Form>
  );
}
