import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class MessageBrokerRabbitmqService {
	constructor(private readonly amqpConnection: AmqpConnection) {}

	async publish(params: any) {
		const delayMilliseconds = 5000;
		await new Promise((resolve) => setTimeout(resolve, delayMilliseconds));

		const { data, pattern } = params;

		await this.amqpConnection.publish('auth_service', pattern, {
			pattern,
			data,
		});
	}

	async publishDataForThirdParty(params: any) {
		const delayMilliseconds = 5000;
		await new Promise((resolve) => setTimeout(resolve, delayMilliseconds));

		const { data, pattern } = params;
		
		await this.amqpConnection.publish('hotel_booking', pattern, data);
	}
}
