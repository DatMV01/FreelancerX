import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateGigRatingDto {
  @AutoMap()
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'The unique identifier of the gig being rated',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  gigId: string;

  @AutoMap()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'The unique identifier of the order being rated',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  orderId: string;

  @AutoMap()
  @IsNumber()
  @Min(1)
  @Max(5)
  @ApiProperty({
    description: 'Rating score from 1 to 5',
    example: 3,
    minimum: 1,
    maximum: 5,
  })
  rating: number;

  @AutoMap()
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User review comment about the gig',
    example: 'Great service and fast delivery!',
  })
  comment: string;
}
