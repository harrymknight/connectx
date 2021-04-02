import { Injectable } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Server } from 'ws';

import { RedisService } from '../redis/redis.service';
import { SocketStateService } from '../socket-state/socket-state.service';

import { RedisSocketEventEmitDTO } from './dto/socket-event-emit.dto';
import { RedisSocketEventSendDTO } from './dto/socket-event-send.dto';
import {
  REDIS_SOCKET_EVENT_EMIT_ALL_NAME,
  REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME,
  REDIS_SOCKET_EVENT_SEND_NAME,
} from './redis-propagator.constants';

@Injectable()
export class RedisPropagatorService {
  private socketServer: Server;

  public constructor(
    private readonly socketStateService: SocketStateService,
    private readonly redisService: RedisService,
  ) {
    this.redisService
      .fromEvent(REDIS_SOCKET_EVENT_SEND_NAME)
      .pipe(tap(this.consumeSendEvent))
      .subscribe();

    this.redisService
      .fromEvent(REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME)
      .pipe(tap(this.consumeEmitToAuthenticatedEvent))
      .subscribe();
  }

  public async createChannel(name: string, onEvent: (name?: string) => ((eventInfo: RedisSocketEventSendDTO) => Promise<void>)) {
    const eventExists = await this.redisService.eventExists(name);
    if (!eventExists) return this.redisService
      .fromEvent(name)
      .pipe(tap({
        next: onEvent(name),
        error: err => console.log(err)
      }))
      .subscribe();
  }

  public injectSocketServer(server: Server): RedisPropagatorService {
    this.socketServer = server;

    return this;
  }

  private consumeSendEvent =  (eventInfo: RedisSocketEventSendDTO): void => {
    const { userId, socketId, event, data } = eventInfo;
    return this.socketStateService
      .get(userId)
      .filter((socket) => socket.id !== socketId)
      .forEach((socket) => {
        return socket.send(JSON.stringify({event, data}))
      });
  };

  private consumeEmitToAuthenticatedEvent = (
    eventInfo: RedisSocketEventEmitDTO,
  ): void => {
    const { event, data } = eventInfo;

    return this.socketStateService
      .getAll()
      .forEach((socket) => socket.forEach(s => s.send(JSON.stringify({event, data}))));
  };

  public propagateEvent(channel: string, eventInfo: RedisSocketEventSendDTO): boolean {
    if (!eventInfo.userId) {
      return false;
    }

    this.redisService.publish(channel, eventInfo);

    return true;
  }

  public emitToAuthenticated(eventInfo: RedisSocketEventEmitDTO): boolean {
    this.redisService.publish(
      REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME,
      eventInfo,
    );

    return true;
  }

  public emitToAll(eventInfo: RedisSocketEventEmitDTO): boolean {
    this.redisService.publish(REDIS_SOCKET_EVENT_EMIT_ALL_NAME, eventInfo);

    return true;
  }
}
