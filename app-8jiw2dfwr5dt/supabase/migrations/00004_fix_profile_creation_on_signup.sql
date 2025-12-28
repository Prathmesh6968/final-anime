-- Drop the old trigger that waits for confirmation
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;

-- Create new trigger that fires immediately on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Also keep the confirmation trigger for cases where email verification is enabled
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Update the handle_new_user function to handle duplicates
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
  new_username text;
BEGIN
  -- Check if profile already exists
  IF EXISTS (SELECT 1 FROM profiles WHERE id = NEW.id) THEN
    RETURN NEW;
  END IF;

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
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;