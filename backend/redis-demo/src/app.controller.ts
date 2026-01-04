import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
  ) {}

  @Get('geoAdd')
  async geoAdd(
    @Query('key') key: string,
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('member') member: string,
  ) {
    try {
      return this.redisService.geoAdd(key, +longitude, +latitude, member);
    } catch (err) {
      console.log(err);
    }
  }

  @Get('geoPos')
  async geoPos(@Query('key') key: string, @Query('member') member: string) {
    try {
      return this.redisService.geoPos(key, member);
    } catch (err) {
      console.log(err);
    }
  }

  @Get('geoAllPos')
  async geoAllPos(@Query('key') key: string) {
    try {
      return this.redisService.geoAllPos(key);
    } catch (err) {
      console.log(err);
    }
  }

  @Get('geoPosRadius')
  async geoPosRadius(
    @Query('key') key: string,
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('radius') radius: number,
  ) {
    try {
      return this.redisService.getPosRadius(
        key,
        +longitude,
        +latitude,
        +radius,
      );
    } catch (err) {
      console.log(err);
    }
  }
}
