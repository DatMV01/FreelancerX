import { AutoMap } from '@automapper/classes';
import { BaseDto } from 'src/modules/base/dto/base.dto';

export class SupportDto extends BaseDto<SupportDto> {
  @AutoMap()
  id: string;

  @AutoMap()
  email: string;

  @AutoMap()
  subject: string;

  @AutoMap()
  message: string;

  @AutoMap()
  messageReply: string;
}
