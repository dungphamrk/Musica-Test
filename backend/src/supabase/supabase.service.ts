import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient | null = null;

  constructor(private configService: ConfigService) {}

  private normalizeSupabaseUrl(input: string) {
    let url = input.trim();
    url = url.replace(/\/+$/, '');
    url = url.replace(/\/rest\/v1$/i, '');
    url = url.replace(/\/+$/, '');
    return url;
  }

  onModuleInit() {
    const supabaseUrlRaw = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrlRaw || !supabaseKey) {
      this.supabase = null;
      return;
    }

    const supabaseUrl = this.normalizeSupabaseUrl(supabaseUrlRaw);
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getClient() {
    if (!this.supabase) {
      throw new Error('Supabase is not configured (missing SUPABASE_URL/SUPABASE_KEY)');
    }
    return this.supabase;
  }

  isConfigured() {
    return !!this.supabase;
  }
}
