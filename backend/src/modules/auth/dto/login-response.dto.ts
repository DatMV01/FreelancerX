import { UserDto } from 'src/modules/users/dto/user.dto';

export class LoginResponseDto {
  accessToken: string;

  refreshToken: string;

  accessExpires: number;

  refreshExpires: number;

  user: UserDto;
}
