import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  _id: MongooseSchema.Types.ObjectId;
  @Prop({
    type: String,
    trim: true,
  })
  name: string;
  @Prop({
    type: String,
    trim: true,
  })
  paternalSurname: string;
  @Prop({
    type: String,
    trim: true,
  })
  maternalSurname: string;
  @Prop({
    type: String,
    trim: true,
    unique: true,
    index: true,
  })
  phoneNumber: string;
  @Prop({
    type: String,
    trim: true,
    unique: true,
    index: true,
  })
  email: string;
  @Prop({
    type: String,
    trim: true,
    unique: true,
    index: true,
  })
  userName: string;
  @Prop({
    type: String,
    trim: true,
  })
  password: string;
  @Prop({
    type: [String],
    trim: true,
  })
  rol: string[];
  @Prop({
    type: Boolean,
    default: false,
    index: true,
  })
  isDeleted: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  isVerified: boolean;
  @Prop({
    type: Date,
  })
  createdAt: Date;
  @Prop({
    type: Date,
  })
  uddatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
