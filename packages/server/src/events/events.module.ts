import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [EventsGateway],
  controllers: [],
  providers: [],
})
export class EventsModule {}
