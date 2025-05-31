import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MessageBrokerRabbitmqService } from './message-broker-rabbitmq.service';
import { APP_CONFIG } from 'src/config/default.config';


@Module({
	imports: [
		RabbitMQModule.forRoot({
			exchanges: [
				{
					name: 'auth_service',
					type: 'direct',
					options: { durable: true },
				},
			],
			queues: [
				{
					name: 'auth_user_events',
					createQueueIfNotExists: true,
					exchange: 'auth_service',
					routingKey: ['user.created', 'user.updated'],
				}
			],
			uri: APP_CONFIG.RABBITMQ_URL,
		})
	],

	providers: [MessageBrokerRabbitmqService],

	exports: [MessageBrokerRabbitmqService],
})

export class MessageBrokerRabbitmqModule {}
