import {
  AfterInsert,
  AfterUpdate,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { RatingEntity } from 'src/modules/rating/entities/rating.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { FreelancerRankEnum } from '../enum/freelancer.enum';
import {
  FreelancersLanguages,
  LanguageEntity,
} from './freelancers_languages.entity';
import { FreelancersSkills } from './freelancers_skills.entity';

@Entity('freelancer')
export class FreelancerEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column()
  email: string;

  @AutoMap()
  @Column({ nullable: true })
  avatar: string;

  @AutoMap()
  @Column({ nullable: true })
  country: string;

  @AutoMap()
  @Column({ nullable: true })
  phone: string;

  @AutoMap()
  @Column()
  fullName: string;

  @AutoMap()
  @Column({
    name: 'user_id',
    nullable: false,
    type: 'char',
    length: 36,
  })
  userId: string;

  @AutoMap(() => UserEntity)
  @OneToOne(() => UserEntity, (user) => user.freelancer, {
    // eager: true,
    onDelete: 'CASCADE', //  Nếu user bị xóa, freelancer cũng bị xóa theo.
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @AutoMap()
  @Column({
    type: 'enum',
    enum: FreelancerRankEnum,
    default: FreelancerRankEnum.NEW,
  })
  level: FreelancerRankEnum;

  @AutoMap()
  @Column({ type: 'text', nullable: true })
  bio?: string;

  @AutoMap(() => [FreelancersLanguages])
  @OneToMany(() => FreelancersLanguages, (language) => language.freelancer, {
    eager: true,
  })
  freelancersLanguages?: FreelancersLanguages[] | string[];

  @AutoMap(() => [FreelancersSkills])
  @OneToMany(() => FreelancersSkills, (skill) => skill.freelancer, {
    eager: true,
  })
  freelancersSkills?: FreelancersSkills[] | string[];

  @AutoMap(() => [LanguageEntity])
  languages: LanguageEntity[];

  @AutoMap(() => [LanguageEntity])
  skills: LanguageEntity[];

  @AutoMap(() => [CategoryEntity])
  @ManyToMany(() => CategoryEntity, (category) => category.freelancers, {
    onDelete: 'CASCADE', // Khi freelancer bị xóa, giá trị trong bảng trung gian sẽ xóa
  })
  @JoinTable({
    name: 'freelancers_categories',
    joinColumn: { name: 'freelancer_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories?: CategoryEntity[];

  @AutoMap(() => [RatingEntity])
  @OneToMany(() => RatingEntity, (rating) => rating.freelancer, {
    eager: false,
    onDelete: 'SET NULL',
  })
  ratings: RatingEntity[];

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  @Index('IDX_freelancer_completed_orders')
  completedOrderCount: number;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  @Index('IDX_freelancer_response_time')
  responseTime: number;

  @AutoMap()
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.0 })
  @Index('IDX_freelancer_rating')
  completedRate: number;

  @AutoMap()
  @Column({ type: 'bigint', default: 0 })
  earnings: number;

  @AutoMap()
  @Column({ type: 'bigint', default: 0 })
  withdrawnAmount: number;

  @AutoMap(() => [GigEntity])
  @OneToMany(() => GigEntity, (gig) => gig.freelancer, {
    eager: false,
    onDelete: 'NO ACTION',
  })
  gigs: GigEntity[];

  @AutoMap(() => [OrderEntity])
  @OneToMany(() => OrderEntity, (order) => order.freelancer, {
    eager: false,
    onDelete: 'NO ACTION',
  })
  orders: OrderEntity[];

  @AfterInsert()
  @AfterUpdate()
  afterInsertOrUpdate() {
    if (this.user?.email) {
      this.email = this.user.email;
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  beforeInsertOrUpdate() {
    if (this.user?.email) {
      this.email = this.user.email;
    }
  }
}
