import {
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    //generate the password hash
    const hash = await argon.hash(dto.password);
    //save the user in db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
        },
      });
      //return the user
      return user;
    } catch (error) {
      //if Error is from prisma
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          //Duplication of unique fields
          throw new ForbiddenException(
            'Credentials Taken',
          );
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    //find the user in db
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
    if (!user) {
      throw new ForbiddenException(
        'Email is incorrect',
      );
    }
    //check if password is correct
    const isMatch = await argon.verify(
      user.password,
      dto.password,
    );
    if (!isMatch) {
      throw new ForbiddenException(
        'Incorrect password',
      );
    }
    return this.generateAccessToken(
      user.id,
      user.email,
    );
  }

   async generateAccessToken(
    userId: number,
    email: string,
  ) : Promise< { access_token: string } > {
    const payload = {
      sub: userId,
      email,
    };
    const secretKey = this.config.get(
      'JWT_SECRET_KEY',
    );
    console.log(secretKey, 'secret');
    const token=await this.jwt.signAsync(payload, {expiresIn:'15m', secret: secretKey } );
    return {
      access_token: token
    }
  }
}
