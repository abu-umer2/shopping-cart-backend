import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export class Address {
  
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  zipCode: string;

  @Prop({ required: true, default: 'US' })
  country: string;
}

export type UserDocument = User & Document;

@Schema({
  timestamps: true, 
  collection: 'users' 
})
export class User {
  _id?: Types.ObjectId;

  @Prop({ required: true, unique: true,}) 
  username: string;
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true, select: false }) 
  password: string; 

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ default: null })
  phoneNumber: string;
  @Prop({ type: String, enum: ['customer', 'admin'], default: 'customer', index: true }) 
  role: string;

  @Prop({ type: [Address], default: [] })
  shippingAddresses: Address[];

  @Prop({ type: [Types.ObjectId], default: [], ref: 'Product' })
  favoriteProducts: Types.ObjectId[]; 

 
}

export const UserSchema = SchemaFactory.createForClass(User);