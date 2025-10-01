import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  price: string;
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

  @IsOptional()
  @IsNumber()
  ratings?: number;

  @IsNotEmpty()
  @IsOptional()
  review: string;

  @IsNotEmpty()
  @IsMongoId()
  categoriesId: ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  subCategoriesId: ObjectId;
}
