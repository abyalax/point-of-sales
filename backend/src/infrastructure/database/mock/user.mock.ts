import * as bcrypt from 'bcryptjs';
import { User } from '~/modules/user/entity/user.entity';

export const mockUser = async (): Promise<User[]> => {
  const plaintextPassword = 'password';
  const passwordHashed = await bcrypt.hash(plaintextPassword, 10);

  const admin: User = {
    id: 1,
    name: 'Abya Lacks',
    email: 'abyalaxx@gmail.com',
    password: passwordHashed,
    roles: [],
    transactions: [],
  };
  const editor: User = {
    id: 2,
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: passwordHashed,
    roles: [],
    transactions: [],
  };
  const viewer1: User = {
    id: 3,
    name: 'De Vanto',
    email: 'devanto@gmail.com',
    password: passwordHashed,
    roles: [],
    transactions: [],
  };
  const viewer2: User = {
    id: 4,
    name: 'Al Besto',
    email: 'albesto@gmail.com',
    password: passwordHashed,
    roles: [],
    transactions: [],
  };

  return [admin, editor, viewer1, viewer2];
};
