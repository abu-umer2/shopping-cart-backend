import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
 

  @ApiProperty({
    description: 'The new quantity for the product in the cart. Set to 0 to remove.',
    example: 3,
    minimum: 0, 
  })
  @IsNumber()
  @Min(0)
  quantity: number;
}