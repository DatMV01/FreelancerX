import { AutoMap } from '@automapper/classes';
import { Expose, Transform } from 'class-transformer';
import { ADMIN_GROUP, ME_GROUP } from 'src/common/constant/serialize.group';
import { AuthProvidersEnum } from 'src/modules/auth/enum/auth-providers.enum';
import { BaseDto } from 'src/modules/base/dto/base.dto';
import { RoleDto } from 'src/modules/roles/dto/role.dto';
import { StatusDto } from 'src/modules/status/dto/status.dto';

export class UserDto extends BaseDto<UserDto> {
  @AutoMap()
  email: string | null;

  @Expose({ groups: [ADMIN_GROUP, ME_GROUP], toPlainOnly: true })
  @AutoMap()
  password?: string;

  @AutoMap()
  provider: string = AuthProvidersEnum.email;

  @AutoMap()
  socialId?: string | null;

  @AutoMap()
  firstName: string | null;

  @AutoMap()
  lastName: string | null;

  @AutoMap()
  photo?: string | null;

  @AutoMap()
  @Transform(({ value }) => value.name)
  role?: RoleDto | null;

  @AutoMap()
  @Transform(({ value }) => value.name)
  status?: StatusDto;
}
