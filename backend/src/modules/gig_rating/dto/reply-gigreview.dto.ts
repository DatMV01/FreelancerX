import { IsString, MaxLength } from 'class-validator';

export class ReplyTGigRatingDto {
  @IsString()
  @MaxLength(1000)
  reply: string;
}
