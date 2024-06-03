import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`clientId: ${client.id} connected`);
    this.server.emit('totalUser', this.server.of('/').sockets.size);
  }

  handleDisconnect(client: Socket) {
    console.log(`clientId: ${client.id} disconnect`);
    this.server.emit('totalUser', this.server.of('/').sockets.size);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() msg: any) {
    console.log(msg);
    this.server.emit('receivedMessage', msg);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() msg: any, @ConnectedSocket() client: Socket) {
    console.log(msg);
    this.server.emit('whoJoined', `${client.id} had join room`);
    console.log(`${client.id} had join room`);
  }
}
