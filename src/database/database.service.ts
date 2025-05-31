import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class DatabaseService {
    constructor(
        @InjectModel(User.name) private readonly userModel: ReturnModelType<typeof User>,
    ) {}

    async createUser(userData: Partial<User>): Promise<User> {
        const user = await this.userModel.create(userData);
        return user;
    }

    async findAllUsers(): Promise<User[]> {
        return this.userModel.find();
    }
}
