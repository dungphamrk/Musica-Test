import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly cartService: CartService,
  ) {}

  private get client() {
    return this.supabaseService.getClient();
  }

  async checkout(userId: string, checkoutData: { paymentMethod: string; customerName: string; customerEmail: string }) {
    if (!this.supabaseService.isConfigured() || userId === 'demo') {
        return { success: true, orderId: 'demo-order' };
    }

    // 1. Get the current active cart
    const { data: cart, error: cartError } = await this.client
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (cartError || !cart) {
      throw new BadRequestException('No active cart found');
    }

    // 2. Get cart items
    const { data: items, error: itemsError } = await this.client
      .from('cart_items')
      .select('track_id, price')
      .eq('cart_id', cart.id);

    if (itemsError || !items || items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const totalAmount = items.reduce((sum, item) => sum + Number(item.price), 0);

    // 3. Create the order
    const orderPayload = {
      user_id: userId.startsWith('0000') ? null : userId, // Use null for demo UUIDs to avoid FK constraint issues
      total_amount: totalAmount,
      status: 'paid',
      payment_method: checkoutData.paymentMethod,
      customer_name: checkoutData.customerName,
      customer_email: checkoutData.customerEmail,
    };

    const { data: order, error: orderError } = await this.client
      .from('orders')
      .insert(orderPayload)
      .select('id')
      .single();

    if (orderError) throw new InternalServerErrorException(orderError.message);

    // 4. Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      track_id: item.track_id,
      price: item.price,
      license_type: 'Standard',
    }));

    const { error: oItemsError } = await this.client
      .from('order_items')
      .insert(orderItems);

    if (oItemsError) throw new InternalServerErrorException(oItemsError.message);

    // 5. Mark cart as completed
    await this.client
      .from('carts')
      .update({ status: 'completed' })
      .eq('id', cart.id);

    return { success: true, orderId: order.id };
  }

  async getHistory(userId: string) {
    if (!this.supabaseService.isConfigured()) return [];

    const { data: orders, error } = await this.client
      .from('orders')
      .select(`
        id,
        total_amount,
        status,
        created_at,
        order_items (
          price,
          license_type,
          track_id
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw new InternalServerErrorException(error.message);

    return orders;
  }
}
