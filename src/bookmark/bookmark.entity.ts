import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { GroupEntity } from '../group/group.entity';

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

  @ManyToOne(() => GroupEntity, (group) => group.bookmarks, {
    onDelete: 'CASCADE',
  })
  group: GroupEntity;
}
