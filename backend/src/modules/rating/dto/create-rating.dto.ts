import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min
} from 'class-validator';

export class CreateRatingDto {
  @AutoMap()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  gigId: string;

  @AutoMap()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  userId: string;

  @AutoMap()
  @IsNumber()
  @Min(1)
  @Max(5)
  @ApiProperty()
  rateNumber: number;

  @AutoMap()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  comment: string;
}
