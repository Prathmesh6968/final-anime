import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { AnimeCard } from '@/components/anime/AnimeCard';
import { favoritesApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import type { AnimeData } from '@/types/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<AnimeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    setLoading(true);
    const data = await favoritesApi.getUserFavorites(user.id);
    setFavorites(data);
    setLoading(false);
  };

  return (
    <MainLayout showSidebar={false}>
      <div className="container py-6 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
          <p className="text-muted-foreground">
            Your collection of favorite anime
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[16/9] w-full bg-muted" />
                <Skeleton className="h-4 w-3/4 bg-muted" />
                <Skeleton className="h-3 w-1/2 bg-muted" />
              </div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No favorites yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start adding anime to your favorites to see them here
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
