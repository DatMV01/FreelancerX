import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { ADMIN_GROUP, ME_GROUP } from 'src/common/constant/serialize.group';
import { BaseDto } from 'src/modules/base/dto/base.dto';
import { GigDto } from 'src/modules/gig/dto/gig.dto';
import { OrderDto } from 'src/modules/order/dto/order.dto';
import {
  freelancerLanguagesTransformer,
  freelancerSkillsTransformer,
  undefinedTransformer,
} from 'src/utils/transformers/index.transformer';
import { FreelancerRankEnum } from '../enum/freelancer.enum';
import {
  FreelancersLanguages,
  LanguageEntity,
} from '../entities/freelancers_languages.entity';
import {
  FreelancersSkills,
  SkillEntity,
} from '../entities/freelancers_skills.entity';
import { RatingDto } from 'src/modules/rating/dto/rating.dto';
import { IsOptional } from 'class-validator';

export class FreelancerDto extends BaseDto<FreelancerDto> {
  @AutoMap()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Freelancer unique identifier',
  })
  id: string;

  @AutoMap()
  @ApiProperty({
    example: 'freelancer@example.com',
    description: 'Freelancer email address',
  })
  email: string;

  @AutoMap()
  country: string;

  @AutoMap()
  @ApiProperty({ description: 'ID của user' })
  userId: string;

  @AutoMap()
  @ApiProperty({
    example: FreelancerRankEnum.NEW,
    enum: FreelancerRankEnum,
    description: 'Freelancer level',
  })
  level: FreelancerRankEnum;

  @AutoMap()
  @ApiPropertyOptional({
    example: 'I am a professional web developer with 5 years of experience.',
    description: 'Brief introduction about the freelancer',
  })
  bio?: string;

  @AutoMap()
  avatar: string;

  @AutoMap()
  phone: string;

  @AutoMap()
  fullName: string;

  @AutoMap(() => [FreelancersLanguages])
  @Transform((params) => freelancerLanguagesTransformer(params))
  @ApiPropertyOptional({
    type: [LanguageEntity],
    example: [
      {
        id: 174,
        code: 'vi',
        name: 'Vietnamese',
      },
      {
        id: 180,
        code: 'yo',
        name: 'Yoruba',
      },
      {
        id: 183,
        code: 'zu',
        name: 'Zulu',
      },
    ],
    description: 'Languages spoken by the freelancer',
  })
  freelancersLanguages?: FreelancersLanguages[];

  @AutoMap(() => [FreelancersSkills])
  @Transform((params) => freelancerSkillsTransformer(params))
  @ApiPropertyOptional({
    type: [SkillEntity],
    example: [
      {
        id: 19,
        title: 'JavaScript',
      },
      {
        id: 20,
        title: 'TypeScript',
      },
    ],
    description: 'Skills possessed by the freelancer',
  })
  freelancersSkills?: FreelancersSkills[];

  @AutoMap()
  @ApiProperty({
    example: 4.8,
    description: 'Overall freelancer rating based on customer reviews',
  })
  rating: number;

  @AutoMap(() => [RatingDto])
  @ApiProperty({
    description: 'Danh sách đánh giá của freelancer',
    type: [RatingDto],
    required: false,
  })
  @IsOptional()
  ratings?: RatingDto[];

  @AutoMap()
  @ApiProperty({
    example: 120,
    description: 'Total number of reviews received',
  })
  reviewCount: number;

  @AutoMap()
  @ApiProperty({
    example: 50,
    description: 'Number of completed orders',
  })
  completedOrderCount: number;

  @AutoMap()
  @Transform((params) => undefinedTransformer(params))
  @ApiPropertyOptional({
    example: 24,
    description: 'Average response time in hours',
  })
  responseTime: number;

  @AutoMap()
  @Expose({ groups: [ADMIN_GROUP, ME_GROUP], toPlainOnly: true })
  @ApiProperty({
    example: 5000,
    description: 'Total earnings of the freelancer',
  })
  earnings: number;

  @AutoMap()
  @Expose({ groups: [ADMIN_GROUP, ME_GROUP], toPlainOnly: true })
  @ApiProperty({
    example: 2000,
    description: 'Total amount withdrawn by the freelancer',
  })
  withdrawnAmount: number;

  @AutoMap(() => [GigDto])
  @ApiPropertyOptional({
    type: [GigDto],
    description: 'List of gigs created by the freelancer',
  })
  gigs?: GigDto[];

  @AutoMap(() => [OrderDto])
  @ApiPropertyOptional({
    type: [OrderDto],
    description: 'List of orders associated with the freelancer',
  })
  orders?: OrderDto[];

  @AutoMap()
  completedRate: number;
}
