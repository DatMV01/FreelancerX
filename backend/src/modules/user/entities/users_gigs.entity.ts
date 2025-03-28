import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { LanguageEntity } from 'src/modules/freelancer/entities/freelancers_languages.entity';
import { FreelancerProficiencyLevel } from 'src/modules/freelancer/enum/freelancer.enum';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';

@Entity('users_favorite_gigs')
@Index(['userId', 'gigId'], { unique: true })
export class UsersGigsEntity {
  @Index()
  @PrimaryColumn({ type: 'char', length: 36, name: 'user_id' })
  userId: string;

  @Index()
  @PrimaryColumn({ type: 'char', length: 36, name: 'gig_id' })
  gigId: string;

  @ManyToOne(() => UserEntity, (_) => _.favoriteGigs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  users: UserEntity;

  @ManyToOne(() => GigEntity, (_) => _.favoritedUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'gig_id' })
  gigs: GigEntity;
}
