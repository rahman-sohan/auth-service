import { prop, modelOptions, index, Severity } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({ 
  schemaOptions: { 
    timestamps: true, 
    collection: 'users' 
  },
  options: {
    allowMixed: Severity.ALLOW,
    customName: 'User'
  }
})
@index({ email: 1 }, { unique: true })
export class User {
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
    
    _id?: Types.ObjectId;
}

export type UserDocument = User & { _id: Types.ObjectId };
