import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { APP_CONFIG } from '../config/default.config';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { getModelForClass } from '@typegoose/typegoose';

// Create a Mongoose schema from the Typegoose model
const UserModel = getModelForClass(User);

@Module({
    imports: [
        MongooseModule.forRoot(APP_CONFIG.MONGO_URI),
        MongooseModule.forFeature([
            {
                name: 'User', 
                schema: UserModel.schema
            }
        ])
    ],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}
