import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback_secret_for_dev_only',
    });
  }

  async validate(payload: any) {
    // payload.sub is user id
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(payload.sub) },
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    return user;
  }
}