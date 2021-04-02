import { Inject, Injectable } from '@nestjs/common';
import { Observable, Observer } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { RedisSocketEventSendDTO } from '../redis-propagator/dto/socket-event-send.dto';

import {
  REDIS_PUBLISHER_CLIENT,
  REDIS_SUBSCRIBER_CLIENT,
} from './redis.constants';
import { RedisClient } from './redis.providers';

export interface RedisSubscribeMessage {
  readonly message: string;
  readonly channel: string;
}

@Injectable()
export class RedisService {
  public constructor(
    @Inject(REDIS_SUBSCRIBER_CLIENT)
    private readonly redisSubscriberClient: RedisClient,
    @Inject(REDIS_PUBLISHER_CLIENT)
    private readonly redisPublisherClient: RedisClient,
  ) {}

  public eventExists(eventName: string): Promise<boolean> {
    return new Promise(resolve => {
      const tempClient = this.redisSubscriberClient.duplicate();
      tempClient.pubsub('CHANNELS', (err, result: any) => {
        if (err) console.log(err);
        if (result.includes(eventName)) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    })
  }

  public fromEvent<T extends RedisSocketEventSendDTO>(eventName: string): Observable<T> {
    this.redisSubscriberClient.subscribe(eventName);
    return new Observable((observer: Observer<RedisSubscribeMessage>) =>
      this.redisSubscriberClient.on('message', (channel, message) => {
        return observer.next({ channel, message })
      }),
    ).pipe(
      filter(({ channel }) => channel === eventName),
      map(({ message }) => JSON.parse(message)),
    );
  }

  public async publish(channel: string, value: unknown): Promise<number> {

    return new Promise<number>((resolve, reject) => {
      return this.redisPublisherClient.publish(channel, JSON.stringify(value), (error, reply) => {

        if (error) {
          return reject(error);
        }

        return resolve(reply);
      });
    });
  }
}
