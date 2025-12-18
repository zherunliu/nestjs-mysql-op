import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}
  async getHello() {
    const res = await this.prismaService.person.create({
      data: {
        name: 'Rico White',
      },
    });
    return res;
  }
}
