import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  price: string;

  @IsOptional()
  image?: string; 

  @IsNotEmpty()
  @IsOptional()
  review: string;

  @IsNotEmpty()
  @IsMongoId()
  categoriesId: ObjectId[];

  @IsNotEmpty()
  @IsMongoId()
  subCategoriesId: ObjectId[];
}
