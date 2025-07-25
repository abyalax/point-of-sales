//* It Does Not Support Path Alias Shorthand */
import type { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../../modules/user/user.entity';
import { mockUser } from '../mock/user.mock';
import { Role } from '../../../modules/auth/entity/role.entity';
import { Permission } from '../../../modules/auth/entity/permission.entity';
import { mockRoles } from '../mock/role.mock';
import { mockPermissions } from '../mock/permission.mock';
import { mockRolePermissions } from '../mock/role-permission.mock';
import { mockUserRoles } from '../mock/user-role.mock';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepo = dataSource.getRepository(User);
    const roleRepo = dataSource.getRepository(Role);
    const permRepo = dataSource.getRepository(Permission);

    const dataUser = await mockUser();

    await userRepo.insert(dataUser);
    console.log('✅ User Seeded Successfully');

    await roleRepo.insert(mockRoles);
    console.log('✅ Role Seeded Successfully');

    await permRepo.insert(mockPermissions);
    console.log('✅ Permission Seeded Successfully');

    for (const { id_role, id_permission } of mockRolePermissions) {
      await dataSource.query('INSERT INTO role_permissions (id_role, id_permission) VALUES (?, ?)', [id_role, id_permission]);
    }

    console.log('✅ Seeded: role_permissions');

    for (const { id_user, id_role } of mockUserRoles) {
      await dataSource.query('INSERT INTO user_roles (id_user, id_role) VALUES (?, ?)', [id_user, id_role]);
    }
    console.log('✅ Seeded: user_roles');

    console.log('✅ Seeded: users, roles, permissions, user_roles, role_permissions');
  }
}
