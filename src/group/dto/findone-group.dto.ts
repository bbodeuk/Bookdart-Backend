export interface FindOneRes {
  bookmarks: {
    title: string;
    description: string;
    link: string;
    image: string;
    tags: string[];
  }[];
  pagination: {
    page: number;
    hasNext: boolean;
  };
}
