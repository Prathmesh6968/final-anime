import { Link } from 'react-router-dom';
import { Star, Play, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AnimeData } from '@/types/types';
import { useState } from 'react';
import { getFavorites, saveFavorite, removeFavorite } from '@/db/restApi';

interface AnimeCardProps {
  anime: AnimeData;
}

export function AnimeCard({ anime }: AnimeCardProps) {
  const [isFavorite, setIsFavorite] = useState(() => getFavorites().includes(anime.id));
  const [isHovered, setIsHovered] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite) {
      removeFavorite(anime.id);
      setIsFavorite(false);
    } else {
      saveFavorite(anime.id);
      setIsFavorite(true);
    }
  };

  return (
    <Link 
      to={`/anime/${anime.slug}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden anime-card-hover border-border/50 bg-card/50 backdrop-blur-sm group h-full">
        <div className="relative aspect-[3/4] overflow-hidden">
          {/* Anime Banner */}
          <img
            src={anime.banner || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=400&fit=crop'}
            alt={anime.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          
          {/* Score Badge */}
          {anime.score && (
            <Badge 
              className="absolute top-1 left-1 gap-0.5 text-[10px] bg-primary/90 backdrop-blur-sm border-0 px-1 py-0"
            >
              <Star className="h-2 w-2 fill-current" />
              {anime.score}
            </Badge>
          )}

          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className={`absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
              isFavorite 
                ? 'bg-primary text-primary-foreground scale-110' 
                : 'bg-background/50 text-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`h-3 w-3 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Play Icon on Hover */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="w-10 h-10 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center animate-pulse-glow">
              <Play className="h-5 w-5 text-primary-foreground fill-current ml-0.5" />
            </div>
          </div>

          {/* Status Badge */}
          {anime.status && (
            <Badge 
              variant="secondary" 
              className="absolute bottom-1 left-1 text-[9px] backdrop-blur-sm bg-secondary/80 border-0 px-1 py-0"
            >
              {anime.status}
            </Badge>
          )}

          {/* Episodes Count */}
          {anime.episodes && (
            <Badge 
              variant="outline" 
              className="absolute bottom-1 right-1 text-[9px] backdrop-blur-sm bg-background/80 border-border/50 px-1 py-0"
            >
              {anime.episodes} EP
            </Badge>
          )}
        </div>

        <CardContent className="p-1.5 space-y-0.5">
          {/* Title */}
          <h3 className="font-semibold text-[11px] line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
            {anime.title}
          </h3>

          {/* Genres - Only show on larger screens */}
          {anime.genres && (
            <div className="hidden sm:flex flex-wrap gap-0.5">
              {anime.genres.split(',').slice(0, 2).map((genre, index) => (
                <span
                  key={index}
                  className="text-[8px] px-1 py-0 rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  {genre.trim().replace(/[A-Z][a-z]+/g, '$&')}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
