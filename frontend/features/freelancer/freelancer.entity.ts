import { BaseEntity } from "@/dto/base/base.entity";
import { GigEntity } from "../gig/gig.entity";

export interface FreelancerEntity extends BaseEntity {
  id: string;

  email: string;

  avatar: string;

  country: string;

  phone: string;

  displayName: string;

  userId: string;

  user: any;

  level: FreelancerRankEnum;

  bio?: string;

  freelancersLanguages?: any[] | string[];

  freelancersSkills?: any[] | string[];

  languages: any[];

  skills: any[];

  gigs: GigEntity[];

  orders: any[];

  reviews: any[];

  wallet: any;
}
