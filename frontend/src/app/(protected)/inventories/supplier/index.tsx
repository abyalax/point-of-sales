import { createFileRoute } from '@tanstack/react-router';
import { useGetSuppliers } from './_hooks/use-get-supplier';

export const Route = createFileRoute('/(protected)/inventories/supplier/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useGetSuppliers();
  return (
    <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}
