import { Permission } from '~/modules/auth/entity/permission.entity';
import { Role } from '~/modules/auth/entity/role.entity';
import { User } from '~/modules/user/entity/user.entity';
import type { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

const mockPermissions: Permission[] = [
  { id: 1, key: 'product:create', name: 'Create Product', roles: [] },
  { id: 2, key: 'product:read', name: 'Read Product', roles: [] },
  { id: 3, key: 'product:update', name: 'Update Product', roles: [] },
  { id: 4, key: 'product:delete', name: 'Delete Product', roles: [] },

  { id: 5, key: 'transaction:create', name: 'Create Transaction', roles: [] },
  { id: 6, key: 'transaction:read', name: 'Read Transaction', roles: [] },
  { id: 7, key: 'transaction:update', name: 'Update Transaction', roles: [] },
  { id: 8, key: 'transaction:delete', name: 'Delete Transaction', roles: [] },
];

const mockRoles: Role[] = [
  { id: 1, name: 'Admin', users: [], permissions: [] },
  { id: 2, name: 'Cashier', users: [], permissions: [] },
  { id: 3, name: 'Karyawan', users: [], permissions: [] },
];

const mockRolePermissions = [
  /**
   * Admin (1)
    1  => product:create     ✅
    2  => product:read       ✅
    3  => product:update     ✅
    4  => product:delete     ✅
   */
  { id_role: 1, id_permission: 1 },
  { id_role: 1, id_permission: 2 },
  { id_role: 1, id_permission: 3 },
  { id_role: 1, id_permission: 4 },

  /**
   * Kasir (2)
    1  => product:create    ✅
    2  => product:read      ✅
    3  => product:update    ✅
    4  => product:delete
   */
  { id_role: 2, id_permission: 1 },
  { id_role: 2, id_permission: 2 },
  { id_role: 2, id_permission: 3 },

  /**
   * Karyawan (3)
    1  => product:create
    2  => product:read
    3  => product:update
    4  => product:delete
   */
  { id_role: 3, id_permission: 2 },
  /**
   * Admin (1)
    5  => transaction:create  ✅
    6  => transaction:read    ✅
    7  => transaction:update
    8  => transaction:delete
   */
  { id_role: 1, id_permission: 5 },
  { id_role: 1, id_permission: 6 },

  /**
   * Kasir (2)
    5  => transaction:create  ✅
    6  => transaction:read    ✅
    7  => transaction:update
    8  => transaction:delete
   */
  { id_role: 2, id_permission: 5 },
  { id_role: 2, id_permission: 6 },

  /**
   * Karyawan (3)
    5  => transaction:create
    6  => transaction:read    ✅
    7  => transaction:update
    8  => transaction:delete
   */
  { id_role: 3, id_permission: 6 },
];

const mockUser = async (): Promise<User[]> => {
  const plaintextPassword = 'password';
  const passwordHashed = await bcrypt.hash(plaintextPassword, 10);

  const admin: User = {
    id: 1,
    name: 'Abya Admin',
    email: 'abyaadmin@gmail.com',
    password: passwordHashed,
    roles: [],
    transactions: [],
  };
  const cashier: User = {
    id: 2,
    name: 'Abya Kasir',
    email: 'abyakasir@gmail.com',
    password: passwordHashed,
    roles: [],
    transactions: [],
  };
  const karyawan: User = {
    id: 3,
    name: 'Abya Karyawan',
    email: 'abyakaryawan@gmail.com',
    password: passwordHashed,
    roles: [],
    transactions: [],
  };

  return [admin, cashier, karyawan];
};

const mockUserRoles = [
  { id_user: 1, id_role: 1 }, // Admin
  { id_user: 2, id_role: 2 }, // Cashier
  { id_user: 3, id_role: 3 }, // Karyawan
];

export default class UserSeeder implements Seeder {
  track = true;
  public async run(dataSource: DataSource): Promise<void> {
    const userRepo = dataSource.getRepository(User);
    const roleRepo = dataSource.getRepository(Role);
    const permRepo = dataSource.getRepository(Permission);

    const dataUser = await mockUser();

    await userRepo.insert(dataUser);
    console.log('✅ Seed users successfully');

    await roleRepo.insert(mockRoles);
    console.log('✅ Seed roles successfully');

    await permRepo.insert(mockPermissions);
    console.log('✅ Seed permissions successfully');

    for (const { id_role, id_permission } of mockRolePermissions) {
      await dataSource.query('INSERT INTO role_permissions (id_role, id_permission) VALUES (?, ?)', [id_role, id_permission]);
    }
    console.log('✅ Seed role_permissions successfully');

    for (const { id_user, id_role } of mockUserRoles) {
      await dataSource.query('INSERT INTO user_roles (id_user, id_role) VALUES (?, ?)', [id_user, id_role]);
    }
    console.log('✅ Seed user_roles successfully');
  }
}
