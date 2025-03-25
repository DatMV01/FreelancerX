import { AutoMap } from '@automapper/classes';
import { BaseDto } from 'src/modules/base/dto/base.dto';

export class StatusDto extends BaseDto<StatusDto> {
  @AutoMap()
  id: number;

  @AutoMap()
  name?: string;

  @AutoMap()
  description?: string;
}
