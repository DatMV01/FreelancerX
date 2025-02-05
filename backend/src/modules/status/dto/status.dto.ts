import { AutoMap } from '@automapper/classes';
import { Allow } from 'class-validator';
import { BaseDto } from 'src/modules/base/dto/base.dto';

export class StatusDto extends BaseDto<StatusDto> {
  @Allow()
  @AutoMap()
  name?: string;

  @Allow()
  @AutoMap()
  description?: string;
}
