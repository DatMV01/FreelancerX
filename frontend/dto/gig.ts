import { BaseDto } from "./base/base.dto";

export class Gig extends BaseDto<Gig> {
  constructor(partial: Partial<Gig>) {
    super(partial);
  }

  title?: string;
  description?: string;
  category?: string;
  subCategory?: string;
  subSubCategory?: string;
  tags?: string[];
  language?: string;
  sellerId?: string;
  status?: "active" | "paused" | "draft" | "pending" | "rejected";
  pricing?: {
    basic: {
      price: number;
      deliveryTime: number;
      revisions: number;
      description: string;
      extras?: { title: string; price: number }[];
    };
    standard?: {
      price: number;
      deliveryTime: number;
      revisions: number;
      description: string;
      extras?: { title: string; price: number }[];
    };
    premium?: {
      price: number;
      deliveryTime: number;
      revisions: number;
      description: string;
      extras?: { title: string; price: number }[];
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
  isFeatured: boolean = false;
  isPromoted: boolean = false;
  views: number = 0;
  ordersCompleted: number = 0;
}
