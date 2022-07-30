import { GroupEntity } from '../group.entity';

export interface FindAllRes {
  groups: GroupEntity[];
  pagination: {
    page: number;
    hasNext: boolean;
  };
}
