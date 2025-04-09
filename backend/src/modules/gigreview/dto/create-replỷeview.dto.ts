import { IsString, MaxLength } from 'class-validator';

export class ReplyToReviewDto {
  @IsString()
  @MaxLength(1000)
  reply: string;
}
