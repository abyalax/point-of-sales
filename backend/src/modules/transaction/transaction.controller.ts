import { Param, HttpCode, UseGuards, HttpStatus, Controller, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { ProductProfitable, ReportSales, SalesByCategory } from './transaction.schema';
import { Get, Req, Post, Body, Query } from '@nestjs/common';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { QueryReportSales } from './dto/query-report-sales.dto';
import { Roles } from '~/common/decorators/roles.decorator';
import { TransactionService } from './transaction.service';
import { RolesGuard } from '~/common/guards/roles.guard';
import { TransactionDto } from './dto/transaction.dto';
import { AuthGuard } from '~/common/guards/auth.guard';
import { TResponse } from '~/common/types/response';
import { JwtGuard } from '~/common/guards/jwt.guard';
import { MetaResponse } from '~/common/types/meta';
import { CartDto } from './dto/carts.dto';
import { Request } from 'express';
import { FilterPeriodeDto } from '~/common/dto/filter-periode.dto';

@UseGuards(AuthGuard, JwtGuard, RolesGuard)
@Roles('Cashier', 'Admin')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async find(@Query() query: QueryTransactionDto): Promise<TResponse<{ data: TransactionDto[]; meta: MetaResponse }>> {
    const data = await this.transactionService.find(query);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('/sales')
  async getReportSales(@Query() query: QueryReportSales): Promise<TResponse<ReportSales>> {
    const data = await this.transactionService.reportSales(query);
    if (data === undefined) throw new NotFoundException(`Data Sales Not Found`);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('/sales/products/profitable')
  async getReportProductProfitable(@Query() query: FilterPeriodeDto): Promise<TResponse<ProductProfitable[]>> {
    const data = await this.transactionService.productProfitable(query);
    if (data === undefined) throw new NotFoundException(`Data Products Sales Not Found`);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('/sales/month/:year')
  async getReportSalesPerMonth(@Param('year') year: string): Promise<TResponse<ReportSales[]>> {
    const data = await this.transactionService.reportSalesPerMonth(year);
    if (data.length === 0) throw new NotFoundException(`Data Sales Not Found`);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('/sales/category/:year')
  async getReportSalesByCategory(@Param('year') year: string): Promise<TResponse<SalesByCategory[]>> {
    const data = await this.transactionService.reportSalesByCategory(year);
    if (data.length === 0) throw new NotFoundException(`Data Sales Not Found`);
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('ids')
  async getIdProducts(): Promise<TResponse<number[]>> {
    const ids = await this.transactionService.getIds();
    return {
      statusCode: HttpStatus.OK,
      data: ids,
    };
  }

  @Get(':id')
  async getByID(@Param('id') id: number): Promise<TResponse<TransactionDto>> {
    const transaction = await this.transactionService.findByID(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Transaction Found',
      data: transaction,
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Req() req: Request, @Body() createTransactionDto: CartDto): Promise<TResponse<TransactionDto>> {
    const id: number | undefined = req.user?.id;
    if (!id) throw new UnauthorizedException(`Cashier Does'nt Authorized`);
    const data = await this.transactionService.create(createTransactionDto, id);
    return {
      statusCode: HttpStatus.CREATED,
      data,
    };
  }
}
