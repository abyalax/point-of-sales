import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CategoryDto, CreateCategoryDto } from './dto/category-product.dto';
import { QueryProductReportDto } from './dto/query-product-report.dto';
import { FilterPeriodeDto } from '~/common/dto/filter-periode.dto';
import { QueryProductTrendDto } from './dto/query-product-trending';
import { OmitProduct } from '../transaction/transaction.schema';
import { PayloadProductDto } from './dto/payload-product.dto';
import { Roles } from '~/common/decorators/roles.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ProductTrendDto } from './dto/product-trend.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { RolesGuard } from '~/common/guards/roles.guard';
import { JwtGuard } from '~/common/guards/jwt.guard';
import { TResponse } from '~/common/types/response';
import { MetaResponse } from '~/common/types/meta';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { ProductDiscountImpact, ProductFrequencySold } from './product.schema';

@UseGuards(AuthGuard, JwtGuard, RolesGuard)
@Roles('Cashier', 'Admin')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async get(): Promise<TResponse<OmitProduct[]>> {
    const products = await this.productService.getAll();
    return {
      statusCode: HttpStatus.OK,
      data: products,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('/sold')
  async sold(@Query() query: QueryProductReportDto): Promise<TResponse<ProductFrequencySold[]>> {
    const products = await this.productService.productSold(query);
    if (products.length === 0) throw new NotFoundException('Data Sales Not Found');
    return {
      statusCode: HttpStatus.OK,
      data: products,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('/trending')
  async getProductTrends(@Query() query: QueryProductTrendDto): Promise<TResponse<ProductTrendDto[]>> {
    const data = await this.productService.getProductTrends(query.type_periode);
    if (data.length === 0) throw new NotFoundException('Data Products Not Found');
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('/discount/impact')
  async getProductDiscountImpact(@Query() query: FilterPeriodeDto): Promise<TResponse<ProductDiscountImpact[]>> {
    console.log('FilterPeriodeDto: ', query);
    const data = await this.productService.productDiscountImpact(query);
    if (data.length === 0) throw new NotFoundException('Data Products Not Found');
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('/search')
  async search(@Query() query: QueryProductDto): Promise<TResponse<{ data: ProductDto[]; meta: MetaResponse }>> {
    const products = await this.productService.find(query);
    return {
      statusCode: HttpStatus.OK,
      data: products,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('/search/name')
  async searchByName(@Query() query: { search: string }): Promise<TResponse<ProductDto[]>> {
    const products = await this.productService.searchByName(query);
    return {
      statusCode: HttpStatus.OK,
      data: products,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('categories')
  async getCategories(): Promise<TResponse<CategoryDto[]>> {
    const data = await this.productService.getCategories();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() payloadProductDto: PayloadProductDto): Promise<TResponse<ProductDto>> {
    const product = await this.productService.create(payloadProductDto);
    return {
      statusCode: HttpStatus.CREATED,
      data: product,
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/categories')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<TResponse<CategoryDto>> {
    const data = await this.productService.createCategory(createCategoryDto);
    return {
      statusCode: HttpStatus.CREATED,
      data: data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('ids')
  async getIdProducts(): Promise<TResponse<number[]>> {
    const ids = await this.productService.getIds();
    return {
      statusCode: HttpStatus.OK,
      data: ids,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOneByID(@Param('id') id: number): Promise<TResponse<ProductDto>> {
    const product = await this.productService.findOneByID(id);
    return {
      statusCode: HttpStatus.OK,
      data: product,
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() PayloadProductDto: PayloadProductDto): Promise<TResponse<boolean>> {
    const isUpdated = await this.productService.update(id, PayloadProductDto);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      data: isUpdated,
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<TResponse<boolean>> {
    const isDeleted = await this.productService.remove(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      data: isDeleted,
    };
  }
}
