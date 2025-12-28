-- Fix the auto_confirm_user function to set email_confirmed_at instead of confirmed_at
CREATE OR REPLACE FUNCTION auto_confirm_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Auto-confirm the user by setting email_confirmed_at
  -- confirmed_at is a generated column based on email_confirmed_at and phone_confirmed_at
  IF NEW.email_confirmed_at IS NULL THEN
    NEW.email_confirmed_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$;