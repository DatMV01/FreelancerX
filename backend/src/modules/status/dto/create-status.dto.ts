import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStatusDto {
  @AutoMap()
  @IsNotEmpty()
  @ApiProperty({ description: 'The name of the status', example: 'Active' })
  name: string;

  @AutoMap()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'A brief description of the status',
    example: 'This status indicates active users',
  })
  description?: string;
}
