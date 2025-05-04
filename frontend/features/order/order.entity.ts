import { BaseEntity } from "@/dto/base/base.entity";
import { OrderStatus } from "./dto";

export interface OrderEntity extends BaseEntity {
  id: string;

  orderNo: string;

  buyerId: string;

  buyer: any;

  freelancerId: string;

  freelancer: any;

  gigId: string;

  gig: any;

  packageId: string;

  package: any;

  currency: string;

  price: number;

  quantity: number;

  totalAmount: number;

  deliveryTime: number; // days

  status: OrderStatus;

  snapshot: any;

  transactions: any[];

  orderlogs: any[];

  orderQuestionsAnswers: any[];

  deliverables: any[];

  review: any;

  startDate: Date;

  endDate: Date;

  action: string;
}
