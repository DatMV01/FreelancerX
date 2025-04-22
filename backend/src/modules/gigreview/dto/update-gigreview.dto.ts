import { AutoMap } from '@automapper/classes';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateGigReviewDto } from './create-gigreview.dto';

export class UpdateGigReviewDto extends PartialType(CreateGigReviewDto) {
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
