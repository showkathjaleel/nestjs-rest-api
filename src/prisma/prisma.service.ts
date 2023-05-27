import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          // url: "postgresql://postgres:123@localhost:5434/nest?schema=public",
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
}

//super will call the constructior that i am extending
