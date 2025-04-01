import { UserDto } from 'src/modules/user/dto/user.dto';
import { JWTResponseDto } from './jwt-response.dto';

export class LoginResponseDto extends JWTResponseDto {
  user: UserDto;
}
