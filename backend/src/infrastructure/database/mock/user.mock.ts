//* It Does Not Support Path Alias Shorthand */
import { User } from '../../../modules/user/user.entity';

const bcrypt = require('bcryptjs');

export const mockUser = async (): Promise<User[]> => {
  const plaintextPassword = 'password';
  const passwordHashed = await bcrypt.hash(plaintextPassword, 10);

  const admin: User = { id: 1, name: 'Abya Lacks', email: 'abyalaxx@gmail.com', password: passwordHashed, roles: [] };
  const editor: User = { id: 2, name: 'John Doe', email: 'johndoe@gmail.com', password: passwordHashed, roles: [] };
  const viewer1: User = { id: 3, name: 'De Vanto', email: 'devanto@gmail.com', password: passwordHashed, roles: [] };
  const viewer2: User = { id: 4, name: 'Al Besto', email: 'albesto@gmail.com', password: passwordHashed, roles: [] };

  return [admin, editor, viewer1, viewer2];
};
