import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';

@Entity('user_favorite_gigs')
export class UserFavoriteGigEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.favoriteGigLinks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  userId: string;

  @ManyToOne(() => GigEntity, (gig) => gig.favoritedByLinks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'gigId' })
  gig: GigEntity;

  @Column()
  gigId: string;

  @CreateDateColumn()
  createdAt: Date;
}
