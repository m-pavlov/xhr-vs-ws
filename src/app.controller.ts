import { Controller, Post, Body } from '@nestjs/common';
import { EventsGateway } from 'src/events.gateway';

@Controller('api')
export class AppController {
  constructor(private readonly ws: EventsGateway) {}

  @Post('test')
  test(@Body() message: any): string {
    this.ws.emit('messageToClient', { id: message.id });
    return;
  }
}
