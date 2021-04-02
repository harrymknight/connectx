import { Injectable } from '@nestjs/common';
import { ExtendedSocket } from './socket-state.entity';

@Injectable()
export class SocketStateService {
  private socketState = new Map<string, ExtendedSocket[]>();

  public remove(userId: string, socket: ExtendedSocket): boolean {
    const existingSockets = this.socketState.get(userId);

    if (!existingSockets) {
      return true;
    }

    const sockets = existingSockets.filter((s) => s.id !== socket.id);
    
    if (!sockets.length) {
      this.socketState.delete(userId);
    } else {
      this.socketState.set(userId, sockets);
    }

    return true;
  }

  public add(userId: string, socket: ExtendedSocket): boolean {
    const existingSockets = this.socketState.get(userId) || [];

    const sockets = [...existingSockets, socket];

    this.socketState.set(userId, sockets);

    return true;
  }

  public get(userId: string): ExtendedSocket[] | any {
    return this.socketState.get(userId) || [];
  }

  public getAll(): Map<string, ExtendedSocket[]> {
    return new Map(this.socketState);
  }
}
