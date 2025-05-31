import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DatabaseModule } from '../database/database.module';
import { UserEventsListener } from './user-events.listener';
import { MessageBrokerRabbitmqModule } from 'src/message-broker-rabbitmq/message-broker-rabbitmq.module';

@Module({
    imports: [DatabaseModule, MessageBrokerRabbitmqModule, PassportModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, UserEventsListener],
    exports: [AuthService],
})
export class AuthModule {}
