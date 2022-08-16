import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tags')
export class TagEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  groupId: string;

  @Column()
  tag: string;
}
