import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ItemsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll() {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('items') // Giả sử bạn có bảng 'items'
      .select('*');
    
    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('items')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async create(item: any) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('items')
      .insert([item])
      .select();
    
    if (error) throw error;
    return data;
  }
}
