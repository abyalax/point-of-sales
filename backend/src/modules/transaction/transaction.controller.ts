import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionDto } from './dto/transaction.dto';
import { TResponse } from '~/common/types/response';
import { Transaction } from './entities/transaction.entity';
import { CartDto } from './dto/carts.dto';
import { Request } from 'express';
import { Roles } from '~/common/decorators/roles.decorator';
import { AuthGuard } from '~/common/guards/auth.guard';
import { JwtGuard } from '~/common/guards/jwt.guard';
import { RolesGuard } from '~/common/guards/roles.guard';

@UseGuards(AuthGuard, JwtGuard, RolesGuard)
@Roles('Admin')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Req() req: Request, @Body() createTransactionDto: CartDto): Promise<TResponse<Transaction>> {
    const id: number | undefined = req.user?.id;
    if (!id) throw new UnauthorizedException(`Cashier Does'nt Authorized`);
    const data = await this.transactionService.create(createTransactionDto, id);
    return {
      statusCode: HttpStatus.CREATED,
      data,
    };
  }

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: TransactionDto) {
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
