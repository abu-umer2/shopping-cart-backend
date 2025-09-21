import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { Category } from "src/categories/entities/category.entity";
import { SubCategory } from "src/sub-categories/entities/sub-category.entity";

export type ProductDocument = Product & Document
@Schema()
export class Product {
    @Prop({ required: true })
    name:string
    @Prop({ required: true })
    description:string
    @Prop({ required: true })
    price:string
    @Prop({ required: true })
    images:[string]
    @Prop()
    review:string
    
    @Prop({ type: [{ type: Types.ObjectId, ref: Category.name }] })
    categoriesId: Types.ObjectId[];
   
  
    @Prop({ type: Types.ObjectId, ref: SubCategory.name,required: true })
    subCategoriesId: Types.ObjectId[];
 }

 export const ProductSchema = SchemaFactory.createForClass(Product)