import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [SupabaseModule, CartModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
