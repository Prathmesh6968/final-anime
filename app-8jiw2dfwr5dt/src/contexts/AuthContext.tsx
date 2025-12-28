import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Profile } from '@/types/types';

// Guest User type (no authentication required)
interface GuestUser {
  id: string;
  username: string;
  email: string;
  role: 'user';
  created_at: string;
  avatar_url?: string | null;
}

// Create a default guest user
const createGuestUser = (): GuestUser => {
  // Check if guest user already exists in localStorage
  const stored = localStorage.getItem('guest_user');
  if (stored) {
    return JSON.parse(stored);
  }

  // Create new guest user
  const guestUser: GuestUser = {
    id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    username: 'Guest',
    email: 'guest@hindidub.anime',
    role: 'user',
    created_at: new Date().toISOString(),
    avatar_url: null,
  };

  // Save to localStorage
  localStorage.setItem('guest_user', JSON.stringify(guestUser));

  // Also save to user_profiles for comments
  const profilesKey = 'user_profiles';
  const profilesStored = localStorage.getItem(profilesKey);
  const profiles = profilesStored ? JSON.parse(profilesStored) : {};
  profiles[guestUser.id] = {
    username: guestUser.username,
    avatar_url: guestUser.avatar_url,
  };
  localStorage.setItem(profilesKey, JSON.stringify(profiles));

  return guestUser;
};

export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const guestUser = createGuestUser();
    
    const profile: Profile = {
      id: guestUser.id,
      username: guestUser.username,
      email: guestUser.email,
      role: guestUser.role,
      created_at: guestUser.created_at,
      avatar_url: guestUser.avatar_url || null,
    };

    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

interface AuthContextType {
  user: GuestUser | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (username: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GuestUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user) {
      return;
    }

    const profileData = await getProfile(user.id);
    setProfile(profileData);
  };

  useEffect(() => {
    // Auto-login as guest user
    const guestUser = createGuestUser();
    setUser(guestUser);
    getProfile(guestUser.id).then(setProfile);
    setLoading(false);
  }, []);

  // Dummy functions (not used but kept for compatibility)
  const signInWithUsername = async (username: string, password: string) => {
    return { error: new Error('Authentication not available') };
  };

  const signUpWithUsername = async (username: string, password: string) => {
    return { error: new Error('Authentication not available') };
  };

  const signOut = async () => {
    // Do nothing - user is always logged in as guest
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn: signInWithUsername,
        signUp: signUpWithUsername,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
