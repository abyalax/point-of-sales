import { Button, Container, Text } from '@mantine/core';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <Container
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
      }}
    >
      <Text fz={'h1'} fw={'bold'}>
        Welcome Home!
      </Text>
      <Button variant="filled" component={Link} to="/auth/login" mt="md">
        Get Started
      </Button>
    </Container>
  );
}
