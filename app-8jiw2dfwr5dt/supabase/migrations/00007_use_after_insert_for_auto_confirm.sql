-- Drop the BEFORE INSERT trigger as it might not work with Supabase Auth
DROP TRIGGER IF EXISTS on_auth_user_auto_confirm ON auth.users;

-- Create a new function that uses admin API to confirm users
CREATE OR REPLACE FUNCTION auto_confirm_user_after_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- For users with @miaoda.com email, mark them as confirmed
  IF NEW.email LIKE '%@miaoda.com' AND NEW.email_confirmed_at IS NULL THEN
    -- Update the user to set email_confirmed_at
    -- This will automatically update the generated confirmed_at column
    UPDATE auth.users
    SET email_confirmed_at = NOW()
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create AFTER INSERT trigger
CREATE TRIGGER on_auth_user_auto_confirm_after
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_confirm_user_after_insert();