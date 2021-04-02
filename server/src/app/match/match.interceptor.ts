import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { WsResponse } from '@nestjs/websockets';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  
  import { ExtendedSocket } from '../shared/socket-state/socket-state.entity';
  import { RedisPropagatorService } from '../shared/redis-propagator/redis-propagator.service';
  
  @Injectable()
  export class MatchInterceptor<T> implements NestInterceptor<T, WsResponse<T>> {
    public constructor(private readonly redisPropagatorService: RedisPropagatorService) { }
  
    public intercept(context: ExecutionContext, next: CallHandler): Observable<WsResponse<T>> {
      const socket: ExtendedSocket = context.switchToWs().getClient();
      return next.handle().pipe(
        tap((eventInfo) => {
          console.log(eventInfo);
          this.redisPropagatorService.propagateEvent(
            eventInfo.data.game_id,
            {
              ...eventInfo,
              socketId: socket.id,
              userId: socket.userId,
            });
        }),
      );
    }
  }
  