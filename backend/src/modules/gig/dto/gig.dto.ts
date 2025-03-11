import { BaseDto } from 'src/modules/base/dto/base.dto';
import { GigStatus } from '../enum/gig.status';
import { UserDto } from 'src/modules/users/dto/user.dto';
import { AutoMap } from '@automapper/classes';
import { CategoryDto } from 'src/modules/category/dto/category.dto';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class PricingPackage {
  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  price: number;

  @AutoMap()
  deliveryTime: number;

  @AutoMap()
  revisions: number;

  @AutoMap()
  extras?: { package: string; value: string }[];
}

export class Media {
  thumbnail: string;
  gallery: string[];
  video?: string;
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

export class Pricing {
  basic: PricingPackage;
  standard?: PricingPackage;
  premium?: PricingPackage;
}

export class GigDto extends BaseDto<GigDto> {
  @AutoMap()
  id: string;

  @AutoMap()
  title: string;

  @AutoMap()
  category: CategoryDto;

  @AutoMap()
  subCategory: CategoryDto;

  @AutoMap()
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

  @AutoMap(() => Pricing)
  pricing: Pricing;
  /* Pricing */

  /* Description & FAQ */
  @AutoMap()
  description: string;

  @AutoMap(() => FAQ)
  faqs: FAQ[];
  /* Description & FAQ */

  /* Gallery */
  @AutoMap(() => String)
  images: string[];

  @AutoMap()
  video: string;

  @AutoMap(() => String)
  documents: string[];
  /* Gallery */

  @AutoMap()
  status: GigStatus;

  @AutoMap()
  thumbnail?: string;

  @AutoMap(() => Requirement)
  requirements?: Requirement[];

  @AutoMap()
  avgRating: number;

  @AutoMap()
  totalReviews: number;

  @AutoMap()
  views: number;

  @AutoMap(() => UserDto)
  seller: UserDto;

  @AutoMap()
  slug: string;
}
