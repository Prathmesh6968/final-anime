import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Info, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import type { AnimeData } from '@/types/types';

interface HeroSliderProps {
  anime: AnimeData[];
}

export function HeroSlider({ anime }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false); // Disabled auto-play by default

  useEffect(() => {
    if (!isAutoPlaying || anime.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % anime.length);
    }, 8000); // Increased to 8 seconds for better UX

    return () => clearInterval(interval);
  }, [isAutoPlaying, anime.length]);

  if (anime.length === 0) return null;

  const currentAnime = anime[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + anime.length) % anime.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % anime.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url(${currentAnime.banner || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&h=500&fit=crop'})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container flex items-center px-4 md:px-8">
        <div className="max-w-2xl space-y-2 md:space-y-4">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {currentAnime.score && (
              <Badge variant="default" className="gap-1 text-xs">
                <Star className="h-3 w-3 fill-current" />
                {currentAnime.score}
              </Badge>
            )}
            {currentAnime.status && (
              <Badge variant="secondary" className="text-xs">{currentAnime.status}</Badge>
            )}
            {currentAnime.rating && (
              <Badge variant="outline" className="text-xs">{currentAnime.rating}</Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight line-clamp-2">
            {currentAnime.title}
          </h1>

          {/* Japanese Title - Hidden on mobile */}
          {currentAnime.japanese && (
            <p className="hidden md:block text-lg text-muted-foreground">{currentAnime.japanese}</p>
          )}

          {/* Info - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            {currentAnime.episodes && <span>{currentAnime.episodes} एपिसोड</span>}
            {currentAnime.duration && <span>•</span>}
            {currentAnime.duration && <span>{currentAnime.duration}</span>}
            {currentAnime.aired && <span>•</span>}
            {currentAnime.aired && <span>{currentAnime.aired}</span>}
          </div>

          {/* Genres - Hidden on mobile */}
          {currentAnime.genres && (
            <p className="hidden md:block text-sm text-muted-foreground line-clamp-1">
              {currentAnime.genres}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3 pt-2">
            <Button size="sm" className="md:text-base" asChild>
              <Link to={`/anime/${currentAnime.slug}`}>
                <Play className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                अभी देखें
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="md:text-base" asChild>
              <Link to={`/anime/${currentAnime.slug}`}>
                <Info className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                जानकारी
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Hidden on mobile */}
      <button
        onClick={goToPrevious}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm items-center justify-center hover:bg-card transition-colors"
        aria-label="पिछला"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm items-center justify-center hover:bg-card transition-colors"
        aria-label="अगला"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {anime.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsAutoPlaying(false);
            }}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex ? 'w-8 bg-primary' : 'w-1.5 bg-muted-foreground/50'
            }`}
            aria-label={`स्लाइड ${index + 1} पर जाएं`}
          />
        ))}
      </div>
    </div>
  );
}
