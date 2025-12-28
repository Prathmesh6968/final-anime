import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { animeApi, episodesApi, favoritesApi, commentsApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import type { AnimeData, EpisodeData, Comment } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Heart, Play, Star, Calendar, Clock, Film } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AnimeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<AnimeData | null>(null);
  const [episodes, setEpisodes] = useState<EpisodeData[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (slug) {
      loadAnimeData();
    }
  }, [slug]);

  const loadAnimeData = async () => {
    if (!slug) return;

    setLoading(true);
    const animeData = await animeApi.getAnimeBySlug(slug);
    
    if (animeData) {
      setAnime(animeData);
      
      // Load episodes
      const episodesData = await episodesApi.getEpisodesByAnimeId(animeData.id);
      setEpisodes(episodesData);

      // Load comments
      const commentsData = await commentsApi.getCommentsByAnimeId(animeData.id);
      setComments(commentsData);

      // Check if favorited
      if (user) {
        const favorited = await favoritesApi.isFavorited(user.id, animeData.id);
        setIsFavorited(favorited);
      }
    }
    
    setLoading(false);
  };

  const toggleFavorite = async () => {
    if (!user || !anime) {
      toast({
        title: 'Login Required',
        description: 'Please login to add favorites',
        variant: 'destructive',
      });
      return;
    }

    if (isFavorited) {
      const success = await favoritesApi.removeFavorite(user.id, anime.id);
      if (success) {
        setIsFavorited(false);
        toast({ title: 'Removed from favorites' });
      }
    } else {
      const success = await favoritesApi.addFavorite(user.id, anime.id);
      if (success) {
        setIsFavorited(true);
        toast({ title: 'Added to favorites' });
      }
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !anime || !commentText.trim()) return;

    setSubmittingComment(true);
    const comment = await commentsApi.createComment(user.id, anime.id, commentText.trim());
    
    if (comment) {
      setComments([comment, ...comments]);
      setCommentText('');
      toast({ title: 'Comment posted' });
    } else {
      toast({
        title: 'Failed to post comment',
        variant: 'destructive',
      });
    }
    
    setSubmittingComment(false);
  };

  const handleWatchNow = () => {
    if (episodes.length > 0) {
      const firstEpisode = episodes[0];
      navigate(`/watch/${anime?.slug}/${firstEpisode.season}/${firstEpisode.episode}`);
    }
  };

  if (loading) {
    return (
      <MainLayout showSidebar={false}>
        <div className="container py-6 px-4">
          <Skeleton className="h-64 w-full mb-6 bg-muted" />
          <Skeleton className="h-8 w-1/2 mb-4 bg-muted" />
          <Skeleton className="h-4 w-full mb-2 bg-muted" />
          <Skeleton className="h-4 w-3/4 bg-muted" />
        </div>
      </MainLayout>
    );
  }

  if (!anime) {
    return (
      <MainLayout showSidebar={false}>
        <div className="container py-12 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Anime Not Found</h1>
          <Button asChild>
            <Link to="/">Back to Browse</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Group episodes by season
  const episodesBySeason = episodes.reduce((acc, ep) => {
    if (!acc[ep.season]) acc[ep.season] = [];
    acc[ep.season].push(ep);
    return acc;
  }, {} as Record<number, EpisodeData[]>);

  const seasons = Object.keys(episodesBySeason).sort((a, b) => Number(a) - Number(b));

  return (
    <MainLayout showSidebar={false}>
      <div className="container py-6 px-4 max-w-7xl">
        {/* Banner */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-6">
          <img
            src={anime.banner || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&h=400&fit=crop'}
            alt={anime.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          {/* Watch Now Button Overlay */}
          {episodes.length > 0 && (
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row gap-3">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 animate-pulse-glow"
                onClick={handleWatchNow}
              >
                <Play className="h-6 w-6 mr-2 fill-current" />
                Watch Now
              </Button>
              <Button 
                size="lg" 
                variant={isFavorited ? 'default' : 'outline'}
                className="text-lg px-8 py-6"
                onClick={toggleFavorite}
              >
                <Heart className={`h-5 w-5 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                {isFavorited ? 'Favorited' : 'Add to Favorites'}
              </Button>
            </div>
          )}
        </div>

        {/* Title and Info */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">{anime.title}</h1>
          {anime.japanese && (
            <p className="text-xl text-muted-foreground mb-4">{anime.japanese}</p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {anime.score && (
              <Badge variant="default" className="gap-1 text-sm px-3 py-1">
                <Star className="h-4 w-4 fill-current" />
                {anime.score}
              </Badge>
            )}
            {anime.status && <Badge variant="secondary" className="text-sm px-3 py-1">{anime.status}</Badge>}
            {anime.rating && <Badge variant="outline" className="text-sm px-3 py-1">{anime.rating}</Badge>}
            {anime.episodes && <Badge variant="outline" className="text-sm px-3 py-1">{anime.episodes} Episodes</Badge>}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {anime.duration && (
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">Duration</span>
                </div>
                <p className="text-lg font-semibold">{anime.duration}</p>
              </CardContent>
            </Card>
          )}
          {anime.aired && (
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs">Aired</span>
                </div>
                <p className="text-lg font-semibold">{anime.aired}</p>
              </CardContent>
            </Card>
          )}
          {anime.genres && (
            <Card className="bg-card/50 backdrop-blur-sm col-span-2">
              <CardContent className="pt-6">
                <div className="text-muted-foreground mb-2">
                  <span className="text-xs">Genres</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {anime.genres.split(',').map((genre, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {genre.trim()}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Episodes - Mobile Friendly Tabs */}
        {episodes.length > 0 && (
          <Card className="mb-6 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Episodes</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={seasons[0]} className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
                  {seasons.map((season) => (
                    <TabsTrigger key={season} value={season} className="flex-shrink-0">
                      Season {season}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {seasons.map((season) => (
                  <TabsContent key={season} value={season} className="mt-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {episodesBySeason[Number(season)].map((episode) => (
                        <Link
                          key={episode.id}
                          to={`/watch/${anime.slug}/${episode.season}/${episode.episode}`}
                        >
                          <Card className="hover:bg-primary/10 hover:border-primary transition-all group">
                            <CardContent className="p-4 flex flex-col items-center justify-center aspect-square">
                              <div className="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-2 transition-colors">
                                <Play className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                              </div>
                              <p className="font-semibold text-sm text-center">EP {episode.episode}</p>
                              {episode.title && (
                                <p className="text-xs text-muted-foreground text-center line-clamp-2 mt-1">
                                  {episode.title}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Comments */}
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Comments</CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <Textarea
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="mb-2"
                  rows={3}
                />
                <Button type="submit" disabled={submittingComment || !commentText.trim()}>
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </Button>
              </form>
            ) : (
              <div className="mb-6 p-4 bg-muted rounded-lg text-center">
                <p className="text-muted-foreground mb-2">Please login to post comments</p>
                <Button asChild variant="outline">
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            )}

            <Separator className="my-6" />

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{comment.user?.username || 'Anonymous'}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
