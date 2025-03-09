import { BaseDto } from 'src/modules/base/dto/base.dto';
import { GigStatus } from '../enum/gig.status';
import { UserDto } from 'src/modules/users/dto/user.dto';
import { AutoMap } from '@automapper/classes';
import { CategoryDto } from 'src/modules/category/dto/category.dto';

export class PricingPackage {
  name: string;
  description: string;
  price: number;
  deliveryTime: number;
  revisions: number;
  extras?: { package: string; value: string }[];
}

export class Media {
  thumbnail: string;
  gallery: string[];
  video?: string;
}

export class Requirement {
  type: 'text' | 'file' | 'multiple_choice';
  question: string;
  options?: string[];
  required: boolean;
}

export class FAQ {
  question: string;
  aswer: string;
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

  searchTags?: string[];

  /* Pricing */
  @AutoMap()
  basicPrice: number;

  @AutoMap()
  standardPrice: number;

  @AutoMap()
  premiumPrice: number;

  @AutoMap()
  pricing: {
    basic: PricingPackage;
    standard?: PricingPackage;
    premium?: PricingPackage;
  };
  /* Pricing */

  /* Description & FAQ */
  @AutoMap()
  description: string;

  @AutoMap()
  faqs: FAQ[];
  /* Description & FAQ */

  /* Gallery */
  @AutoMap()
  images: string[];

  @AutoMap()
  video: string;

  @AutoMap()
  documents: string[];
  /* Gallery */

  @AutoMap()
  status: GigStatus;

  @AutoMap()
  thumbnail?: string;

  @AutoMap()
  requirements?: Requirement[];

  @AutoMap()
  avgRating: number;

  @AutoMap()
  totalReviews: number;

  @AutoMap()
  views: number;

  @AutoMap()
  seller: UserDto;
}
