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
    const totalUserOnline = this.server.of('/').sockets.size;
    this.server.emit('totalUser', totalUserOnline);
    console.log(`clientId: ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    const totalUserOnline = this.server.of('/').sockets.size;
    this.server.emit('totalUser', totalUserOnline);
    console.log(`clientId: ${client.id} disconnect`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() msg: any, @ConnectedSocket() client: Socket) {
    console.log(msg);
    client.broadcast.emit('receivedMessage', msg);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() msg: any, @ConnectedSocket() client: Socket) {
    client.broadcast.emit('whoJoined', `${client.id} had join room`);
    console.log(`${client.id} had join room`);
  }
}
