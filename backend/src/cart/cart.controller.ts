import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { SupabaseGuard } from '../auth/supabase.guard';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(SupabaseGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user\'s active cart' })
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add a track to the cart' })
  @ApiBody({ schema: { type: 'object', properties: { trackId: { type: 'string' }, price: { type: 'number' } } } })
  addItem(@Request() req, @Body() body: { trackId: string; price: number }) {
    return this.cartService.addItem(req.user.id, body.trackId, body.price);
  }

  @Delete('items/:trackId')
  @ApiOperation({ summary: 'Remove a track from the cart' })
  removeItem(@Request() req, @Param('trackId') trackId: string) {
    return this.cartService.removeItem(req.user.id, trackId);
  }
}
