import { Link } from 'react-router-dom';
import { AnimeCard } from '@/components/anime/AnimeCard';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { AnimeData } from '@/types/types';

interface AnimeSectionProps {
  title: string;
  anime: AnimeData[];
  loading?: boolean;
  viewAllLink?: string;
  icon?: React.ReactNode;
}

export function AnimeSection({ title, anime, loading, viewAllLink, icon }: AnimeSectionProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full bg-muted" />
              <Skeleton className="h-4 w-3/4 bg-muted" />
              <Skeleton className="h-3 w-1/2 bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (anime.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        {viewAllLink && (
          <Button variant="ghost" asChild>
            <Link to={viewAllLink}>
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {anime.map((item) => (
          <AnimeCard key={item.id} anime={item} />
        ))}
      </div>
    </div>
  );
}
