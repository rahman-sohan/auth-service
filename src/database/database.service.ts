import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './entities/user.entity';
import { Types } from 'mongoose';
import { getModelForClass } from '@typegoose/typegoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

const UserModel = getModelForClass(User);

@Injectable()
export class DatabaseService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<UserDocument>
    ) {}

    async createNewUser(userData: Partial<User>): Promise<UserDocument> {
        const newUser = new this.userModel(userData);
        const savedUser = await newUser.save();
        return savedUser as UserDocument;
    }

    async findUserById(id: string): Promise<UserDocument> {
        const user = await this.userModel.findById(new Types.ObjectId(id));

        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user as UserDocument;
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
        return updatedUser as UserDocument;
    }

    async deleteUser(id: string): Promise<void> {
        const result = await this.userModel.findByIdAndDelete(new Types.ObjectId(id));
        if (!result) {
            throw new NotFoundException('User not found');
        }
    }

    async findUserByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }) as Promise<UserDocument | null>;
    }

    async findAllUsers(): Promise<UserDocument[]> {
        return this.userModel.find() as Promise<UserDocument[]>;
    }
}
