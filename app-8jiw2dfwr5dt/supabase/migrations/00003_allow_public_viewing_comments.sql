-- Allow anonymous users to view comments
DROP POLICY IF EXISTS "Anyone can view comments" ON comments;

CREATE POLICY "Public can view comments" ON comments
  FOR SELECT TO authenticated, anon USING (true);