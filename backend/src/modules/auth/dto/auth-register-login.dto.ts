import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class AuthRegisterLoginDto {
  @Transform(lowerCaseTransformer)
  @IsString()
  identifier: string;

  @MinLength(6)
  password: string;

  // @IsNotEmpty()
  // firstName: string;

  // @IsNotEmpty()
  // lastName: string;

  @IsNotEmpty()
  fullName: string;
}
