// src/auth/dto/signup.dto.ts

import { IsString, IsEmail, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Define an enum for user roles to ensure valid input
enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export class SignUpDto {
  @ApiProperty({
    description: 'The unique email address of the user',
    example: 'newuser@example.com',
  })
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;

  @ApiProperty({
    description: 'The unique username',
    example: 'john',
  })
  @IsString({ message: 'Must be a valid username' })
  username: string;

  @ApiProperty({
    description: 'The user password (minimum 6, maximum 20 characters)',
    example: 'StrongP@ss123',
    minLength: 6,
    maxLength: 20,
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(20, { message: 'Password must be at most 20 characters long' })
  password: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'Alice',
  })
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Smith',
  })
  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  @ApiProperty({
    description: 'The role of the user (defaults to "customer" if not provided)',
    enum: UserRole,
    default: UserRole.CUSTOMER,
    required: false,
  })
  @IsEnum(UserRole, { message: 'Invalid user role' })
  @IsOptional() // Role can be optional, backend typically assigns default
  role?: UserRole;
}