import { Injectable } from '@nestjs/common';
import { RedisService as IORedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { replaceStringParams } from '@app/common';

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor(private redisService: IORedisService) {
    this.client = this.redisService.getClient();
  }

  /**
   * @description 获取缓存
   * @param objectKey 存储key
   * @param option bucket存储桶,不传则是默认, params对象可以替换objectKey内的变量
   */
  get(
    objectKey: string,
    option?: {
      bucket?: 'default';
      params?: Record<string, any>; // 替换objectKey中的变量值
    },
  ) {
    let objectKeyStr: string = objectKey;
    if (option?.params) {
      objectKeyStr = replaceStringParams(objectKeyStr, option.params);
    }
    return this.getClient(option?.bucket).get(objectKeyStr);
  }

  set(
    objectKey: string,
    data: string | Buffer | number,
    option?: {
      bucket?: 'default';
      params?: Record<string, any>; // 替换objectKey中的变量值
      /** 单位毫秒, 默认: 五分钟过期 */
      expiresIn?: number;
    },
  ) {
    let objectKeyStr: string = objectKey;
    if (option?.params) {
      objectKeyStr = replaceStringParams(objectKeyStr, option.params);
    }
    return this.getClient(option?.bucket).set(objectKeyStr, data, 'PX', option?.expiresIn || 1000 * 60 * 5);
  }

  del(
    objectKey: string,
    option?: {
      bucket?: 'default';
      params?: Record<string, any>; // 替换objectKey中的变量值
    },
  ) {
    let objectKeyStr: string = objectKey;
    if (option?.params) {
      objectKeyStr = replaceStringParams(objectKeyStr, option.params);
    }
    return this.getClient(option?.bucket).del(objectKeyStr);
  }

  // 刷新过期时间
  refresh(
    objectKey: string,
    option?: {
      bucket?: 'default';
      milliseconds?: number;
      params?: Record<string, any>; // 替换objectKey中的变量值
    },
  ) {
    let objectKeyStr: string = objectKey;
    if (option?.params) {
      objectKeyStr = replaceStringParams(objectKeyStr, option.params);
    }
    return this.getClient(option?.bucket).pexpire(objectKeyStr, option?.milliseconds || 1000 * 60 * 5);
  }

  public getClient(bucket?: 'default') {
    switch (bucket) {
      case 'default':
      default:
        return this.client;
    }
  }
}
