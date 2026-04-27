-- ============================================
-- Zonerama integration: public external URLs + client gallery notifications
-- ============================================

-- Public portfolio galleries can point to an external host (Zonerama).
ALTER TABLE portfolio_galleries
  ADD COLUMN external_url TEXT,
  ADD COLUMN external_provider TEXT
    CHECK (external_provider IN ('zonerama', 'other') OR external_provider IS NULL);

-- Track whether the client has been emailed about a ready gallery.
ALTER TABLE client_galleries
  ADD COLUMN notified_at TIMESTAMPTZ;

CREATE INDEX idx_portfolio_galleries_external
  ON portfolio_galleries(external_url)
  WHERE external_url IS NOT NULL;
