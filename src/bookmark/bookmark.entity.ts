import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('bookmarks')
export class BookmarkEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'varchar' })
  thumnail: string;

  @Column({ type: 'varchar' })
  link: string;
}
