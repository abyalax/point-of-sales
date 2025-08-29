import { createFileRoute } from '@tanstack/react-router';
import { useGetPurchases } from './_hooks/use-get-purchases';

export const Route = createFileRoute('/(protected)/inventories/purchase/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useGetPurchases();
  return (
    <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}
