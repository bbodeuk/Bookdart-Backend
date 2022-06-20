import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GroupEntity } from '../group/group.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  provider: string;

  @Column({ type: 'varchar' })
  providerId: string;

  @Column({ type: 'varchar', nullable: true })
  hashedRefreshToken?: string;

  @OneToMany(() => GroupEntity, (group) => group.user)
  groups: GroupEntity[];
}
