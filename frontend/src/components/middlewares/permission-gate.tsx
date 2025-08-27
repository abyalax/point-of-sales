import { useMemo } from 'react';
import type { ReactNode, FC, PropsWithChildren } from 'react';

import { LoadingPage } from '../ui/fallback/loading';
import { useSessionStore } from '~/stores/use-session';
import { ForbiddenPage } from '../ui/fallback/forbidden';

type TProps = PropsWithChildren<{
  permissions: Array<string>;
  fallback?: ReactNode;
}>;

export const PermissionGate: FC<TProps> = (props): ReactNode => {
  const status = useSessionStore((s) => s.session.status);
  const session = useSessionStore((s) => s.session);
  const permissions = useMemo(() => session?.user?.permissions, [session?.user?.permissions]);

  const allowed = useMemo(() => {
    return props.permissions.every((permission) => permissions?.includes(permission));
  }, [permissions, props.permissions]);

  if (status === 'authenticating') return <LoadingPage />;
  if (allowed && status === 'authenticated') return <>{props.children}</>;
  return props.fallback ? props.fallback : <ForbiddenPage />;
};
