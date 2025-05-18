import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from 'src/modules/base/dto/base.dto';

export class GigRatingDto extends BaseDto<GigRatingDto> {
  @AutoMap()
  @ApiProperty({
    description: 'The unique identifier of the gig being rated',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  gigId: string;

  @AutoMap()
  @ApiProperty({
    description: 'The unique identifier of the user who provided the rating',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @AutoMap()
  @ApiProperty({
    description: 'The unique identifier of the freelancer being rated',
    example: '987e6543-e21b-45d3-b123-654321abcdef',
  })
  freelancerId: string;

  @AutoMap()
  @ApiProperty({
    description: 'Rating score from 1 to 5',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  rateNumber: number;

  @AutoMap()
  @ApiProperty({
    description: 'User review comment about the gig',
    example: 'Great service and fast delivery!',
  })
  comment: string;

  @AutoMap()
  @ApiPropertyOptional({
    description: 'Freelancer’s reply to the review',
    example: 'Thank you for your feedback!',
    nullable: true,
  })
  reply?: string | null;

  @AutoMap(() => Date)
  @ApiPropertyOptional({
    description: 'Timestamp of when the freelancer replied',
    example: '2025-03-29T12:00:00Z',
    nullable: true,
  })
  replyAt?: Date;
}
