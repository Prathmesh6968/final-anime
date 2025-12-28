import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Clock } from 'lucide-react';
import { animeApi } from '@/db/api';
import type { AnimeData } from '@/types/types';

interface WatchProgress {
  animeId: string;
  slug: string;
  season: number;
  episode: number;
  timestamp: number;
  progress: number; // percentage
}

export function ContinueWatching() {
  const [continueWatching, setContinueWatching] = useState<
    Array<WatchProgress & { anime: AnimeData | null }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContinueWatching();
  }, []);

  const loadContinueWatching = async () => {
    setLoading(true);
    
    // Get all watch progress from localStorage
    const watchData: WatchProgress[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('watch-')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.animeId && data.slug) {
            watchData.push(data);
          }
        } catch (error) {
          console.error('Error parsing watch data:', error);
        }
      }
    }

    // Sort by timestamp (most recent first)
    watchData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    // Get anime details for each
    const watchWithAnime = await Promise.all(
      watchData.slice(0, 6).map(async (watch) => {
        const anime = await animeApi.getAnimeById(watch.animeId);
        return { ...watch, anime };
      })
    );

    setContinueWatching(watchWithAnime.filter((item) => item.anime !== null));
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="space-y-4 w-full overflow-hidden">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Continue Watching</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-none w-[160px] aspect-[3/4] bg-muted rounded-lg animate-pulse snap-start" />
          ))}
        </div>
      </div>
    );
  }

  if (continueWatching.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 w-full overflow-hidden">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Continue Watching</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
        {continueWatching.map((item) => (
          <Link
            key={`${item.animeId}-${item.season}-${item.episode}`}
            to={`/watch/${item.slug}/${item.season}/${item.episode}`}
            className="group flex-none w-[160px] snap-start"
          >
            <Card className="overflow-hidden hover:ring-2 hover:ring-primary transition-all h-full">
              <div className="relative aspect-[3/4]">
                <img
                  src={item.anime?.banner || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=400&fit=crop'}
                  alt={item.anime?.title}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
                    <Play className="h-5 w-5 text-primary-foreground fill-current" />
                  </div>
                </div>

                {/* Progress Bar */}
                {item.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${Math.min(item.progress, 100)}%` }}
                    />
                  </div>
                )}

                {/* Episode Badge */}
                <Badge className="absolute top-1.5 right-1.5 text-[10px] px-1.5 py-0.5">
                  EP {item.episode}
                </Badge>
              </div>
              <CardContent className="p-2">
                <h3 className="font-semibold text-xs line-clamp-2 mb-0.5">
                  {item.anime?.title}
                </h3>
                <p className="text-[10px] text-muted-foreground">
                  S{item.season} E{item.episode}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
