

import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty()
  name: string;

  @IsOptional()
  isActive: boolean;

  @IsOptional()
  subCategories: [string]
  @IsOptional()
  productsId: [string];

}
