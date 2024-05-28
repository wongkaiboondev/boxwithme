import { OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';
export declare class EventsGateway implements OnModuleInit {
    server: Server;
    onModuleInit(): void;
    handleEvent(body: any): any;
}
