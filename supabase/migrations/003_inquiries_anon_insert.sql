-- ============================================
-- Inquiries: explicit anon insert policy
-- ============================================
-- Contact form posts via server action using the anon key (no admin/service-role).
-- Make the public-insert policy explicit and role-scoped, and ensure anon cannot
-- read or modify existing rows.

DROP POLICY IF EXISTS "Anyone can submit inquiries" ON inquiries;

CREATE POLICY "Anon and authenticated can submit inquiries"
  ON inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
