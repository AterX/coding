export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  likes: number;
  comments_count: number;
  views_count: number;
  createdAt: string;
}