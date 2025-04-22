import { AutoMap } from '@automapper/classes';
import { Transform, TransformationType } from 'class-transformer';
import { BaseDto } from 'src/modules/base/dto/base.dto';
import { CategoryDto } from 'src/modules/category/dto/category.dto';
import { FreelancerDto } from 'src/modules/freelancer/dto/freelancer.dto';
import { GigTagEntity } from '../entities/gig.entity';
import { GigPackagesEntity } from '../entities/gig_packages.entity';
import { GigStatus } from '../enum/gig.status';

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

// export class Requirement {
//   @IsString()
//   @AutoMap()
//   id: string;

//   @IsString()
//   @AutoMap()
//   type: 'text' | 'file' | 'multiple_choice';

//   @IsString()
//   @AutoMap()
//   question: string;

//   @IsOptional()
//   @AutoMap()
//   options?: string[];

//   @IsBoolean()
//   @AutoMap()
//   required: boolean;
// }

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

  @AutoMap(() => [GigPackagesEntity])
  packages: GigPackagesEntity[];

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

  @AutoMap(() => GigFileInfo)
  thumbnail: GigFileInfo | null;

  @AutoMap(() => GigImages)
  images: GigImages;

  @AutoMap(() => GigDocuments)
  documents: GigDocuments;

  @AutoMap(() => GigFileInfo)
  video: GigFileInfo;

  @AutoMap()
  status: GigStatus;

  // @AutoMap(() => Requirement)
  // requirements?: Requirement[];

  @AutoMap(() => FreelancerDto)
  freelancer?: FreelancerDto | undefined;

  @AutoMap()
  slug: string;

  @AutoMap()
  ratingAverage: number;

  @AutoMap()
  ratingCount: number;

  @AutoMap()
  viewCount: number;

  @AutoMap()
  favoriteCount: number;

  @AutoMap()
  completeOrderCount: number;

  @AutoMap()
  orderCount: number;
}
