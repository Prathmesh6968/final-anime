import { supabase } from './supabase';
import { api, saveWatch, getWatch, saveFavorite, removeFavorite, getFavorites, isFavorited } from './restApi';
import type {
  AnimeData,
  EpisodeData,
  Profile,
  Favorite,
  Comment,
  WatchHistory,
  AnimeFilters,
  PaginationParams,
  PaginatedResponse,
} from '@/types/types';

// Anime API using direct REST calls where possible
export const animeApi = {
  // Get all anime (simplified - no server-side pagination)
  async getAnimeList(
    filters: AnimeFilters = {},
    pagination: PaginationParams = { page: 1, pageSize: 12 }
  ): Promise<PaginatedResponse<AnimeData>> {
    try {
      // Fetch all anime and filter client-side for simplicity
      const data = await api<AnimeData[]>('anime_data?order=title.asc');
      
      let filtered = data;

      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(a => 
          a.title?.toLowerCase().includes(searchLower) || 
          a.japanese?.toLowerCase().includes(searchLower)
        );
      }

      // Apply genre filter
      if (filters.genres && filters.genres.length > 0) {
        filtered = filtered.filter(a => 
          filters.genres!.some(g => a.genres?.toLowerCase().includes(g.toLowerCase()))
        );
      }

      // Apply status filter
      if (filters.status) {
        filtered = filtered.filter(a => a.status === filters.status);
      }

      // Apply rating filter
      if (filters.rating) {
        filtered = filtered.filter(a => a.rating === filters.rating);
      }

      // Apply sorting
      if (filters.sortBy === 'score') {
        filtered.sort((a, b) => parseFloat(b.score || '0') - parseFloat(a.score || '0'));
      } else if (filters.sortBy === 'aired') {
        filtered.sort((a, b) => (b.aired || '').localeCompare(a.aired || ''));
      } else if (filters.sortBy === 'title') {
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      }

      // Apply pagination
      const total = filtered.length;
      const from = (pagination.page - 1) * pagination.pageSize;
      const to = from + pagination.pageSize;
      const paginated = filtered.slice(from, to);

      return {
        data: paginated,
        total,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: Math.ceil(total / pagination.pageSize),
      };
    } catch (error) {
      console.error('Error fetching anime list:', error);
      return {
        data: [],
        total: 0,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: 0,
      };
    }
  },

  // Get anime by slug
  async getAnimeBySlug(slug: string): Promise<AnimeData | null> {
    try {
      const data = await api<AnimeData[]>(`anime_data?slug=eq.${slug}`);
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error fetching anime:', error);
      return null;
    }
  },

  // Get anime by ID
  async getAnimeById(id: string): Promise<AnimeData | null> {
    try {
      const data = await api<AnimeData[]>(`anime_data?id=eq.${id}`);
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error fetching anime:', error);
      return null;
    }
  },
};

// Episodes API
export const episodesApi = {
  // Get all episodes for an anime
  async getEpisodesByAnimeId(animeId: string): Promise<EpisodeData[]> {
    try {
      const data = await api<EpisodeData[]>(`episodes_data?anime_id=eq.${animeId}&order=season.asc,episode.asc`);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching episodes:', error);
      return [];
    }
  },

  // Get specific episode
  async getEpisode(animeId: string, season: number, episode: number): Promise<EpisodeData | null> {
    try {
      const data = await api<EpisodeData[]>(
        `episodes_data?anime_id=eq.${animeId}&season=eq.${season}&episode=eq.${episode}`
      );
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error fetching episode:', error);
      return null;
    }
  },
};

// Favorites API (using localStorage for simplicity)
export const favoritesApi = {
  // Get user favorites (from localStorage)
  async getUserFavorites(userId: string): Promise<AnimeData[]> {
    try {
      const favoriteIds = getFavorites();
      if (favoriteIds.length === 0) return [];

      // Fetch anime data for favorites
      const promises = favoriteIds.map(id => animeApi.getAnimeById(id));
      const results = await Promise.all(promises);
      return results.filter((a): a is AnimeData => a !== null);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  },

  // Check if anime is favorited
  async isFavorited(userId: string, animeId: string): Promise<boolean> {
    return isFavorited(animeId);
  },

  // Add to favorites
  async addFavorite(userId: string, animeId: string): Promise<boolean> {
    try {
      saveFavorite(animeId);
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      return false;
    }
  },

  // Remove from favorites
  async removeFavorite(userId: string, animeId: string): Promise<boolean> {
    try {
      removeFavorite(animeId);
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  },
};

// Comments API (using localStorage for client-side storage)
export const commentsApi = {
  // Get comments for an anime
  async getCommentsByAnimeId(animeId: string): Promise<Comment[]> {
    try {
      const commentsKey = 'anime_comments';
      const stored = localStorage.getItem(commentsKey);
      const allComments: Comment[] = stored ? JSON.parse(stored) : [];
      
      // Filter comments for this anime and no parent (top-level comments)
      return allComments
        .filter(c => c.anime_id === animeId && !c.parent_id)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  // Get replies to a comment
  async getReplies(commentId: string): Promise<Comment[]> {
    try {
      const commentsKey = 'anime_comments';
      const stored = localStorage.getItem(commentsKey);
      const allComments: Comment[] = stored ? JSON.parse(stored) : [];
      
      // Filter replies for this comment
      return allComments
        .filter(c => c.parent_id === commentId)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } catch (error) {
      console.error('Error fetching replies:', error);
      return [];
    }
  },

  // Create a comment
  async createComment(
    userId: string,
    animeId: string,
    content: string,
    parentId?: string
  ): Promise<Comment | null> {
    try {
      const commentsKey = 'anime_comments';
      const stored = localStorage.getItem(commentsKey);
      const allComments: Comment[] = stored ? JSON.parse(stored) : [];
      
      // Get user profile from auth context (we'll need username)
      const profilesKey = 'user_profiles';
      const profilesStored = localStorage.getItem(profilesKey);
      const profiles = profilesStored ? JSON.parse(profilesStored) : {};
      const userProfile = profiles[userId] || { username: 'Anonymous' };
      
      // Create new comment
      const newComment: Comment = {
        id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: userId,
        anime_id: animeId,
        content,
        parent_id: parentId || null,
        created_at: new Date().toISOString(),
        user: {
          id: userId,
          username: userProfile.username,
          email: '',
          role: 'user',
          created_at: new Date().toISOString(),
          avatar_url: userProfile.avatar_url || null,
        },
      };
      
      allComments.push(newComment);
      localStorage.setItem(commentsKey, JSON.stringify(allComments));
      
      return newComment;
    } catch (error) {
      console.error('Error creating comment:', error);
      return null;
    }
  },

  // Delete a comment
  async deleteComment(commentId: string, userId: string): Promise<boolean> {
    try {
      const commentsKey = 'anime_comments';
      const stored = localStorage.getItem(commentsKey);
      const allComments: Comment[] = stored ? JSON.parse(stored) : [];
      
      // Filter out the comment and its replies
      const filtered = allComments.filter(c => 
        c.id !== commentId && c.parent_id !== commentId
      );
      
      localStorage.setItem(commentsKey, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  },
};

// Watch History API (using localStorage)
export const watchHistoryApi = {
  // Get user watch history
  async getUserWatchHistory(userId: string): Promise<WatchHistory[]> {
    try {
      // Get all anime
      const allAnime = await api<AnimeData[]>('anime_data');
      const history: WatchHistory[] = [];

      // Check localStorage for each anime
      for (const anime of allAnime) {
        const watch = getWatch(anime.id);
        if (watch) {
          history.push({
            id: `${anime.id}-${watch.season}-${watch.episode}`,
            user_id: userId,
            anime_id: anime.id,
            season: watch.season,
            episode: watch.episode,
            last_watched: new Date().toISOString(),
            anime_data: anime,
          });
        }
      }

      // Sort by most recent (we don't have timestamps, so just return as is)
      return history;
    } catch (error) {
      console.error('Error fetching watch history:', error);
      return [];
    }
  },

  // Update watch history
  async updateWatchHistory(
    userId: string,
    animeId: string,
    season: number,
    episode: number
  ): Promise<boolean> {
    try {
      saveWatch(animeId, season, episode);
      return true;
    } catch (error) {
      console.error('Error updating watch history:', error);
      return false;
    }
  },
};

// Profile API (using Supabase client for auth operations)
export const profileApi = {
  // Get profile by ID
  async getProfileById(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  // Update profile
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  },

  // Get all profiles (admin only)
  async getAllProfiles(): Promise<Profile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }
  },
};

// Export watch history helpers
export { saveWatch, getWatch };
