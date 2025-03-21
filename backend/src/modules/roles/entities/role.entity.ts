import { AutoMap } from '@automapper/classes';
import { OmitType } from '@nestjs/mapped-types';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'role',
})
export class RoleEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @AutoMap()
  @Column()
  name?: string;

  @AutoMap()
  @Column({ nullable: true })
  description?: string;

  @AutoMap(() => [UserEntity])
  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];
}
