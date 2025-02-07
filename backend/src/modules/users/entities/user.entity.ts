import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import { NotificationEntity } from 'src/modules/notification/entities/notification.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { ReviewEntity } from 'src/modules/review/entities/review.entity';
import { RoleEntity } from 'src/modules/roles/entities/role.entity';
import { StatusEntity } from 'src/modules/status/entities/status.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'user',
})
export class UserEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ type: String, unique: true, nullable: true })
  email: string | null;

  @AutoMap()
  @Column({ nullable: true })
  password?: string;

  @AutoMap()
  @Column({ default: 'email' })
  provider: string;

  @AutoMap()
  @Index()
  @Column({ type: String, nullable: true })
  socialId?: string | null;

  @AutoMap()
  @Index()
  @Column({ type: String, nullable: true })
  firstName: string | null;

  @AutoMap()
  @Index()
  @Column({ type: String, nullable: true })
  lastName: string | null;

  @AutoMap()
  @Column({ type: String, nullable: true })
  photo?: string | null;

  @AutoMap()
  @ManyToOne(() => RoleEntity, {
    eager: true,
  })
  role?: RoleEntity;

  @AutoMap()
  @ManyToOne(() => StatusEntity, {
    eager: true,
  })
  status?: StatusEntity;

  @OneToMany(() => GigEntity, (gig) => gig.seller)
  gigs: GigEntity[];

  @OneToMany(() => OrderEntity, (order) => order.buyer)
  orders: OrderEntity[];

  @OneToMany(() => OrderEntity, (order) => order.seller)
  sellerOrders: OrderEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.buyer)
  reviews: ReviewEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];
}
