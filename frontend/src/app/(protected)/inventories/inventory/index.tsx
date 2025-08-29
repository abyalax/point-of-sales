import { createFileRoute } from '@tanstack/react-router';
import { useGetInventories } from './_hooks/use-get-inventories';

export const Route = createFileRoute('/(protected)/inventories/inventory/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useGetInventories();
  return (
    <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}
