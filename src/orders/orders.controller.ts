import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto, @Request() req: any) {
    return this.ordersService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.ordersService.findAll(parseInt(page), parseInt(limit));
  }

  @Get('held')
  getHeldBills() {
    return this.ordersService.findAllHoldBills();
  }

  @Get('sales')
  getSalesReport(
    @Query('filter') filter: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'daily',
    @Query('search') search?: string,
  ) {
    return this.ordersService.getSalesReport(filter, search);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.softDelete(id);
  }
}
