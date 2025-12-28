-- Create user_role enum
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  username text UNIQUE NOT NULL,
  avatar_url text,
  role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create anime_data table
CREATE TABLE public.anime_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  banner text,
  score text,
  japanese text,
  episodes text,
  status text,
  aired text,
  genres text,
  duration text,
  rating text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create episodes_data table
CREATE TABLE public.episodes_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anime_id uuid REFERENCES public.anime_data(id) ON DELETE CASCADE NOT NULL,
  season int NOT NULL,
  episode int NOT NULL,
  title text,
  iframe text,
  url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(anime_id, season, episode)
);

-- Create favorites table
CREATE TABLE public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  anime_id uuid REFERENCES public.anime_data(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, anime_id)
);

-- Create comments table
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  anime_id uuid REFERENCES public.anime_data(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create watch_history table
CREATE TABLE public.watch_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  anime_id uuid REFERENCES public.anime_data(id) ON DELETE CASCADE NOT NULL,
  season int NOT NULL,
  episode int NOT NULL,
  last_watched timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, anime_id, season, episode)
);

-- Create indexes for better performance
CREATE INDEX idx_episodes_anime_id ON public.episodes_data(anime_id);
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_anime_id ON public.favorites(anime_id);
CREATE INDEX idx_comments_anime_id ON public.comments(anime_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX idx_watch_history_user_id ON public.watch_history(user_id);
CREATE INDEX idx_anime_data_slug ON public.anime_data(slug);

-- Create function to sync auth users to profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
  new_username text;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- Extract username from email (before @)
  new_username := split_part(NEW.email, '@', 1);
  
  -- Insert a profile synced with fields collected at signup
  INSERT INTO public.profiles (id, email, username, role)
  VALUES (
    NEW.id,
    NEW.email,
    new_username,
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END
  );
  RETURN NEW;
END;
$$;

-- Create trigger to sync users on confirmation
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anime_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- Anime data policies (public read, admin write)
CREATE POLICY "Anyone can view anime data" ON anime_data
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage anime data" ON anime_data
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Episodes data policies (public read, admin write)
CREATE POLICY "Anyone can view episodes data" ON episodes_data
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage episodes data" ON episodes_data
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites" ON favorites
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create comments" ON comments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all comments" ON comments
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- Watch history policies
CREATE POLICY "Users can view their own watch history" ON watch_history
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own watch history" ON watch_history
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Create public_profiles view for shareable info
CREATE VIEW public_profiles AS
  SELECT id, username, avatar_url, role, created_at FROM profiles;