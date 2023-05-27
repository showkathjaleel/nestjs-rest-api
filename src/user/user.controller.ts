import { Controller , Get , UseGuards , Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from '@prisma/client';
@Controller('user')
export class UserController {
  // constructor(private user: UserService) {}
  @Get('me')
  @UseGuards(JwtGuard)
  getMe(@GetUser() user: User) {
    return user;
  }
}
