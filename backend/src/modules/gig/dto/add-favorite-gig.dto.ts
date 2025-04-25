import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class AddFavoriteGigDto {
  @AutoMap()
  @IsUUID()
  @ApiProperty({ required: false })
  gigId?: string;
}
