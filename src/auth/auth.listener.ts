import { Injectable, Logger } from '@nestjs/common';
import { RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { AuthService } from './auth.service';
import { MessagePatterns } from '../common/constants/message-patterns';
import { MessageBrokerRabbitmqService } from '../message-broker-rabbitmq/message-broker-rabbitmq.service';

@Injectable()
export class AuthListener {
    constructor(
        private readonly authService: AuthService,
        private readonly messageBrokerService: MessageBrokerRabbitmqService,
    ) {}

    private readonly logger = new Logger(AuthListener.name);

    @RabbitRPC({
        exchange: 'auth_service',
        routingKey: MessagePatterns.TOKEN_VALIDATION_REQUEST,
        queue: 'token_validation_rpc_request_queue',
    })
    async handleTokenValidation(message: {
        pattern: MessagePatterns.TOKEN_VALIDATION_REQUEST;
        data: { token: string; correlationId?: string };
    }): Promise<any> {
        let response;

        if (!message || !message.data || !message.data.token) {
            response = {
                isValid: false,
                error: 'No token provided',
            };
        } else {
            try {
                response = await this.authService.validateToken(message.data.token);
            } catch (error) {
                this.logger.error(`Token validation error: ${error.message}`);
                response = {
                    isValid: false,
                    error: error.message || 'Token validation failed',
                };
            }
        }

        return {
            isValid: response.isValid,
            user: response?.user,
            error: response?.error,
            correlationId: message.data.correlationId,
            token: message.data.token,
        };
    }
}
