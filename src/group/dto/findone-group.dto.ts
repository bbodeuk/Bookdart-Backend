import { Bookmark } from '../../@types/bookmark';

export interface FindOneRes {
  bookmarks: Bookmark[];
  pagination: {
    page: number;
    hasNext: boolean;
  };
}
