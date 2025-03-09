import { BaseDto } from 'src/modules/base/dto/base.dto';
import { GigStatus } from '../enum/gig.status';
import { UserDto } from 'src/modules/users/dto/user.dto';

export interface PricingPackage {
  name: string;
  description: string;
  price: number;
  deliveryTime: number;
  revisions: number;
  extras?: { package: string; value: string }[];
}

export interface Media {
  thumbnail: string;
  gallery: string[];
  video?: string;
}

export interface Requirement {
  type: 'text' | 'file' | 'multiple_choice';
  question: string;
  options?: string[];
  required: boolean;
}

export interface FAQ {
  question: string;
  aswer: string;
}

export class GigDto extends BaseDto<GigDto> {
  constructor(partial: Partial<GigDto>) {
    super(partial);
    this.title = partial.title ?? '';
    this.category = partial.category ?? '';
    this.subCategory = partial.subCategory ?? '';
    this.nestedSubcategory = partial.nestedSubcategory ?? '';
    this.requirements = partial.requirements ?? [];
    this.tags = new Set(partial.tags ?? []);
  }

  id: string;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  nestedSubcategory: string;
  tags: Set<string>;
  language?: string;
  seller: UserDto;
  status: GigStatus = GigStatus.DRAFT;

  pricing?: {
    basic: PricingPackage;
    standard?: PricingPackage;
    premium?: PricingPackage;
  };

  media: Media;
  requirements: Requirement[];
  rating = { average: 0, count: 0 };
  popularity = 0;
  isFeatured = false;
  isPromoted = false;
  views = 0;
  ordersCompleted = 0;
}
