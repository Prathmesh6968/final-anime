-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Anyone can view anime data" ON anime_data;

-- Create new policy that allows both authenticated and anonymous users to view anime
CREATE POLICY "Public can view anime data" ON anime_data
  FOR SELECT TO authenticated, anon USING (true);

-- Also fix episodes_data table
DROP POLICY IF EXISTS "Anyone can view episodes data" ON episodes_data;

CREATE POLICY "Public can view episodes data" ON episodes_data
  FOR SELECT TO authenticated, anon USING (true);