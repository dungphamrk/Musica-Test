import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CheckoutController } from './checkout/checkout.controller';
import { CheckoutService } from './checkout/checkout.service';
import { SupabaseService } from './supabase/supabase.service';
import { TracksController } from './tracks/tracks.controller';
import { TracksService } from './tracks/tracks.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [TracksController, CheckoutController],
  providers: [SupabaseService, TracksService, CheckoutService],
})
export class AppModule {}
