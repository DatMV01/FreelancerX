import { BaseDto } from "./base/base.dto";
import { v4 as uuidv4 } from "uuid";

export enum GigStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  DRAFT = "DRAFT",
  PAUSED = "PAUSED",
  REJECTED = "REJECTED",
  MODIFICATION = "MODIFICATION",
}

export interface Category {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  icon: string;
  description: string;
  slogan: string;
  slug: string;
  url: string;
}

export interface SubCategory extends Category {
  parentId: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface PricingPackage {
  id: number;
  package: string;
  basic: any;
  standard: any;
  premium: any;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface MediaItem {
  id: string;
  url: string;
  mimeType: string;
  provider: string;
}

export interface FreelancerLanguage {
  id: number;
  alpha3: string;
  name: string;
  proficiency: string;
}

export interface FreelancerSkill {
  id: number;
  name: string;
  proficiency: string;
}

export interface Freelancer {
  createdAt: string;
  id: string;
  email: string;
  country: string;
  userId: string;
  level: FreelancerRankEnum;
  bio: string;
  avatar: string;
  phone: string;
  fullName: string;
  freelancersLanguages: FreelancerLanguage[];
  freelancersSkills: FreelancerSkill[];
  reviewCount: number;
  completedOrderCount: number;
  responseTime: number;
  completedRate: number;
}

export interface Requirement {
  id: string;
  type: "text" | "file" | "multiple_choice";
  question: string;
  options?: string[];
  required: boolean;
}

export type Feature = {
  value: string;
  package: string;
};

export type GigPackage = {
  description: string;
  id: string;
  type: string;
  title: string;
  price: number;
  revisions: number;
  deliveryTime: number;
  features: Feature[];
};

export class GigDto extends BaseDto<GigDto> {
  constructor(partial: Partial<GigDto>) {
    super(partial);

    this.id = uuidv4();
    this.title = "";
    this.reviewCount = 0;
  }

  title!: string;
  category!: Category;
  subCategory!: SubCategory;
  nestedSubcategory!: SubCategory;
  tags!: Tag[];
  basicPrice!: string;
  standardPrice!: string;
  premiumPrice!: string;
  pricingPackage!: PricingPackage[];
  description!: string;
  reviewCount: number;
  faqs!: FAQ[];
  images!: {
    image1?: MediaItem;
    image2?: MediaItem;
    image3?: MediaItem;
  };
  documents!: {
    document1?: MediaItem;
    document2?: MediaItem;
  };
  video!: MediaItem;
  status!: string;
  thumbnail!: MediaItem;
  orderCount!: number;
  freelancer!: Freelancer;
  slug!: string;
  requirements: Requirement[] = [
    {
      id: "4bf5a8d2-3935-4064-bc5d-a631ca9e9fd1",
      question:
        "Do you have an idea of what you want? or should i surprise you?",
      type: "text",
      required: true,
    },
    {
      id: "9be68381-13b7-4353-9b38-5cc9a634041b",
      question: "Youu can attach the files you want me to do.",
      type: "file",
      required: false,
    },
  ];
  packages: GigPackage[] = [];
}

export enum FreelancerRankEnum {
  NEW = "NEW",
  LEVEL1 = "LEVEL1",
  LEVEL2 = "LEVEL2",
  LEVEL3 = "LEVEL3",
}

export enum FreelancerSkillProficiency {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
}

export enum FreelancerLanguageProficiency {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
  FLUENT = "Fluent",
}

export enum RoleEnum {
  ADMIN = 1,
  BUYER = 2,
  FREELANCER = 3,
  GUEST = 4,
  // REGISTERED = 5,
}
