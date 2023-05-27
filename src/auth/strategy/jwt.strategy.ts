import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  ExtractJwt,
} from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: {sub:number, email: string}) {
    console.log({ payload }, 'payload');
    const user= await this.prisma.user.findUnique({
        where:{
            id:payload.sub
        }
    })
    delete user.password;
    return user;
  }
}
