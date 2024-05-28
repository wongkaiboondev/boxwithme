import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('id', socket.id);
      console.log('connected');
    });
  }

  @SubscribeMessage('sendMessage')
  handleEvent(@MessageBody() body: any) {
    console.log(body);
    this.server.emit('receivedMessage', body);
    return body;
  }
}
