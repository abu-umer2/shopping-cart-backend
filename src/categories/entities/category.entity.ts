import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SubCategory } from 'src/sub-categories/entities/sub-category.entity';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  isActive: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: SubCategory.name }] })
  subCategories: Types.ObjectId[];

  
}

export const CategorySchema = SchemaFactory.createForClass(Category);
