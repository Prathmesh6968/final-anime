import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { profileApi } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Profile } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Admin() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role === 'admin') {
      loadUsers();
    }
  }, [profile]);

  const loadUsers = async () => {
    setLoading(true);
    const data = await profileApi.getAllProfiles();
    setUsers(data);
    setLoading(false);
  };

  // Redirect if not admin
  if (profile && profile.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <MainLayout showSidebar={false}>
      <div className="container py-6 px-4 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground">Manage users and platform settings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-muted" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> The first user to register automatically becomes an admin. 
            Additional admin features can be added as needed.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
