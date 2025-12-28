import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { animeApi, episodesApi, watchHistoryApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import type { AnimeData, EpisodeData } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AnimeCard } from '@/components/anime/AnimeCard';

export default function Watch() {
  const { slug, season: seasonParam, episode: episodeParam } = useParams<{
    slug: string;
    season: string;
    episode: string;
  }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<AnimeData | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<EpisodeData | null>(null);
  const [allEpisodes, setAllEpisodes] = useState<EpisodeData[]>([]);
  const [suggestions, setSuggestions] = useState<AnimeData[]>([]);
  const [loading, setLoading] = useState(true);

  const season = Number.parseInt(seasonParam || '1');
  const episode = Number.parseInt(episodeParam || '1');

  useEffect(() => {
    if (slug) {
      loadWatchData();
    }
  }, [slug, season, episode]);

  useEffect(() => {
    // Load suggestions (similar anime)
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    const result = await animeApi.getAnimeList({}, { page: 1, pageSize: 8 });
    setSuggestions(result.data);
  };

  const loadWatchData = async () => {
    if (!slug) return;

    setLoading(true);
    const animeData = await animeApi.getAnimeBySlug(slug);

    if (animeData) {
      setAnime(animeData);

      // Load all episodes
      const episodesData = await episodesApi.getEpisodesByAnimeId(animeData.id);
      setAllEpisodes(episodesData);

      // Load current episode
      const episodeData = await episodesApi.getEpisode(animeData.id, season, episode);
      setCurrentEpisode(episodeData);

      // Update watch history
      if (user && episodeData) {
        await watchHistoryApi.updateWatchHistory(user.id, animeData.id, season, episode);
      }

      // Save to localStorage for continue watching
      const watchProgress = {
        animeId: animeData.id,
        slug: animeData.slug,
        season,
        episode,
        timestamp: Date.now(),
        progress: 0,
      };
      localStorage.setItem(`watch-${animeData.id}`, JSON.stringify(watchProgress));
    }

    setLoading(false);
  };

  const getNextEpisode = () => {
    const currentIndex = allEpisodes.findIndex(
      (ep) => ep.season === season && ep.episode === episode
    );
    return currentIndex >= 0 && currentIndex < allEpisodes.length - 1
      ? allEpisodes[currentIndex + 1]
      : null;
  };

  const getPreviousEpisode = () => {
    const currentIndex = allEpisodes.findIndex(
      (ep) => ep.season === season && ep.episode === episode
    );
    return currentIndex > 0 ? allEpisodes[currentIndex - 1] : null;
  };

  const nextEpisode = getNextEpisode();
  const previousEpisode = getPreviousEpisode();

  if (loading) {
    return (
      <MainLayout showSidebar={false}>
        <div className="container py-6 px-4">
          <Skeleton className="aspect-video w-full mb-6 bg-muted" />
          <Skeleton className="h-8 w-1/2 mb-4 bg-muted" />
        </div>
      </MainLayout>
    );
  }

  if (!anime || !currentEpisode) {
    return (
      <MainLayout showSidebar={false}>
        <div className="container py-12 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Episode Not Found</h1>
          <Button asChild>
            <Link to="/">Back to Browse</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Group episodes by season
  const episodesBySeason = allEpisodes.reduce((acc, ep) => {
    if (!acc[ep.season]) acc[ep.season] = [];
    acc[ep.season].push(ep);
    return acc;
  }, {} as Record<number, EpisodeData[]>);

  return (
    <MainLayout showSidebar={false}>
      <div className="container py-6 px-4 max-w-7xl">
        {/* Video Player */}
        <div className="mb-6">
          <div className="aspect-video w-full bg-card rounded-lg overflow-hidden">
            {currentEpisode.iframe ? (
              <iframe
                src={currentEpisode.iframe}
                className="w-full h-full"
                allowFullScreen
                title={`${anime.title} - Season ${season} Episode ${episode}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-muted-foreground">Video not available</p>
              </div>
            )}
          </div>
        </div>

        {/* Episode Info and Navigation */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {anime.title} - S{season}E{episode}
              </h1>
              {currentEpisode.title && (
                <p className="text-lg text-muted-foreground">{currentEpisode.title}</p>
              )}
            </div>
            <Button asChild variant="outline">
              <Link to={`/anime/${anime.slug}`}>
                <List className="h-4 w-4 mr-2" />
                View All Episodes
              </Link>
            </Button>
          </div>

          <div className="flex gap-2">
            {previousEpisode && (
              <Button
                variant="outline"
                onClick={() =>
                  navigate(`/watch/${slug}/${previousEpisode.season}/${previousEpisode.episode}`)
                }
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
            {nextEpisode && (
              <Button
                onClick={() =>
                  navigate(`/watch/${slug}/${nextEpisode.season}/${nextEpisode.episode}`)
                }
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Episode List */}
        <Card>
          <CardHeader>
            <CardTitle>Episodes</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(episodesBySeason).map(([seasonNum, seasonEpisodes]) => (
              <div key={seasonNum} className="mb-6 last:mb-0">
                <h3 className="text-lg font-semibold mb-3">Season {seasonNum}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {seasonEpisodes.map((ep) => {
                    const isCurrent = ep.season === season && ep.episode === episode;
                    return (
                      <Button
                        key={ep.id}
                        variant={isCurrent ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => navigate(`/watch/${slug}/${ep.season}/${ep.episode}`)}
                        className="justify-center"
                      >
                        {ep.episode}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>You May Also Like</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {suggestions.map((suggestedAnime) => (
                  <AnimeCard key={suggestedAnime.id} anime={suggestedAnime} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
