import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DatabaseModule } from '../database/database.module';
import { MessageBrokerRabbitmqModule } from 'src/message-broker-rabbitmq/message-broker-rabbitmq.module';
import { AuthListener } from './auth.listener';

@Module({
    imports: [DatabaseModule, MessageBrokerRabbitmqModule, PassportModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, AuthListener],
    exports: [AuthService],
})
export class AuthModule {}
