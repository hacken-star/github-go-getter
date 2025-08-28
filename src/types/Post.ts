export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
  color: string;
  universities?: {
    name: string;
    short_name: string;
  };
  profiles?: {
    username: string;
    display_name: string;
  };
  user_reactions?: Array<{ user_id: string; post_id: string }>;
}