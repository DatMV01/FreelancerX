import { BaseEntity } from "@/dto/base/base.entity";
import { GigEntity } from "../gig/gig.entity";

export interface CategoryEntity extends BaseEntity {
  id: string;

  parentId: string;

  parentCategory: CategoryEntity;

  subCategories: CategoryEntity[];

  title: string;

  icon: string;

  description: string;

  slogan: string;

  slug: string;

  url: string;

  gigs: GigEntity[];
}
