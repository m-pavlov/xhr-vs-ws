import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('messageToServer')
  listenForMessages(@MessageBody() { id }: any) {
    this.emit('messageToClient', { id });
  }

  emit(event: string, data: any) {
    this.server.sockets.emit(event, data);
  }
}
