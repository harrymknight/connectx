import { INestApplication, WebSocketAdapter } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { JwtService } from '@nestjs/jwt';
import { RedisPropagatorService } from '../redis-propagator/redis-propagator.service';
import { SocketStateService } from './socket-state.service';
import { ExtendedSocket } from './socket-state.entity';
import { v4 as uuid } from 'uuid';
import { parse } from 'querystring';
import * as http from 'http';
import * as net from 'net';
import WebSocket from 'ws';


export class SocketStateAdapter extends WsAdapter implements WebSocketAdapter {
  public constructor(
    private readonly app: INestApplication,
    private readonly socketStateService: SocketStateService,
    private readonly redisPropagatorService: RedisPropagatorService,
    private readonly jwtService: JwtService,
  ) {
    super(app);
  }

  public create(port: number, options: WebSocket.ServerOptions = {}): WebSocket.Server {

    function authenticate(request: http.IncomingMessage, jwtService: JwtService, callback: (err?, client?) => void) {
      const cookies = {}
      request.headers.cookie.split(';').forEach(cookie => {
        const [key, value] = cookie.split('=');
        cookies[key] = value;
      });
      if ('Authentication' in cookies) {
        const player = jwtService.verify(cookies['Authentication'])
        if (!player) {
          callback('Token is invalid');
        } else {
          callback(undefined, player);
        }
      } else {
        callback('Token not present');
      }
    }

    const server = this.app.getHttpServer();
    const wss: WebSocket.Server = super.create(port, { ...options });

    server.on('upgrade', (request: http.IncomingMessage, socket: net.Socket, head: Buffer) => {
      authenticate(request, this.jwtService, (err, client) => {
        if (err || !client) {
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
          return;
        }
      })
    });

    this.redisPropagatorService.injectSocketServer(wss);
    return wss;
  }

  public bindClientConnect(server: WebSocket.Server, callback: Function): void {
    server.on('connection', (socket: ExtendedSocket, req: http.IncomingMessage) => {
      socket.id = uuid();
      socket.userId = parse(req.url.replace('/?', '')).userId as string;
      this.socketStateService.add(socket.userId, socket);

      socket.on('close', () => {
        this.socketStateService.remove(socket.userId, socket);
        socket.removeEventListener('close');
      });

      callback(socket);
    });
  }
}
