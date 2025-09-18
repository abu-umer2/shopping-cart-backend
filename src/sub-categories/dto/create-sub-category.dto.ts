

import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSubCategoryDto {
    @IsNotEmpty()
  name: string;

  @IsEmail()
  isActive: boolean;

  @IsNotEmpty()
  categoryId: string;

}
