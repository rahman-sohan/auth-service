import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './entities/user.entity';
import { Types, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DatabaseService {
    constructor(
        @InjectModel(User.name, 'auth-service') private readonly userModel: Model<UserDocument>,
    ) {}

    async createNewUser(userData: Partial<User>): Promise<UserDocument> {
        const newUser = new this.userModel(userData);
        
        const savedUser = await newUser.save();
        return savedUser;
    }

    async findUserById(id: string): Promise<UserDocument> {
        const user = await this.userModel.findById(new Types.ObjectId(id));
        
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async updateUser(id: string, userData: Partial<User>): Promise<UserDocument> {
        const updatedUser = await this.userModel.findByIdAndUpdate(
            new Types.ObjectId(id),
            { $set: userData },
            { new: true },
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

    async findUserByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email });
    }

    async findAllUsers(): Promise<UserDocument[]> {
        return this.userModel.find();
    }
}
