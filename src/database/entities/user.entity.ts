import { prop, modelOptions } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
    schemaOptions: {
        timestamps: true,
        collection: 'users'
    }
})

export class User {
    @prop({ type: () => Types.ObjectId, auto: true })
    _id: Types.ObjectId;

    @prop({ required: true })
    firstName: string;

    @prop({ required: true })
    lastName: string;

    @prop({ required: true, unique: true })
    email: string;

    @prop({ required: true })
    password: string;

    @prop({ default: false })
    isVerified: boolean;

    @prop({ default: 'user' })
    role: string;

    @prop()
    phoneNumber?: string;

    @prop()
    image?: string;

    @prop({ default: true })
    isActive: boolean;

    @prop()
    lastLogin?: Date;
}