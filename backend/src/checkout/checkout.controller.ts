import { Body, Controller, Post } from '@nestjs/common';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('mock')
  async create(@Body() body: any) {
    return this.checkoutService.createMockOrder(body);
  }
}
