import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Explicitly define the structure including MongoDB's _id field
export interface UserDocument extends Document, User {
    _id: Types.ObjectId;
}

@Schema({ timestamps: true, collection: 'users' })
export class User {
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
UserSchema.index({ email: 1 }, { unique: true });