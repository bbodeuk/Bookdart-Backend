import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { GroupEntity } from '../group/group.entity';
import { TagEntity } from '../tag/tag.entity';

@Entity('bookmarks')
export class BookmarkEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'varchar' })
  image: string;

  @Column({ type: 'varchar' })
  link: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(() => GroupEntity, (group) => group.bookmarks, {
    onDelete: 'CASCADE',
  })
  group: GroupEntity;

  @ManyToMany(() => TagEntity, (tag) => tag.id)
  @JoinTable()
  tags: TagEntity[];
}
