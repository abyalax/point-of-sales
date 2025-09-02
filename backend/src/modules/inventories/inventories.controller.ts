import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';

import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { QueryInventoryDto } from './dto/query-inventory.dto';
import { InventoriesService } from './inventories.service';
import { TResponse } from '~/common/types/response';
import { Inventories } from './inventories.schema';
import { Paginated } from '~/common/types/meta';
import { Inventory } from './entities/inventory.entity';

@Controller('inventories')
export class InventoriesController {
  constructor(private readonly inventoriesService: InventoriesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createInventoryDto: CreateInventoryDto): Promise<TResponse<Inventory>> {
    const data = await this.inventoriesService.create(createInventoryDto);
    return {
      statusCode: HttpStatus.CREATED,
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async find(@Query() query: QueryInventoryDto): Promise<TResponse<Paginated<Inventories>>> {
    const data = await this.inventoriesService.find(query);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('ids')
  async getIds(): Promise<TResponse<number[]>> {
    const data = await this.inventoriesService.getIds();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TResponse<Inventory | null>> {
    const data = await this.inventoriesService.findOne(Number(id));
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto): Promise<TResponse<boolean>> {
    const updated = await this.inventoriesService.update(Number(id), updateInventoryDto);
    return {
      statusCode: HttpStatus.OK,
      data: updated,
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<TResponse<boolean>> {
    const deleted = await this.inventoriesService.remove(Number(id));
    return {
      statusCode: HttpStatus.NO_CONTENT,
      data: deleted,
    };
  }
}
