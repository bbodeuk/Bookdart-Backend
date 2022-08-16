import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BookmarkEntity } from '../bookmark/bookmark.entity';

@Entity('tags')
export class TagEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  groupId: string;

  @ManyToMany(() => BookmarkEntity, (bookmark) => bookmark.id)
  bookmarks: BookmarkEntity[];

  @Column()
  tag: string;
}
