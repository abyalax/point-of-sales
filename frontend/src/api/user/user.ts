export interface IPermission {
  id: number;
  key: string;
  name: string;
}

export interface IRole {
  id: number;
  name: string;
  users: IUser[];
  permissions: IPermission[];
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  roles: IRole[];
  permissions: string[];
  refreshToken?: string;
  created_at?: Date;
  updated_at?: Date;
}
