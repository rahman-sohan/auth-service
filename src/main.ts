import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', credentials: true });
    app.setGlobalPrefix('api/v1/auth');

    app.enableCors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', credentials: true });
    app.setGlobalPrefix('api/v1/auth');

    await app.listen(process.env.PORT ?? 3000);
    console.log(`''''''''''Auth Service is running on port ${process.env.PORT ?? 3000}'''''''''`);
}
bootstrap();
