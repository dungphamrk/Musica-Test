import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CheckoutController } from './checkout/checkout.controller';
import { CheckoutService } from './checkout/checkout.service';
import { SupabaseModule } from './supabase/supabase.module';
import { TracksController } from './tracks/tracks.controller';
import { TracksService } from './tracks/tracks.service';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    SupabaseModule,
    CartModule, 
    OrdersModule
  ],
  controllers: [TracksController, CheckoutController],
  providers: [TracksService, CheckoutService],
})
export class AppModule {}
