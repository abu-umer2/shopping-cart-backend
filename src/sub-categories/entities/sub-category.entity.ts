import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from 'src/categories/entities/category.entity';

export type SubCategoryDocument = SubCategory & Document & { _id: Types.ObjectId };

@Schema()
export class SubCategory {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;
  

  
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
