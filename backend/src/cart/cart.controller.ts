import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { SupabaseGuard } from '../auth/supabase.guard';

@Controller('cart')
@UseGuards(SupabaseGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  addItem(@Request() req, @Body() body: { trackId: string; price: number }) {
    return this.cartService.addItem(req.user.id, body.trackId, body.price);
  }

  @Delete('items/:trackId')
  removeItem(@Request() req, @Param('trackId') trackId: string) {
    return this.cartService.removeItem(req.user.id, trackId);
  }
}
