import { Container, Title, Text, Group, Button } from '@mantine/core';
import { FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

interface ErrorFallbackProps {
  error: Error;
  reset?: () => void;
}

export const ErrorPage = ({ error, reset }: ErrorFallbackProps) => {
  const getErrorTitle = (error: Error) => {
    if (error.name === 'ChunkLoadError') {
      return 'Failed to load application';
    }
    if (error.name === 'NetworkError') {
      return 'Network connection error';
    }
    if (error.message?.includes('404')) {
      return 'Page not found';
    }
    return 'Something went wrong';
  };

  const getErrorDescription = (error: Error) => {
    if (error.name === 'ChunkLoadError') {
      return 'There was a problem loading the application. Please refresh the page.';
    }
    if (error.name === 'NetworkError') {
      return 'Please check your internet connection and try again.';
    }
    if (error.message?.includes('404')) {
      return "The page you are looking for doesn't exist or has been moved.";
    }
    return 'An unexpected error occurred. Our team has been notified.';
  };

  const handleRefresh = () => window.location.reload();

  return (
    <Container size="md" py={80} style={{ textAlign: 'center' }}>
      <FaExclamationTriangle size={64} style={{ color: 'var(--mantine-color-red-6)', marginBottom: '1rem' }} />

      <Title order={1} size="h1" fw={900} mb="md">
        {getErrorTitle(error)}
      </Title>

      <Text size="lg" c="dimmed" mb="xl">
        {getErrorDescription(error)}
      </Text>

      <Group justify="center" gap="md">
        <Button onClick={() => window.history.back()} size="md" variant="light" leftSection={<FaArrowLeft size={16} />}>
          Go Back
        </Button>

        <Button onClick={() => (window.location.href = '/')} size="md" variant="filled">
          Go Home
        </Button>

        {reset && (
          <Button onClick={reset} size="md" variant="outline">
            Try Again
          </Button>
        )}

        <Button onClick={handleRefresh} size="md" variant="subtle">
          Refresh Page
        </Button>
      </Group>
    </Container>
  );
};
