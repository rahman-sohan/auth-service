import { Controller, Get } from '@nestjs/common';

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
