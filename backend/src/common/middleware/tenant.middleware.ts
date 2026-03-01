import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // This middleware can be used to extract tenant context if needed
    // For now, identity is managed by JWT, but we can inject helper methods here
    next();
  }
}
