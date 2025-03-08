import { BaseDto } from "./base/base.dto";
import { v4 as uuidv4 } from "uuid";

export class Gig extends BaseDto<Gig> {
  constructor(partial: Partial<Gig>) {
    super(partial);

    this.requirements = [
      {
        question:
          "Do you have an idea of what you want? or should i surprise you?",
        type: "text",
        required: true,
      },
      {
        question: "Youu can attach the files you want me to do.",
        type: "file",
        required: false,
      },
    ];
    this.id = uuidv4();
    this.title = "";
    this.category = "";
    this.subCategory = "";
    this.nestedSubcategory = "";
  }

  title: string;
  description?: string;
  category: string;
  subCategory: string;
  nestedSubcategory: string;
  tags?: string[];
  language?: string;
  sellerId?: string;
  status: "active" | "paused" | "draft" | "pending" | "rejected" = "draft";
  pricing?: {
    basic: {
      name: string;
      description: string;
      price: number;
      deliveryTime: number;
      revisions: number;
      extras?: { package: string; value: string }[];
    };
    standard?: {
      name: string;
      description: string;
      price: number;
      deliveryTime: number;
      revisions: number;
      extras?: { package: string; value: string }[];
    };
    premium?: {
      name: string;
      description: string;
      price: number;
      deliveryTime: number;
      revisions: number;
      extras?: { package: string; value: string }[];
    };
  };

  media?: {
    thumbnail: string;
    gallery: string[];
    video?: string;
  };

  requirements?: {
    type: "text" | "file" | "multiple_choice";
    question: string;
    options?: string[];
    required: boolean;
  }[];

  rating: {
    average: number;
    count: number;
  } = {
    average: 0,
    count: 0,
  };

  popularity: number = 0;
  searchKeywords?: string[];
  isFeatured?: boolean = false;
  isPromoted?: boolean = false;
  views: number = 0;
  ordersCompleted: number = 0;
}
