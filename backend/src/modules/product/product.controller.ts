import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { TResponse } from '~/common/types/response';
import { AuthGuard } from '../../common/guards/auth.guard';
import { JwtGuard } from '~/common/guards/jwt.guard';
import { RolesGuard } from '~/common/guards/roles.guard';
import { Roles } from '~/common/decorators/roles.decorator';
import { QueryProductDto } from './dto/query-product.dto';
import { MetaResponse } from '~/common/types/meta';
import { CategoryDto, CreateCategoryDto } from './dto/category-product.dto';

@UseGuards(AuthGuard, JwtGuard, RolesGuard)
@Roles('Admin')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async get(@Query() query: QueryProductDto): Promise<TResponse<{ data: ProductDto[]; meta: MetaResponse }>> {
    console.log(query);
    const products = await this.productService.find(query);
    return {
      statusCode: HttpStatus.OK,
      data: products,
    };
  }

  @Get('categories')
  async getCategories(): Promise<TResponse<CategoryDto[]>> {
    const data = await this.productService.getCategories();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<TResponse<ProductDto>> {
    const product = await this.productService.create(createProductDto);
    return {
      statusCode: HttpStatus.CREATED,
      data: product,
    };
  }

  @Post('/categories')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<TResponse<CategoryDto>> {
    console.log('createCategoryDto: ', createCategoryDto.name);
    const data = await this.productService.createCategory(createCategoryDto);
    return {
      statusCode: HttpStatus.CREATED,
      data: data,
    };
  }

  @Get(':id')
  async findOneByID(@Param('id') id: number): Promise<TResponse<ProductDto>> {
    const product = await this.productService.findOneByID(id);
    return {
      statusCode: HttpStatus.OK,
      data: product,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto): Promise<TResponse<boolean>> {
    const isUpdated = await this.productService.update(id, updateProductDto);
    return {
      statusCode: HttpStatus.OK,
      data: isUpdated,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<TResponse<boolean>> {
    const isDeleted = await this.productService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      data: isDeleted,
    };
  }
}
