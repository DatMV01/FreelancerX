import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtOptionalAuthGuard extends AuthGuard('jwt-optinal') {
  handleRequest(err, user, info, context: ExecutionContext) {
    // Không ném lỗi nếu không có token hoặc token sai
    return user || null;
  }
}
