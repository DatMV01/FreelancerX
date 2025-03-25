import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class AuthEmailLoginDto {
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
