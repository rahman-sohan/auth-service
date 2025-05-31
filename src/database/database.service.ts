import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './entities/user.entity';
import { Types, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DatabaseService {
    constructor(
        @InjectModel(User.name, 'auth-service') private readonly userModel: Model<UserDocument>,
    ) {}

    async createNewUser(userData: Partial<User>): Promise<User> {
        const user = await this.userModel.create(userData);
        return user;
    }

    async findUserById(id: string): Promise<User> {
        const user = await this.userModel.findById(new Types.ObjectId(id));
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async updateUser(id: string, userData: Partial<User>): Promise<User> {
        const updatedUser = await this.userModel.findByIdAndUpdate(
            new Types.ObjectId(id),
            { $set: userData },
            { new: true }
        );
        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }
        return updatedUser;
    }

    async deleteUser(id: string): Promise<void> {
        const result = await this.userModel.findByIdAndDelete(new Types.ObjectId(id));
        if (!result) {
            throw new NotFoundException('User not found');
        }
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email });
    }

    async findAllUsers(): Promise<User[]> {
        return this.userModel.find();
    }
}
