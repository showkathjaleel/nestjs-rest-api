import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()  //this prisma service will be available to all the modules in our ap
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
