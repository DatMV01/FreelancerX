import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'roles' })
export class RoleEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @AutoMap()
  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @AutoMap()
  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @AutoMap(() => [UserEntity])
  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];
}
