import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateGigReviewDto {
  @AutoMap()
  @IsNotEmpty()
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
    description: 'The unique identifier of the user giving the rating',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  reviewerId: string;

  @AutoMap()
  @IsNumber()
  @Min(1)
  @Max(5)
  @ApiProperty({
    description: 'Rating score from 1 to 5',
    example: 3.5,
    minimum: 1,
    maximum: 5,
  })
  rating: number;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User review comment about the gig',
    example: 'Great service and fast delivery!',
  })
  comment: string;
}
