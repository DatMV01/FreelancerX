import { CreateRoleDto } from './create-role.dto';

import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  //     @AutoMap()
  //     @IsNotEmpty()
  //     @ApiProperty({ description: 'The name of the role', example: 'Admin' })
  //     name: string;
  //     @AutoMap()
  //     @IsOptional()
  //     @ApiPropertyOptional({
  //       description: 'A brief description of the role',
  //       example: 'System administrator',
  //     })
  //     description?: string;
}
