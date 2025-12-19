import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}
  async add(body: { name: string }) {
    return await this.prismaService.person.create({
      data: body,
    });
  }

  async findAll() {
    return await this.prismaService.person.findMany();
  }

  async delete(id: number) {
    return await this.prismaService.person.delete({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, body: { name: string }) {
    return await this.prismaService.person.update({
      where: {
        id: id,
      },
      data: body,
    });
  }

  async findArticle(authorId: number) {
    return await this.prismaService.article.findFirst({
      where: {
        authorId: authorId,
      },
      include: {
        author: true,
      },
    });
  }
}
