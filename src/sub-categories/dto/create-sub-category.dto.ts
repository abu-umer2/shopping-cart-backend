

import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSubCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  isActive: boolean;

  @IsNotEmpty()
  categoryId: string;
  @IsOptional()
  productsId: [string];


}
