import { Transform } from 'class-transformer';
import { BaseDto } from 'src/modules/base/dto/base.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export class SessionDto extends BaseDto<SessionDto> {
  @Transform(({ value, obj }) => {
    if (value instanceof UserEntity) {
      const { id, email } = value;
      return { id, email };
    }

    return value;
  })
  user: UserDto;

  hash: string;
}
