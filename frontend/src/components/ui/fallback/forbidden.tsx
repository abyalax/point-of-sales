import { Container, Title, Text, Button, Group } from '@mantine/core';
import { FaArrowLeft } from 'react-icons/fa';

export const ForbiddenPage = () => {
  return (
    <Container size="md" py={80} style={{ textAlign: 'center' }}>
      <Title order={1} size="h1" fw={900} mb="md">
        403 - Forbidden
      </Title>
      <Text size="lg" c="dimmed" mb="xl">
        You do not have permission to access this page.
      </Text>
      <Group justify="center" gap="md">
        <Button onClick={() => window.history.back()} size="md" variant="light" leftSection={<FaArrowLeft size={16} />}>
          Go Back
        </Button>

        <Button onClick={() => (window.location.href = '/')} size="md" variant="filled">
          Go Home
        </Button>

        <Button onClick={() => window.location.reload()} size="md" variant="subtle">
          Refresh Page
        </Button>
      </Group>
    </Container>
  );
};
