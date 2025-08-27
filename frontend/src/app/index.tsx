import { Button, Container, Text } from '@mantine/core';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useSessionStore } from '~/stores/use-session';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const status = useSessionStore((s) => s.session.status);
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
      <Button variant="filled" component={Link} to={status === 'authenticated' ? '/sales/pos' : '/auth/login'} mt="md">
        Get Started
      </Button>
    </Container>
  );
}
