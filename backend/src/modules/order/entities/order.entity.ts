import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TransactionEntity } from 'src/modules/transaction/entities/transaction.entity';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { AutoMap } from '@automapper/classes';
import { GigReviewEntity } from 'src/modules/gigreview/entities/gigreview.entity';
import { OrderLogEntity } from './orderLog.entity';
import { PackageEntity } from 'src/modules/gig/entities/package.entity';
import { OrderQuestionsAnswersEntity } from './orderQA.entity';

export enum OrderStatus {
  UNPAID = 'UNPAID', // 🟥 Đơn hàng chưa được thanh toán
  PENDING = 'PENDING', // 🟡 Đơn hàng đã được tạo, đang chờ freelancer chấp nhận
  ACCEPTED = 'ACCEPTED', // 🟢 Freelancer đã chấp nhận đơn, chuẩn bị bắt đầu
  IN_PROGRESS = 'IN_PROGRESS', // 🔨 Freelancer đang thực hiện đơn hàng
  REVISION_REQUESTED = 'REVISION_REQUESTED', // 🔄 Buyer yêu cầu chỉnh sửa/giao lại
  DELIVERED = 'DELIVERED', // 📦 Freelancer đã gửi sản phẩm (chờ buyer phản hồi)
  COMPLETED = 'COMPLETED', // ✅ Đơn hàng đã hoàn tất (buyer xác nhận hoặc tự động sau thời gian)

  // PENDING = 'PENDING',
  // PAID = 'PAID',
  // IN_PROGRESS = 'IN_PROGRESS',
  // DELIVERED = 'DELIVERED',
  // COMPLETED = 'COMPLETED',
  // CANCELED = 'CANCELED',
  // REFUNDED = 'REFUNDED',
}

@Entity('orders')
export class OrderEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /* BUYER */
  @AutoMap()
  @Column({ name: 'buyer_id', nullable: true })
  buyerId: string;

  @AutoMap(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.buyerorders, {
    onDelete: 'SET NULL', // Nếu user bị xóa, đơn hàng vẫn tồn tại nhưng buyer_id sẽ thành NULL
  })
  @JoinColumn({ name: 'buyer_id' })
  buyer: UserEntity;

  /* FREELANCER */
  @AutoMap()
  @Column({ name: 'freelancer_id', nullable: true })
  freelancerId: string;

  @AutoMap(() => FreelancerEntity)
  @ManyToOne(() => FreelancerEntity, (freelancer) => freelancer.orders, {
    onDelete: 'SET NULL', // Freelancer bị xóa, order vẫn còn
  })
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: FreelancerEntity;

  /* GIG */
  @AutoMap()
  @Column({ name: 'gig_id', nullable: true })
  gigId: string;

  @AutoMap(() => GigEntity)
  @ManyToOne(() => GigEntity, (gig) => gig.orders, {
    onDelete: 'SET NULL', // Gig bị xóa, order vẫn còn nhưng gig_id thành NULL
  })
  @JoinColumn({ name: 'gig_id' })
  gig: GigEntity;

  /* PACKAGE */
  @AutoMap()
  @Column({ name: 'package_id', nullable: true })
  packageId: string;

  @AutoMap(() => PackageEntity)
  @ManyToOne(() => PackageEntity, (_) => _.orders, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'package_id' })
  package: PackageEntity;

  @AutoMap()
  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @AutoMap()
  @Column('int')
  price: number;

  @AutoMap()
  @Column('int')
  quantity: number;

  @AutoMap()
  @Column('int')
  totalAmount: number;

  @AutoMap()
  @Column('json', { nullable: true })
  requirements: any; // info bổ sung nếu cần

  @AutoMap()
  @Column()
  deliveryTime: number; // days

  @AutoMap(() => Date)
  expectedDeliveryDate: Date;

  @AutoMap()
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'json', nullable: true })
  snapshot: any;

  // @AutoMap(() => TransactionEntity)
  // @OneToOne(() => TransactionEntity, (transaction) => transaction.order, {
  //   cascade: true,
  //   eager: true,
  // })
  // @JoinColumn()
  // transaction: TransactionEntity;

  @AutoMap(() => [TransactionEntity])
  @OneToMany(() => TransactionEntity, (transaction) => transaction.order, {
    //   eager: true,
  })
  transactions: TransactionEntity[];

  @AutoMap(() => [OrderLogEntity])
  @OneToMany(() => OrderLogEntity, (log) => log.order)
  orderlogs: OrderLogEntity[];

  @AutoMap(() => [OrderQuestionsAnswersEntity])
  @OneToMany(() => OrderQuestionsAnswersEntity, (_) => _.order, {
    eager: true,
  })
  orderQuestionsAnswers: OrderQuestionsAnswersEntity[];

  @AutoMap(() => [GigReviewEntity])
  @OneToOne(() => GigReviewEntity)
  review: GigReviewEntity;
}
