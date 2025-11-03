import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { User, UserDocument } from 'src/users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in .env file');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    if (!payload?.userId) {
      throw new UnauthorizedException('Invalid JWT payload');
    }

    const user = await this.userModel.findById(payload.userId).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
