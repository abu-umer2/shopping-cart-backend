import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';
import { Category } from "src/categories/entities/category.entity";
import { SubCategory } from "src/sub-categories/entities/sub-category.entity";
export enum ProductType {
    AVAILABLE = "available",
    BEST_SELLING = "best_selling",
    UPCOMING = "upcoming",
  }export type ProductDocument = Product & Document
@Schema()
export class Product {
    @Prop({ required: true })
    name:string
    @Prop({ required: true })
    description:string
    @Prop({ required: true })
    price:string
    @Prop()
    image:string
    @Prop()
    review:string
    @Prop()
    color: string; 
  
    @Prop()
    size: string; 
    @Prop({
        type: String,
        enum: ProductType,
        default: ProductType.AVAILABLE,
      })
      productType: ProductType;
    
    @Prop({ default: 0 })
    stock: number;
  
    @Prop({ default: 0 })
    ratings: number;
    
    @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
categoriesId: Types.ObjectId;

@Prop({ type: Types.ObjectId, ref: SubCategory.name })
subCategoriesId: Types.ObjectId;
 }

 export const ProductSchema = SchemaFactory.createForClass(Product)