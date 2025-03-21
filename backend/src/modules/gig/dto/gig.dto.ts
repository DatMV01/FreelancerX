import { BaseDto } from 'src/modules/base/dto/base.dto';
import { GigStatus } from '../enum/gig.status';
import { UserDto } from 'src/modules/users/dto/user.dto';
import { AutoMap } from '@automapper/classes';
import { CategoryDto } from 'src/modules/category/dto/category.dto';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { RatingDto } from 'src/modules/rating/dto/rating.dto';
import { RatingEntity } from 'src/modules/rating/entities/rating.entity';
import { Transform, TransformationType } from 'class-transformer';
import { SellerDto } from 'src/modules/seller/dto/seller.dto';

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

  @AutoMap(() => String)
  tags: string[];

  /* Pricing */
  @AutoMap()
  basicPrice: number;

  @AutoMap()
  standardPrice: number;

  @AutoMap()
  premiumPrice: number;

  @AutoMap(() => PricingPackage)
  pricing: PricingPackage[];
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
  ordersCount: number;

  @AutoMap()
  avgRating: number;

  @AutoMap()
  totalReviews: number;

  @AutoMap()
  views: number;

  @AutoMap(() => SellerDto)
  seller: SellerDto;

  @AutoMap()
  slug: string;
}
