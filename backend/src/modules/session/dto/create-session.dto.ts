import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsString()
  user: string;

  @IsNotEmpty()
  @IsString()
  hash: string;
}
