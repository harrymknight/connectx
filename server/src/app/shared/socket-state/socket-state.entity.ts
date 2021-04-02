import WebSocket from 'ws';

export declare class ExtendedSocket extends WebSocket {
    id: string;
    userId: string;
}