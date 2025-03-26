import { SessionDto } from 'src/modules/session/dto/session.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';

export type JwtAccessPayloadType = Pick<UserDto, 'id' | 'email'> & {
  role: string;
  sessionId: SessionDto['id'];
  iat: number;
  exp: number;
};
