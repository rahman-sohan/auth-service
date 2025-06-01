import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class MessageBrokerRabbitmqService {
    constructor(private readonly amqpConnection: AmqpConnection) {}

    async publishToAuthExchange(params: any) {		
        const { data, pattern } = params;
        await this.amqpConnection.publish('auth_service', pattern, {
            pattern,
            data,
        });
    }
}
