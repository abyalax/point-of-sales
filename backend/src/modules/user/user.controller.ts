import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { TResponse } from '~/common/types/response';
import { UpdateResult } from 'typeorm';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async get(): Promise<TResponse<User[]>> {
    const data = await this.userService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('ids')
  async getIds(): Promise<TResponse<number[]>> {
    const data = await this.userService.getIds();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<TResponse> {
    const data = await this.userService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<TResponse<User>> {
    const data = await this.userService.findOneBy({ id: Number(id) });
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<TResponse<User>> {
    const data = await this.userService.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<TResponse<UpdateResult>> {
    const data = await this.userService.update(+id, updateUserDto);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<TResponse<boolean>> {
    const deleted = await this.userService.remove(+id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      data: deleted,
    };
  }
}
