import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateRatingDto {
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
  @IsString()
  @AutoMap()
  message: string;
}
