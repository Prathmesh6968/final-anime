import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Search, X, Filter as FilterIcon } from 'lucide-react';

const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
  'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural',
  'Thriller', 'Mecha', 'Music', 'Psychological'
];

const STATUSES = ['Ongoing', 'Completed', 'Upcoming'];
const RATINGS = ['G', 'PG', 'PG-13', 'R', 'R+', 'Rx'];

export default function Filter() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<string>('');

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    
    if (selectedGenres.length > 0) {
      params.set('genres', selectedGenres.join(','));
    }
    
    if (selectedStatus) {
      params.set('status', selectedStatus);
    }
    
    if (selectedRating) {
      params.set('rating', selectedRating);
    }

    navigate(`/?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    setSelectedStatus('');
    setSelectedRating('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FilterIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Filter Anime</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search anime by title..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Genres */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Genres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {GENRES.map((genre) => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox
                    id={genre}
                    checked={selectedGenres.includes(genre)}
                    onCheckedChange={() => handleGenreToggle(genre)}
                  />
                  <Label
                    htmlFor={genre}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {genre}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedStatus} onValueChange={setSelectedStatus}>
              <div className="flex flex-wrap gap-4">
                {STATUSES.map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <RadioGroupItem value={status} id={status} />
                    <Label
                      htmlFor={status}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Rating */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedRating} onValueChange={setSelectedRating}>
              <div className="flex flex-wrap gap-4">
                {RATINGS.map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <RadioGroupItem value={rating} id={rating} />
                    <Label
                      htmlFor={rating}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {rating}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleApplyFilters}
            className="flex-1"
            size="lg"
          >
            Apply Filters
          </Button>
          <Button
            onClick={handleClearFilters}
            variant="outline"
            size="lg"
          >
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
}
