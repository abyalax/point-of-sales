import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Form, useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { Button, TextInput, Text } from '@mantine/core';
import z from 'zod';
import { usePostLogin } from './_hooks/use-post-login';
import { useSessionStore } from '~/stores/use-session';

export const Route = createFileRoute('/(public)/auth/login')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const email = useSessionStore((s) => s.session?.user?.email);
  const { mutate: mutateLogin } = usePostLogin();

  const schema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Must be at least 6 characters'),
  });

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      email: email ?? '',
      password: '',
    } as typeof schema._type,
    validate: zodResolver(schema),
    validateInputOnBlur: true,
  });

  const handleSubmit = () =>
    form.onSubmit((values) => {
      mutateLogin(values, {
        onSuccess: () => navigate({ to: '/dashboard' }),
      });
    })();

  return (
    <Form onSubmit={handleSubmit} form={form}>
      <TextInput {...form.getInputProps('email')} mt="md" label="Email" placeholder="Email" withAsterisk type="email" />
      <TextInput {...form.getInputProps('password')} mt="md" label="Password" placeholder="Password" type="password" withAsterisk />
      <Button type="submit" fullWidth mt="md">
        Login
      </Button>
      <Text>
        Don&apos;t have an account? <Link to="/auth/register">Register</Link>
      </Text>
    </Form>
  );
}
