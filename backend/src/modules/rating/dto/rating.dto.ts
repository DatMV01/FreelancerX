import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { BaseDto } from 'src/modules/base/dto/base.dto';
import { RatingReplyDto } from './rating-reply.dto';
import { AutoMap } from '@automapper/classes';

export class RatingDto extends BaseDto<RatingDto> {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @AutoMap()
  gigId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @AutoMap()
  userId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(5)
  @AutoMap()
  rateNumber: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @AutoMap()
  message: string;

  @ApiProperty()
  @IsOptional()
  @AutoMap()
  ratingReply?: RatingReplyDto;
}
