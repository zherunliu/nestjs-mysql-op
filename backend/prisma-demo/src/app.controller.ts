import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  addPerson(@Body() body: { name: string }) {
    return this.appService.add(body);
  }

  @Get()
  findAll() {
    return this.appService.findAll();
  }

  @Delete()
  deletePerson(@Query('id') id: string) {
    return this.appService.delete(+id);
  }

  @Patch()
  updatePerson(@Query('id') id: string, @Body() body: { name: string }) {
    return this.appService.update(+id, body);
  }

  @Get('findArticle')
  findArticle(@Query('authorId') authorId: string) {
    return this.appService.findArticle(+authorId);
  }
}
