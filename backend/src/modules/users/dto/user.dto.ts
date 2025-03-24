import { AutoMap } from '@automapper/classes';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ADMIN_GROUP, ME_GROUP } from 'src/common/constant/serialize.group';
import { AuthProvidersEnum } from 'src/modules/auth/enum/auth-providers.enum';
import { BaseDto } from 'src/modules/base/dto/base.dto';
import { RoleDto } from 'src/modules/roles/dto/role.dto';
import { SellerDto } from 'src/modules/seller/dto/seller.dto';
import { StatusDto } from 'src/modules/status/dto/status.dto';

export class UserDto extends BaseDto<UserDto> {
  @AutoMap()
  identifier: string;

  @Expose({ groups: [ADMIN_GROUP, ME_GROUP], toPlainOnly: true })
  @AutoMap()
  password?: string;

  @AutoMap()
  email: string;

  @AutoMap()
  country: string;

  @AutoMap()
  provider: string = AuthProvidersEnum.email;

  @AutoMap()
  socialId?: string | null;

  @AutoMap()
  fullName: string;

  @AutoMap()
  sellerProfile: SellerDto;

  @AutoMap()
  avatar?: string | null;

  @AutoMap()
  phoneNumber?: string;

  @AutoMap(() => RoleDto)
  @Transform(({ value }) => value?.name || undefined)
  role: RoleDto;

  @AutoMap(() => StatusDto)
  @Transform(({ value }) => value?.name || undefined)
  status?: StatusDto;
}
