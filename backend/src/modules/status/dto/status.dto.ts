import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from 'src/modules/base/dto/base.dto';

export class StatusDto extends BaseDto<StatusDto> {
  @AutoMap()
  @ApiProperty({ description: 'Unique identifier of the status', example: 1 })
  id: number;

  @AutoMap()
  @ApiPropertyOptional({
    description: 'The name of the status',
    example: 'Active',
  })
  name?: string;

  @AutoMap()
  @ApiPropertyOptional({
    description: 'A brief description of the status',
    example: 'This status indicates active users',
  })
  description?: string;
}
