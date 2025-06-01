import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { AuthService } from './auth.service';
import { MessagePatterns } from '../common/constants/message-patterns';

@Injectable()
export class AuthListener {
    constructor(private readonly authService: AuthService) {}

    private readonly logger = new Logger(AuthListener.name);

    @RabbitSubscribe({
        exchange: 'auth_service',
        routingKey: MessagePatterns.TOKEN_VALIDATION_REQUEST,
        queue: 'token_validation_queue',
    })
    async handleTokenValidation(message: {
        pattern: MessagePatterns.TOKEN_VALIDATION_REQUEST;
        data: { token: string };
    }) {
        console.log('Received token validation request', message);

        if (!message || !message.data || !message.data.token) {
            return {
                isValid: false,
                error: 'No token provided',
            };
        }

        try {
            const validationResult = await this.authService.validateToken(message.data.token);
            return validationResult;
        } catch (error) {
            console.error(`Token validation error: ${error.message}`);
            return {
                isValid: false,
                error: error.message || 'Token validation failed',
            };
        }
    }
}
