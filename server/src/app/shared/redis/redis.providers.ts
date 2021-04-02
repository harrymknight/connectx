import { Provider } from '@nestjs/common';
import * as redis from 'redis';

import { REDIS_PUBLISHER_CLIENT, REDIS_SUBSCRIBER_CLIENT } from './redis.constants';

export type RedisClient = redis.RedisClient;

export const redisProviders: Provider[] = [
  {
    useFactory: (): RedisClient => {
      return redis.createClient({
        host: 'redis',
        port: 6379,
      });
    },
    provide: REDIS_SUBSCRIBER_CLIENT,
  },
  {
    useFactory: (): RedisClient => {
      return redis.createClient({
        host: 'redis',
        port: 6379,
      });
    },
    provide: REDIS_PUBLISHER_CLIENT,
  },
];
