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
    queue: 'token_validation_queue'
  })
  async handleTokenValidation(message: { token: string }) {
    this.logger.log('Received token validation request');
    
    if (!message || !message.token) {
      return { 
        isValid: false, 
        error: 'No token provided' 
      };
    }
    
    try {
      const validationResult = await this.authService.validateToken(message.token);
      return validationResult;
    } catch (error) {
      this.logger.error(`Token validation error: ${error.message}`);
      return { 
        isValid: false, 
        error: error.message || 'Token validation failed' 
      };
    }
  }
}
