import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(protected)/pos/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(protected)/pos/"!</div>;
}
