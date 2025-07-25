import { Box } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';
import { getColors } from '~/components/themes';

export const Route = createFileRoute('/(protected)/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Box style={{ backgroundColor: getColors('primary') }} h={'20vh'} p={'lg'}>
      <div>Hello from dashboard</div>
    </Box>
  );
}
