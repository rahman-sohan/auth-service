import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [AuthModule, DatabaseModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
