import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { AllExceptionsFilter } from './errors/allException.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', credentials: true });
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
        forbidUnknownValues: true,
        stopAtFirstError: true,
    }));

    app.setGlobalPrefix('api/v1');
    app.startAllMicroservices();
    
    app.useGlobalFilters(new AllExceptionsFilter());

    await app.listen(process.env.PORT ?? 3000);
    console.log('----------------Auth Service---------------------');
    console.log('APP IS RUNNING ON PORT', process.env.PORT ?? 3000);
}

bootstrap();
