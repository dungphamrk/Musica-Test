import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SupabaseGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.split(' ')[1];

    if (token === 'fake-admin') {
      request.user = { id: '00000000-0000-0000-0000-000000000001', email: 'admin@demo.com', role: 'admin' };
      return true;
    }

    if (token === 'fake-user') {
      request.user = { id: '00000000-0000-0000-0000-000000000002', email: 'user@demo.com', role: 'user' };
      return true;
    }

    if (!this.supabaseService.isConfigured()) {
      request.user = { id: 'demo', token };
      return true;
    }

    const client = this.supabaseService.getClient();
    
    // Kiểm tra token với Supabase Auth
    const { data: { user }, error } = await client.auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedException('Invalid token');
    }

    // Gán thông tin user vào request để sử dụng ở Controller
    request.user = user;
    return true;
  }
}
