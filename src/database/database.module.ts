import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { APP_CONFIG } from '../config/default.config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';

@Module({
    imports: [
        MongooseModule.forRoot(APP_CONFIG.MONGO_URI, {
            connectionName: 'auth-service',
        }),
        MongooseModule.forFeature([
            { 
                name: User.name, 
                schema: UserSchema 
            }
        ], 'auth-service'),
    ],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}
