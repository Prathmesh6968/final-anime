import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { watchHistoryApi, profileApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import type { WatchHistory } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Clock, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [watchHistory, setWatchHistory] = useState<WatchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user && profile) {
      loadProfileData();
      setUsername(profile.username);
    }
  }, [user, profile]);

  const loadProfileData = async () => {
    if (!user) return;

    setLoading(true);
    const history = await watchHistoryApi.getUserWatchHistory(user.id);
    setWatchHistory(history);
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    if (!user || !username.trim()) return;

    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      toast({
        title: 'Invalid Username',
        description: 'Username can only contain letters, numbers, and underscores',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    const updated = await profileApi.updateProfile(user.id, { username: username.trim() });

    if (updated) {
      await refreshProfile();
      setIsEditing(false);
      toast({ title: 'Profile updated successfully' });
    } else {
      toast({
        title: 'Failed to update profile',
        variant: 'destructive',
      });
    }

    setIsSaving(false);
  };

  return (
    <MainLayout showSidebar={false}>
      <div className="container py-6 px-4 max-w-4xl">
        {/* Profile Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isSaving}
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold">{profile?.username}</h2>
                      <Badge variant="secondary" className="mt-1">
                        {profile?.role}
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setUsername(profile?.username || '');
                      }}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Watch History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Watch History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full bg-muted" />
                ))}
              </div>
            ) : watchHistory.length > 0 ? (
              <div className="space-y-3">
                {watchHistory.map((item) => (
                  <Link
                    key={item.id}
                    to={`/watch/${item.anime?.slug}/${item.season}/${item.episode}`}
                    className="block"
                  >
                    <Card className="hover:bg-accent transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-24 aspect-video rounded overflow-hidden flex-shrink-0">
                            <img
                              src={
                                item.anime?.banner ||
                                'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&h=100&fit=crop'
                              }
                              alt={item.anime?.title}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{item.anime?.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Season {item.season}, Episode {item.episode}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(item.last_watched).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No watch history yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Start watching anime to see your history here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
