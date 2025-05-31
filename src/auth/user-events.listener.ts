import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UserEventsListener {
  @OnEvent('user.created')
  handleUserCreatedEvent(payload: any) {
    console.log('User Created:', payload);
    // Here you can add code to notify other services
    // For example, sending an event to a message queue
  }
}
