import { BaseEntity } from "@/dto/base/base.entity";
import { OrderEntity } from "../order/order.entity";
import { GigEntity } from "../gig/gig.entity";

export interface UserEntity extends BaseEntity {
  id: string;
  email: string;

  password: string;

  provider: any;
  fullName: string;
  country?: string;
  avatar?: string;
  phone?: string;

  roleId?: number;
  role: any;

  statusId?: number;
  status: any;

  freelancer?: any;
  wallet?: any;

  buyerorders: OrderEntity[];
  reviews: any[];
  notifications: any[];
  transactions: any[];
  favoriteGigs: GigEntity[];
}
