import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Psychological',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller',
];

const STATUSES = ['Ongoing', 'Completed'];

const RATINGS = ['G', 'PG', 'PG-13', 'R', 'R+'];

interface SidebarProps {
  onFilterChange?: () => void;
}

export function Sidebar({ onFilterChange }: SidebarProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedGenres = searchParams.get('genres')?.split(',').filter(Boolean) || [];
  const selectedStatus = searchParams.get('status') || '';
  const selectedRating = searchParams.get('rating') || '';

  const toggleGenre = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];

    if (newGenres.length > 0) {
      searchParams.set('genres', newGenres.join(','));
    } else {
      searchParams.delete('genres');
    }
    setSearchParams(searchParams);
    onFilterChange?.();
  };

  const setStatus = (status: string) => {
    if (status === selectedStatus) {
      searchParams.delete('status');
    } else {
      searchParams.set('status', status);
    }
    setSearchParams(searchParams);
    onFilterChange?.();
  };

  const setRating = (rating: string) => {
    if (rating === selectedRating) {
      searchParams.delete('rating');
    } else {
      searchParams.set('rating', rating);
    }
    setSearchParams(searchParams);
    onFilterChange?.();
  };

  const clearFilters = () => {
    searchParams.delete('genres');
    searchParams.delete('status');
    searchParams.delete('rating');
    setSearchParams(searchParams);
    onFilterChange?.();
  };

  const hasFilters = selectedGenres.length > 0 || selectedStatus || selectedRating;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6 pb-4">
          {/* Genres */}
          <div>
            <h3 className="mb-3 text-sm font-medium">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <Badge
                  key={genre}
                  variant={selectedGenres.includes(genre) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleGenre(genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Status */}
          <div>
            <h3 className="mb-3 text-sm font-medium">Status</h3>
            <div className="flex flex-col gap-2">
              {STATUSES.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatus(status)}
                  className="justify-start"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Rating */}
          <div>
            <h3 className="mb-3 text-sm font-medium">Rating</h3>
            <div className="flex flex-wrap gap-2">
              {RATINGS.map((rating) => (
                <Badge
                  key={rating}
                  variant={selectedRating === rating ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setRating(rating)}
                >
                  {rating}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
