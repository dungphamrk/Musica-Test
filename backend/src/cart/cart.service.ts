import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CartService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private get client() {
    return this.supabaseService.getClient();
  }

  async getCart(userId: string) {
    if (!this.supabaseService.isConfigured() || userId === 'demo') return [];

    let { data: cart } = await this.client
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (!cart) {
      const { data: newCart, error } = await this.client
        .from('carts')
        .insert({ user_id: userId, status: 'active' })
        .select('id')
        .single();
        
      if (error) throw new InternalServerErrorException(error.message);
      cart = newCart;
    }

    const { data: items, error: itemsError } = await this.client
      .from('cart_items')
      .select('track_id, price')
      .eq('cart_id', cart.id);

    if (itemsError) throw new InternalServerErrorException(itemsError.message);

    // Get track details
    if (!items || items.length === 0) return [];

    const trackIds = items.map(item => item.track_id);
    const { data: tracks, error: tracksError } = await this.client
      .from('tracks')
      .select('id, title, artist_name, cover_image_url')
      .in('id', trackIds);

    if (tracksError) throw new InternalServerErrorException(tracksError.message);

    // Merge track info with cart items
    return items.map(item => {
      const track = tracks?.find(t => t.id === item.track_id);
      return {
        id: item.track_id,
        title: track?.title || 'Unknown Track',
        artist_name: track?.artist_name || 'Unknown Artist',
        cover_image_url: track?.cover_image_url || '',
        price: item.price
      };
    });
  }

  async addItem(userId: string, trackId: string, price: number) {
    if (!this.supabaseService.isConfigured() || userId === 'demo') return { success: true };

    let { data: cart } = await this.client
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (!cart) {
      const { data: newCart } = await this.client
        .from('carts')
        .insert({ user_id: userId, status: 'active' })
        .select('id')
        .single();
      cart = newCart;
    }

    const { error } = await this.client
      .from('cart_items')
      .insert({ cart_id: cart.id, track_id: trackId, price });

    // Ignore unique constraint errors (already in cart)
    if (error && error.code !== '23505') {
      throw new InternalServerErrorException(error.message);
    }
    return { success: true };
  }

  async removeItem(userId: string, trackId: string) {
    if (!this.supabaseService.isConfigured() || userId === 'demo') return { success: true };

    const { data: cart } = await this.client
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (!cart) return { success: true };

    const { error } = await this.client
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id)
      .eq('track_id', trackId);

    if (error) throw new InternalServerErrorException(error.message);
    return { success: true };
  }
}
