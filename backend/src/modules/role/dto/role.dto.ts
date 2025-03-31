import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from 'src/modules/base/dto/base.dto';

export class RoleDto extends BaseDto<RoleDto> {
  @AutoMap()
  @ApiProperty({ description: 'Unique identifier for the role', example: 1 })
  id: number;

  @AutoMap()
  @ApiProperty({ description: 'The name of the role', example: 'Admin' })
  name: string;

  @AutoMap()
  @ApiPropertyOptional({
    description: 'A brief description of the role',
    example: 'System administrator',
  })
  description?: string;
}
