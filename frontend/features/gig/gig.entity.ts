import { BaseEntity } from "@/dto/base/base.entity";
import { UserEntity } from "../user/user.entity";

export interface GigTagEntity {
  id: string;
  name: string;
}

export interface GigEntity extends BaseEntity {
  id: string;
  title: string;

  categoryId: string;
  category: string;

  subCategoryId: string;
  subCategory: any;

  nestedSubcategoryId: string;
  nestedSubcategory: any;

  freelancerId: string;
  freelancer: any;

  tags: GigTagEntity[];

  /**== FavoriteGigs ==*/
  users: UserEntity[];

  /** Pricing */
  basicPrice: number;
  standardPrice: number;
  premiumPrice: number;
  packages: any[];
  pricingPackage: any[];

  /** Description & FAQ */
  description: string;
  faqs: any[];

  /** Gallery */
  thumbnail: any | null;
  images: any | null;
  documents: any | null;
  video: any;

  /** Status */
  status: any;

  /** Reviews */
  reviews: any[];

  /** Statistics */
  ratingAverage: number;
  ratingCount: number;
  viewCount: number;
  favoriteCount: number;
  completeOrderCount: number;
  orderCount: number;

  /** Others */
  userId: string;
  orders: any[];

  slug: string;
}
