import { SessionDto } from 'src/modules/session/dto/session.dto';

export type JwtRefreshPayloadType = {
  sessionId: SessionDto['id'];
  hash: SessionDto['hash'];
  iat: number;
  exp: number;
};
