import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
    constructor() {}

    @Get('/health-check')
    healthCheck(): any {
        return {
            status: 'ok',
            message: 'Auth Service is Up and Running!',
        };
    }
}
