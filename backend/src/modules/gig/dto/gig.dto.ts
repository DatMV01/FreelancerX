import { BaseDto } from 'src/modules/base/dto/base.dto';
import { GigStatus } from '../enum/gig.status';
import { UserDto } from 'src/modules/users/dto/user.dto';
import { AutoMap } from '@automapper/classes';
import { CategoryDto } from 'src/modules/category/dto/category.dto';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

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
