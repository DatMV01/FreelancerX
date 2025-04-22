import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { FreelancerSkillProficiency } from '../enum/freelancer.enum';
import { FreelancerEntity } from './freelancer.entity';

@Entity('skills')
export class SkillEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('increment')
  @ApiProperty()
  id: number;

  @AutoMap()
  @Column({ unique: true, type: 'varchar', length: 50 })
  @ApiProperty()
  name: string;

  @AutoMap()
  proficiency: FreelancerSkillProficiency;

  @AutoMap(() => [FreelancersSkills])
  @OneToMany(() => FreelancersSkills, (freelancer) => freelancer.skill, {
    cascade: true,
  })
  freelancers?: FreelancersSkills[];
}

@Entity('freelancer_skills')
@Index(['freelancerId', 'skillId'], { unique: true })
export class FreelancersSkills {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index()
  @Column({ type: 'char', length: 36, name: 'freelancer_id' })
  freelancerId: string;

  @Index()
  @Column({ type: 'int', name: 'skill_id' })
  skillId: number;

  @ManyToOne(
    () => FreelancerEntity,
    (freelancer) => freelancer.freelancersSkills,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: FreelancerEntity;

  @ManyToOne(() => SkillEntity, (skill) => skill.freelancers, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'skill_id' })
  skill: SkillEntity;

  @Column({
    type: 'enum',
    enum: FreelancerSkillProficiency,
    default: FreelancerSkillProficiency.BEGINNER,
  })
  proficiency: FreelancerSkillProficiency;
}
