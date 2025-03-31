import { AutoMap } from '@automapper/classes';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateRatingDto } from './create-rating.dto';

export class UpdateRatingDto extends PartialType(CreateRatingDto) {
  @AutoMap()
  @ApiPropertyOptional({
    description: "Freelancer's reply to the review",
    example: 'Thank you for your feedback!',
    nullable: true,
  })
  @IsString()
  @IsNotEmpty()
  reply?: string;
}
