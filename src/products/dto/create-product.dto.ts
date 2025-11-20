import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, IsArray } from 'class-validator';
import { ObjectId } from 'mongoose';
import { ProductType } from '../entities/product.entity';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
  @IsOptional()
  @IsNumber()
  stock?: number;
  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsEnum(ProductType)
  @IsOptional()
  productType?: ProductType;

  @IsOptional()
  @IsNumber()
  ratings?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageFiles?: string[];

  @IsOptional()
  review: string;

  @IsNotEmpty()
  @IsMongoId()
  categoriesId: ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  subCategoriesId: ObjectId;
}
