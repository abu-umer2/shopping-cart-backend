import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto, AddressDto } from './create-user.dto';
import {
  IsOptional,
  IsMongoId,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  shippingAddresses?: AddressDto[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true, message: 'Each favorite product must be a valid Mongo ID' })
  favoriteProducts?: string[];
}
