import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  FreelancerLanguageProficiency,
  FreelancerSkillProficiency,
} from '../enum/freelancer.enum';

export class SkillDto {
  @AutoMap()
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  id: number;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @AutoMap()
  @IsNotEmpty()
  @IsEnum(FreelancerSkillProficiency)
  @ApiProperty()
  proficiency: FreelancerSkillProficiency;
}

export class LanguageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  @ApiProperty()
  @AutoMap()
  @IsNotEmpty()
  name: string;

  @AutoMap()
  @IsNotEmpty()
  @IsEnum(FreelancerLanguageProficiency)
  @ApiProperty()
  proficiency: FreelancerLanguageProficiency;
}

export class CreateFreelancerDto {
  @AutoMap()
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @AutoMap()
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId?: string;

  @AutoMap()
  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'freelancer@example.com',
    description: 'Freelancer email address',
  })
  email: string;

  @AutoMap()
  @IsString()
  country: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  avatar: string;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  phone: string;

  @AutoMap()
  @IsString()
  @ApiProperty({
    example: 'Experienced web developer specialized in JavaScript.',
    description: 'Freelancer biography',
  })
  bio: string;

  // @AutoMap(() => [String])
  // @IsOptional()
  // @ApiPropertyOptional({
  //   type: [String],
  //   example: ['JavaScript', 'React', 'Node.js'],
  //   description: 'List of skills the freelancer possesses',
  // })
  // skills?: string[];

  @AutoMap(() => [LanguageDto])
  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({
    type: [LanguageDto],
    example: [
      {
        id: 13,
        name: 'Bashkir',
        proficiency: 'Advanced',
      },
    ],
    description: 'Languages spoken by the freelancer',
  })
  languages: LanguageDto[];

  @AutoMap(() => [LanguageDto])
  @IsOptional()
  @IsArray()
  @ApiProperty({
    type: [SkillDto],
    example: [
      {
        id: 2,
        name: 'Full Stack Development',
        proficiency: 'Beginner',
      },
      {
        id: 1743661647610,
        name: 'ABC',
        proficiency: 'Beginner',
      },
    ],
    description: 'Skills possessed by the freelancer',
  })
  skills: SkillDto[];
}
