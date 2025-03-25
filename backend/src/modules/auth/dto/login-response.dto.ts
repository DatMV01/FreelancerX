import { UserDto } from 'src/modules/user/dto/user.dto';

export class LoginResponseDto {
  accessToken: string;

  refreshToken: string;

  accessExpires: number;

  refreshExpires: number;

  user: UserDto;
}
