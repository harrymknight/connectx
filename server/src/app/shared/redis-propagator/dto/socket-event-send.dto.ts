import { RedisSocketEventEmitDTO } from './socket-event-emit.dto';

export class RedisSocketEventSendDTO extends RedisSocketEventEmitDTO {
  public readonly userId: string;
  public readonly socketId: string;
  public readonly event: string;
  public readonly data: unknown;
}
