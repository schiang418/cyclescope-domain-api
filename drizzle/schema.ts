import { pgTable, serial, varchar, date, jsonb, text, integer, timestamp, unique } from 'drizzle-orm/pg-core';

/**
 * Domain Analyses Table
 * 
 * Stores detailed domain analysis data from OpenAI Assistant.
 * Each domain (Macro, Leadership, Breadth, Liquidity, Volatility, Sentiment) 
 * gets one record per day.
 * 
 * Retention: 5 days (older records automatically deleted)
 */
export const domainAnalyses = pgTable('domain_analyses', {
  id: serial('id').primaryKey(),
  
  // Composite unique key: one record per domain per day
  date: date('date').notNull(),
  dimensionCode: varchar('dimension_code', { length: 20 }).notNull(),
  
  // Metadata
  dimensionName: varchar('dimension_name', { length: 100 }).notNull(),
  asOfDate: date('as_of_date').notNull(),
  
  // Full analysis JSON (5-10 KB per domain)
  // Contains complete Assistant response including all indicators
  fullAnalysis: jsonb('full_analysis').notNull().$type<DomainAnalysisJSON>(),
  
  // Extracted fields for quick queries (avoid parsing JSONB)
  indicatorCount: integer('indicator_count'),
  integratedReadBullets: jsonb('integrated_read_bullets').$type<string[]>(),
  overallConclusionSummary: text('overall_conclusion_summary'),
  toneHeadline: text('tone_headline'),
  toneBullets: jsonb('tone_bullets').$type<string[]>(),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Ensure only one record per domain per day
  uniqueDomainPerDay: unique().on(table.date, table.dimensionCode),
}));

export type DomainAnalysis = typeof domainAnalyses.$inferSelect;
export type InsertDomainAnalysis = typeof domainAnalyses.$inferInsert;

/**
 * TypeScript type for the full_analysis JSONB field
 * Based on actual Assistant JSON output format
 */
export interface DomainAnalysisJSON {
  as_of_date: string;  // "YYYY-MM-DD"
  dimension_name: string;  // "Macro | Liquidity | Leadership | Breadth | Sentiment | Volatility"
  dimension_code: string;  // "macro | liquidity | leadership | breadth | sentiment | volatility"
  
  indicators: Indicator[];
  
  integrated_dimension_read: {
    bullets: string[];  // ["Indicator: one-line summary", ...]
  };
  
  overall_conclusion: {
    summary: string;  // "2-3 sentence domain-level conclusion"
  };
  
  dimension_tone: {
    tone_headline: string;  // "Short phrase"
    tone_bullets: string[];  // ["Bullet phrase", ...]
  };
}

export interface Indicator {
  indicator_id: string;  // "spx", "copper_gold", "usd", "tnx"
  indicator_name: string;  // "S&P 500", "Copper/Gold Ratio"
  symbol: string;  // "SPX", "COPPER:GOLD", "DXY", "TNX"
  role: string;  // "Equity benchmark", "Growth proxy", "Global financial conditions"
  
  long_term: {
    timeframe: string;  // "Monthly / 15-yr", "Weekly / 10-yr"
    analysis: string;  // Long-term analysis text (paragraph)
    takeaway: string;  // One-sentence takeaway
  };
  
  short_term: {
    timeframe: string;  // "Daily / 6-mo", "Weekly / 6-mo"
    analysis: string;  // Short-term analysis text (paragraph)
    takeaway: string;  // One-sentence takeaway
  };
}

