

import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty()
  name: string;

  @IsEmail()
  isActive: boolean;

  @IsOptional()
  subCategories:[string]

}
