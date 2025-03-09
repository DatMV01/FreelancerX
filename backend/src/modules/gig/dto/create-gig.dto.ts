import { GigStatus } from '../enum/gig.status';
import { Media, PricingPackage, Requirement } from './gig.dto';

export class CreateGigDto {
  id: string;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  nestedSubcategory: string;
  tags: Set<string>;
  language?: string;
  sellerId: string;
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
