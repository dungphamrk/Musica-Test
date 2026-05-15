import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';

@ApiTags('Checkout (Legacy)')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('mock')
  @ApiOperation({ summary: 'Create a mock order (Legacy)' })
  async create(@Body() body: any) {
    return this.checkoutService.createMockOrder(body);
  }
}
