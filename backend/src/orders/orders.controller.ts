import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { SupabaseGuard } from '../auth/supabase.guard';

@Controller('orders')
@UseGuards(SupabaseGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  checkout(
    @Request() req,
    @Body() checkoutData: { paymentMethod: string; customerName: string; customerEmail: string }
  ) {
    return this.ordersService.checkout(req.user.id, checkoutData);
  }

  @Get('history')
  getHistory(@Request() req) {
    return this.ordersService.getHistory(req.user.id);
  }
}
