import { Injectable } from '@nestjs/common';

type CheckoutItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  license_type?: string;
};

type MockCheckoutPayload = {
  customerName: string;
  customerEmail: string;
  items: CheckoutItem[];
};

@Injectable()
export class CheckoutService {
  async createMockOrder(payload: MockCheckoutPayload) {
    const subtotal = payload.items.reduce(
      (sum, item) => sum + item.price * Math.max(1, item.quantity || 1),
      0,
    );

    return {
      orderId: `ORD-${Date.now()}`,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      items: payload.items,
      subtotal,
      total: subtotal,
      currency: 'USD',
      status: 'paid_mock',
      createdAt: new Date().toISOString(),
    };
  }
}
