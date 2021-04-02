import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { WsResponse } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ExtendedSocket } from '../socket-state/socket-state.entity';
import { RedisPropagatorService } from './redis-propagator.service';

@Injectable()
export class RedisPropagatorInterceptor<T> implements NestInterceptor<T, WsResponse<T>> {
  public constructor(private readonly redisPropagatorService: RedisPropagatorService) { }

  public intercept(context: ExecutionContext, next: CallHandler): Observable<WsResponse<T>> {
    const socket: ExtendedSocket = context.switchToWs().getClient();
    return next.handle().pipe(
      tap((data) => {
        this.redisPropagatorService.propagateEvent(
          data.gameId,
          {
            ...data,
            socketId: socket.id,
            userId: socket.userId,
          });
      }),
    );
  }
}
