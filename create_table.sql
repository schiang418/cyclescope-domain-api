CREATE TABLE IF NOT EXISTS domain_analyses (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  dimension_code VARCHAR(20) NOT NULL,
  dimension_name VARCHAR(100) NOT NULL,
  as_of_date DATE NOT NULL,
  full_analysis JSONB NOT NULL,
  indicator_count INTEGER,
  integrated_read_bullets JSONB,
  overall_conclusion_summary TEXT,
  tone_headline TEXT,
  tone_bullets JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE(date, dimension_code)
);
