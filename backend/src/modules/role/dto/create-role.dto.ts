import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @AutoMap()
  @IsNotEmpty()
  @ApiProperty({ description: 'The name of the role', example: 'Admin' })
  name: string;

  @AutoMap()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'A brief description of the role',
    example: 'System administrator',
  })
  description?: string;
}
