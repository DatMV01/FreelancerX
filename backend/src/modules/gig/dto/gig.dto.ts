import { BaseDto } from 'src/modules/base/dto/base.dto';
import { GigStatus } from '../enum/gig.status';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { AutoMap } from '@automapper/classes';
import { CategoryDto } from 'src/modules/category/dto/category.dto';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { RatingDto } from 'src/modules/rating/dto/rating.dto';
import { ReviewEntity } from 'src/modules/rating/entities/rating.entity';
import { Transform, TransformationType } from 'class-transformer';
import { FreelancerDto } from 'src/modules/freelancer/dto/freelancer.dto';
import { GigTagEntity } from '../entities/gig.entity';
import { PackageEntity } from '../entities/package.entity';

export class PricingPackage {
  @AutoMap()
  id: string;

  @AutoMap()
  package: string;

  @AutoMap()
  basic: string;

  @AutoMap()
  standard: string;

  @AutoMap()
  premium: string;
}

export class Requirement {
  @IsString()
  @AutoMap()
  id: string;

  @IsString()
  @AutoMap()
  type: 'text' | 'file' | 'multiple_choice';

  @IsString()
  @AutoMap()
  question: string;

  @IsOptional()
  @AutoMap()
  options?: string[];

  @IsBoolean()
  @AutoMap()
  required: boolean;
}

export class FAQ {
  @AutoMap()
  id: string;

  @AutoMap()
  question: string;

  @AutoMap()
  answer: string;
}

export class GigFileInfo {
  id: string;
  url: string;
}

export class GigImages {
  image1: GigFileInfo | null;
  image2: GigFileInfo | null;
  image3: GigFileInfo | null;
}

export class GigDocuments {
  document1: GigFileInfo | null;
  document2: GigFileInfo | null;
}

export class GigDto extends BaseDto<GigDto> {
  @AutoMap()
  id: string;

  @AutoMap()
  title: string;

  @AutoMap(() => CategoryDto)
  @Transform(({ value, key, obj, type, options }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return value?.slug || null;
    }
  })
  category: CategoryDto;

  @AutoMap(() => CategoryDto)
  @Transform(({ value, key, obj, type, options }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return value?.slug || null;
    }
  })
  subCategory: CategoryDto;

  @AutoMap(() => CategoryDto)
  @Transform(({ value, key, obj, type, options }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return value?.slug || null;
    }
  })
  nestedSubcategory?: CategoryDto;

  @AutoMap(() => [GigTagEntity])
  tags: string[];

  @AutoMap()
  reviewCount: number;

  /* Pricing */
  @AutoMap()
  basicPrice: number;

  @AutoMap()
  standardPrice: number;

  @AutoMap()
  premiumPrice: number;

  @AutoMap(() => [PackageEntity])
  packages: PackageEntity[];

  @AutoMap(() => PricingPackage)
  pricingPackage: PricingPackage[];
  /* Pricing */

  /* Description & FAQ */
  @AutoMap()
  description: string;

  @AutoMap(() => FAQ)
  faqs: FAQ[];
  /* Description & FAQ */

  /* Gallery */

  @AutoMap(() => GigImages)
  images: GigImages;

  @AutoMap(() => GigDocuments)
  documents: GigDocuments;

  @AutoMap(() => GigFileInfo)
  video: GigFileInfo;

  /* Gallery */

  @AutoMap()
  status: GigStatus;

  @AutoMap(() => GigFileInfo)
  thumbnail?: GigFileInfo | null;

  @AutoMap(() => Requirement)
  requirements?: Requirement[];

  @AutoMap()
  orderCount: number;

  @AutoMap(() => FreelancerDto)
  freelancer?: FreelancerDto | undefined;

  @AutoMap()
  slug: string;

  @AutoMap()
  ratingAverate: number;

  @AutoMap()
  ratingCount: number;
}
