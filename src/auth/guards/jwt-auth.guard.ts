

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    console.log('JwtAuthGuard handleRequest called');
    if (err || !user) {
      console.log('Unauthorized:', err, info);
      throw err || new UnauthorizedException();
    }
    return user;
  }
}