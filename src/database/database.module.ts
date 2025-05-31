import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { APP_CONFIG } from '../config/default.config';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from './entities/user.entity';


@Module({
    imports: [
        TypegooseModule.forRootAsync({
            useFactory: () => ({
                uri: APP_CONFIG.MONGO_URI,
                connectionName: 'auth-service',
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }),
        }),
        TypegooseModule.forFeature([
            {
                typegooseClass: User,
                schemaOptions: {
                    collection: 'users',
                    timestamps: true,
                }
            }
        ], 'auth-service'),
    ],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}
