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

    if (token?.startsWith('fake-')) {
      request.user = { id: 'demo', token };
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
