import { Role } from '~/modules/auth/entity/role.entity';

export const mockRoles: Role[] = [
  { id: 1, name: 'Admin', users: [], permissions: [] },
  { id: 2, name: 'Editor', users: [], permissions: [] },
  { id: 3, name: 'Viewer', users: [], permissions: [] },
];
