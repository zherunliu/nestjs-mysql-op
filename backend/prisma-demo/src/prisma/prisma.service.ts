import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';
@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const config = {
      host: process.env['DATABASE_HOST'],
      port: Number.parseInt(process.env['DATABASE_PORT'] ?? '3306', 10),
      user: process.env['DATABASE_USER'],
      password: process.env['DATABASE_PASSWORD'],
      database: process.env['DATABASE_NAME'],
    };
    console.log(config);
    const adapter = new PrismaMariaDb(config);
    super({ adapter });
  }
}
