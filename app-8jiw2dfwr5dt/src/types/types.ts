// User and Profile types
export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  email: string | null;
  username: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

// Anime types
export interface AnimeData {
  id: string;
  title: string;
  slug: string;
  banner: string | null;
  score: string | null;
  japanese: string | null;
  episodes: string | null;
  status: string | null;
  aired: string | null;
  genres: string | null;
  duration: string | null;
  rating: string | null;
  created_at: string;
}

export interface EpisodeData {
  id: string;
  anime_id: string;
  season: number;
  episode: number;
  title: string | null;
  iframe: string | null;
  url: string | null;
  created_at: string;
}

// Favorites type
export interface Favorite {
  id: string;
  user_id: string;
  anime_id: string;
  created_at: string;
  anime?: AnimeData;
}

// Comments type
export interface Comment {
  id: string;
  user_id: string;
  anime_id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  user?: Profile;
  replies?: Comment[];
}

// Watch history type
export interface WatchHistory {
  id: string;
  user_id: string;
  anime_id: string;
  season: number;
  episode: number;
  last_watched: string;
  anime?: AnimeData;
  anime_data?: AnimeData; // Alternative field name for compatibility
}

// Filter and search types
export interface AnimeFilters {
  search?: string;
  genres?: string[];
  status?: string;
  rating?: string;
  sortBy?: 'score' | 'aired' | 'title';
}

// Pagination type
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
