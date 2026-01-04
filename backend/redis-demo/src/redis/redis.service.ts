import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT') private readonly client: RedisClientType;
  async geoAdd(
    key: string,
    longitude: number,
    latitude: number,
    member: string,
  ) {
    return await this.client.geoAdd(key, {
      longitude,
      latitude,
      member,
    });
  }

  async geoPos(key: string, member: string) {
    const res = await this.client.geoPos(key, member);
    return {
      member,
      posInfo: res[0],
    };
  }

  async geoAllPos(key: string) {
    const res = await this.client.zRange(key, 0, -1);
    const posPromise = res.map((item) => {
      return this.geoPos(key, item);
    });
    return await Promise.all(posPromise);
  }

  async getPosRadius(
    key: string,
    longitude: number,
    latitude: number,
    radius: number,
  ) {
    const res = await this.client.geoRadius(
      key,
      {
        longitude,
        latitude,
      },
      radius,
      'km',
    );
    const posPromise = res.map((item) => {
      return this.geoPos(key, item);
    });
    return await Promise.all(posPromise);
  }
}
