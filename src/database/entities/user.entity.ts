import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = Document & User;

@Schema({
    timestamps: true,
    collection: 'users',
})
export class User {
    @Prop({ type: Types.ObjectId, auto: true })
    _id: Types.ObjectId;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: false })
    isVerified: boolean;

    @Prop({ default: 'user' })
    role: string;

    @Prop()
    phoneNumber?: string;

    @Prop()
    image?: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop()
    lastLogin?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
