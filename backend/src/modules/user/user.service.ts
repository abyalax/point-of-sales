import { Inject, Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { REPOSITORY } from '~/common/constants/database';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Permission } from '../auth/entity/permission.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(REPOSITORY.USER)
    private userRepository: Repository<User>,

    @Inject(REPOSITORY.PERMISSION)
    private permissionRepository: Repository<Permission>,
  ) {}

  async getFlattenPermissions(userId: number): Promise<string[]> {
    const raw = await this.permissionRepository
      .createQueryBuilder('permission')
      .distinct(true)
      .innerJoin('permission.roles', 'role')
      .innerJoin('role.users', 'user')
      .where('user.id = :userId', { userId })
      .select('permission.key_name', 'key')
      .getRawMany();
    return raw.map((row) => row.key);
  }

  async getFullPermissions(userId: number): Promise<Permission[]> {
    const permissions = await this.permissionRepository
      .createQueryBuilder('permission')
      .distinct(true)
      .innerJoin('permission.roles', 'role')
      .innerJoin('role.users', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
    return permissions;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async find(params?: FindManyOptions<User>): Promise<User[]> {
    return await this.userRepository.find(params);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.save(createUserDto);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email }, relations: ['roles'] });
  }

  async findOneBy(params: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
    return await this.userRepository.findOne({ where: params, relations: ['roles'] });
  }

  async findOne(params: FindOneOptions<User>) {
    return await this.userRepository.findOne(params);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
