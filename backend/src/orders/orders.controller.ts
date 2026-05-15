import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { SupabaseGuard } from '../auth/supabase.guard';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(SupabaseGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Process checkout and create an order' })
  @ApiBody({ schema: { type: 'object', properties: { paymentMethod: { type: 'string' }, customerName: { type: 'string' }, customerEmail: { type: 'string' } } } })
  checkout(
    @Request() req,
    @Body() checkoutData: { paymentMethod: string; customerName: string; customerEmail: string }
  ) {
    return this.ordersService.checkout(req.user.id, checkoutData);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get purchase history for the current user' })
  getHistory(@Request() req) {
    return this.ordersService.getHistory(req.user.id);
  }
}
