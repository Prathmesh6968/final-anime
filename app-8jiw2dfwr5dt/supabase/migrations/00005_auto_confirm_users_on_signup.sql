-- Update the handle_new_user function to auto-confirm users
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

-- Create a function to auto-confirm new users
CREATE OR REPLACE FUNCTION auto_confirm_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Auto-confirm the user if not already confirmed
  IF NEW.confirmed_at IS NULL THEN
    NEW.confirmed_at = NOW();
    NEW.email_confirmed_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_auto_confirm ON auth.users;

-- Create trigger to auto-confirm users before insert
CREATE TRIGGER on_auth_user_auto_confirm
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_confirm_user();