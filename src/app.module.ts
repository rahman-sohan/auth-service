import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { MessageBrokerRabbitmqModule } from './message-broker-rabbitmq/message-broker-rabbitmq.module';

@Module({
    imports: [AuthModule, DatabaseModule, MessageBrokerRabbitmqModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
