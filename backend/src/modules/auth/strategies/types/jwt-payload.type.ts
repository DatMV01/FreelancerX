import { SessionDto } from 'src/modules/session/dto/session.dto';
import { UserDto } from 'src/modules/users/dto/user.dto';

export type JwtPayloadType = Pick<UserDto, 'id' | 'role'> & {
  sessionId: SessionDto['id'];
  iat: number;
  exp: number;
};
