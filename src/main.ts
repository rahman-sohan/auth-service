import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', credentials: true });
  app.setGlobalPrefix('api/v1/auth');


	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.RMQ,
		options: {
			urls: ['amqp://localhost:5672'],
			queue: 'notification_queue',
			queueOptions: { durable: true },
		},
	});

	await app.startAllMicroservices();
  
  await app.listen(process.env.PORT ?? 3000);
  console.log(`''''''''''Auth Service is running on port ${process.env.PORT ?? 3000}'''''''''`);
}
bootstrap();
