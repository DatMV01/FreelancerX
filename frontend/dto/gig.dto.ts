import { BaseDto } from "./base/base.dto";
import { v4 as uuidv4 } from "uuid";

export interface PricingPackage {
  id: string;
  package: string;
  basic: string;
  standard: string;
  premium: string;
}

export interface GigFileInfo {
  id: string;
  url: string;
}

export interface GigImages {
  image1: GigFileInfo | null;
  image2: GigFileInfo | null;
  image3: GigFileInfo | null;
}

export interface GigDocuments {
  document1: GigFileInfo | null;
  document2: GigFileInfo | null;
}

export interface Requirement {
  id: string;
  type: "text" | "file" | "multiple_choice";
  question: string;
  options?: string[];
  required: boolean;
}

export interface FAQ {
  question: string;
  aswer: string;
}

export enum GigStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  DRAFT = "DRAFT",
  PAUSED = "PAUSED",
  REJECTED = "REJECTED",
  MODIFICATION = "MODIFICATION",
}

export class GigDto extends BaseDto<GigDto> {
  constructor(partial: Partial<GigDto>) {
    super(partial);

    this.requirements = [
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
    this.id = uuidv4();
    this.title = "";
    this.seller = { id: null };
  }

  id: string;

  title: string;

  category?: string;

  subCategory?: string;

  nestedSubcategory?: string;

  /* Pricing */

  basicPrice: number = 0;

  standardPrice: number = 0;

  premiumPrice: number = 0;

  tags?: string[] = [];

  pricing?: PricingPackage[];
  /* Pricing */

  /* Description & FAQ */

  description?: string;

  faqs?: FAQ[];
  /* Description & FAQ */

  /* Gallery */

  images?: GigImages = {
    image1: null,
    image2: null,
    image3: null,
  };

  documents?: GigDocuments = {
    document1: null,
    document2: null,
  };

  video?: string;
  /* Gallery */

  status: GigStatus = GigStatus.DRAFT;

  thumbnail?: string;

  requirements?: Requirement[];

  avgRating?: number;

  totalReviews?: number;

  views?: number;

  seller: any;
}
