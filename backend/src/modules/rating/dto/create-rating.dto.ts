import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class CreateRatingDto {
  @Allow()
  @ApiProperty()
  gigId: string;

  @Allow()
  @ApiProperty()
  userId: string;

  @Allow()
  @ApiProperty()
  rating: number;

  @Allow()
  @ApiProperty()
  review?: string;
}
