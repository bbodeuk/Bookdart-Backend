import { BookmarkEntity } from '../../bookmark/bookmark.entity';

export interface FindOneRes {
  bookmarks: BookmarkEntity[];
  pagination: {
    page: number;
    hasNext: boolean;
  };
}
