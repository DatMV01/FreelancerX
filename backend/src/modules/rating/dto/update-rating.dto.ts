import { AutoMap } from '@automapper/classes';
import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateRatingDto } from './create-rating.dto';

export class UpdateRatingDto extends PartialType(CreateRatingDto) {
  @AutoMap()
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  comment?: string;
}
