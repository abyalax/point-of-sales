import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/(public)/auth')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Outlet />
    </div>
  );
}
