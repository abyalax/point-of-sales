import { Container, Title, Text, Button, Group } from '@mantine/core';
import { FaArrowLeft } from 'react-icons/fa';

export const NotFoundPage = () => {
  return (
    <Container size="md" py={80} style={{ textAlign: 'center' }}>
      <Title order={1} size="h1" fw={900} mb="md">
        404 - Page Not Found
      </Title>
      <Text size="lg" c="dimmed" mb="xl">
        The page you are looking for doesn't exist or has been moved.
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
