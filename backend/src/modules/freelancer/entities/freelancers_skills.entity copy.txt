import { AutoMap } from '@automapper/classes';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FreelancerEntity } from './freelancer.entity';
import { ApiProperty } from '@nestjs/swagger';
import { FreelancerSkillProficiency } from '../enum/freelancer.enum';

@Entity('skill')
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

  //   @ManyToMany(() => FreelancerEntity, (freelancer) => freelancer.skills)
  //   //Nếu xóa một ngôn ngữ, freelancer vẫn không bị ảnh hưởng (vì không có onDelete: 'CASCADE' bên FreelancerLanguageEntity).
  //   freelancers: FreelancerEntity[];

  @AutoMap(() => [FreelancersSkills])
  @OneToMany(() => FreelancersSkills, (freelancer) => freelancer.skill, {
    cascade: true,
  })
  freelancers?: FreelancersSkills[];
}

@Entity('freelancers_skills')
@Index(['freelancerId', 'skillId'], { unique: true })
export class FreelancersSkills {
  @Index()
  @PrimaryColumn({ type: 'char', length: 36, name: 'freelancer_id' })
  freelancerId: string;

  @Index()
  @PrimaryColumn({ type: 'int', name: 'skill_id' })
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
