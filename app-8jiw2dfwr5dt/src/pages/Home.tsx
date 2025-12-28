import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { HeroSlider } from '@/components/home/HeroSlider';
import { ContinueWatching } from '@/components/home/ContinueWatching';
import { AnimeSection } from '@/components/home/AnimeSection';
import { animeApi } from '@/db/api';
import type { AnimeData, AnimeFilters } from '@/types/types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingUp, Star, Clock, Sparkles } from 'lucide-react';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [featuredAnime, setFeaturedAnime] = useState<AnimeData[]>([]);
  const [popularAnime, setPopularAnime] = useState<AnimeData[]>([]);
  const [topRatedAnime, setTopRatedAnime] = useState<AnimeData[]>([]);
  const [recentlyAddedAnime, setRecentlyAddedAnime] = useState<AnimeData[]>([]);
  const [animeList, setAnimeList] = useState<AnimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  const search = searchParams.get('search') || '';
  const genres = searchParams.get('genres')?.split(',').filter(Boolean) || [];
  const status = searchParams.get('status') || '';
  const rating = searchParams.get('rating') || '';
  const sortBy = (searchParams.get('sortBy') as 'score' | 'aired' | 'title') || undefined;

  useEffect(() => {
    loadHomeData();
  }, []);

  useEffect(() => {
    if (search || genres.length > 0 || status || rating || sortBy) {
      loadAnime();
    }
  }, [search, genres.join(','), status, rating, sortBy, page]);

  const loadHomeData = async () => {
    setLoading(true);
    
    // Load featured anime (top 5 for hero slider)
    const featured = await animeApi.getAnimeList({ sortBy: 'score' }, { page: 1, pageSize: 5 });
    setFeaturedAnime(featured.data);

    // Load popular anime
    const popular = await animeApi.getAnimeList({}, { page: 1, pageSize: 12 });
    setPopularAnime(popular.data);

    // Load top rated
    const topRated = await animeApi.getAnimeList({ sortBy: 'score' }, { page: 1, pageSize: 12 });
    setTopRatedAnime(topRated.data);

    // Load recently added
    const recent = await animeApi.getAnimeList({}, { page: 1, pageSize: 12 });
    setRecentlyAddedAnime(recent.data);

    // Load main anime list
    const result = await animeApi.getAnimeList({}, { page, pageSize });
    setAnimeList(result.data);
    setTotalPages(result.totalPages);

    setLoading(false);
  };

  const loadAnime = async () => {
    setLoading(true);
    try {
      const filters: AnimeFilters = {
        search: search || undefined,
        genres: genres.length > 0 ? genres : undefined,
        status: status || undefined,
        rating: rating || undefined,
        sortBy,
      };

      const result = await animeApi.getAnimeList(filters, { page, pageSize });
      setAnimeList(result.data);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error loading anime:', error);
      setAnimeList([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (value: string) => {
    if (value === 'default') {
      searchParams.delete('sortBy');
    } else {
      searchParams.set('sortBy', value);
    }
    setSearchParams(searchParams);
    setPage(1);
  };

  const isFiltered = search || genres.length > 0 || status || rating || sortBy;

  return (
    <MainLayout>
      <div className="space-y-8 pb-8">
        {/* Hero Slider - Only show when not filtered */}
        {!isFiltered && !loading && (
          <div className="container px-4 pt-6">
            <HeroSlider anime={featuredAnime} />
          </div>
        )}

        {/* Continue Watching - Only show when not filtered */}
        {!isFiltered && (
          <div className="container px-4">
            <ContinueWatching />
          </div>
        )}

        {/* Filtered Results or Browse All */}
        <div className="container px-4">
          {isFiltered ? (
            <>
              {/* Header for filtered results */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {search ? `Search Results for "${search}"` : 'Browse Anime'}
                  </h1>
                  <p className="text-muted-foreground">
                    {animeList.length} anime found
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <Select value={sortBy || 'default'} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Default" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="score">Score</SelectItem>
                      <SelectItem value="aired">Release Date</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Filtered Anime Grid */}
              <AnimeSection
                title=""
                anime={animeList}
                loading={loading}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Popular This Week */}
              <AnimeSection
                title="Popular This Week"
                anime={popularAnime}
                loading={loading}
                viewAllLink="/?sortBy=score"
                icon={<TrendingUp className="h-5 w-5 text-primary" />}
              />

              {/* Top Rated */}
              <div className="mt-8">
                <AnimeSection
                  title="Top Rated"
                  anime={topRatedAnime}
                  loading={loading}
                  viewAllLink="/?sortBy=score"
                  icon={<Star className="h-5 w-5 text-primary" />}
                />
              </div>

              {/* Recently Added */}
              <div className="mt-8">
                <AnimeSection
                  title="Recently Added"
                  anime={recentlyAddedAnime}
                  loading={loading}
                  icon={<Clock className="h-5 w-5 text-primary" />}
                />
              </div>

              {/* Browse All */}
              <div className="mt-8">
                <AnimeSection
                  title="Browse All Anime"
                  anime={animeList}
                  loading={loading}
                  icon={<Sparkles className="h-5 w-5 text-primary" />}
                />
              </div>

              {/* Pagination for Browse All */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
