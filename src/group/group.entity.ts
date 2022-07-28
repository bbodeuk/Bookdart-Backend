import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { BookmarkEntity } from '../bookmark/bookmark.entity';

@Entity('groups')
export class GroupEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  visibility: string;

  @ManyToOne(() => UserEntity, (user) => user.groups, { onDelete: 'CASCADE' })
  user: UserEntity;

  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.group)
  bookmarks: BookmarkEntity[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
