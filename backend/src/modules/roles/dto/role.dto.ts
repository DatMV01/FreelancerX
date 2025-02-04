import { AutoMap } from '@automapper/classes';
import { BaseDto } from 'src/modules/base/dto/base.dto';

export class RoleDto extends BaseDto<RoleDto> {
  @AutoMap()
  name: string;

  @AutoMap()
  description?: string;
}
