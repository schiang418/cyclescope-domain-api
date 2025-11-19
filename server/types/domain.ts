/**
 * TypeScript Types for Domain Analysis
 * 
 * Defines all types used in the domain analysis system
 */

/**
 * Domain Analysis Request
 */
export interface DomainAnalysisRequest {
  dimensionCode: string;
  date?: string;  // Optional, defaults to today
}

/**
 * Domain Analysis Response (matches Assistant JSON output)
 */
export interface DomainAnalysisResponse {
  as_of_date: string;
  dimension_name: string;
  dimension_code: string;
  indicators: IndicatorAnalysis[];
  integrated_dimension_read: {
    bullets: string[];
  };
  overall_conclusion: {
    summary: string;
  };
  dimension_tone: {
    tone_headline: string;
    tone_bullets: string[];
  };
}

/**
 * Indicator Analysis (from Assistant JSON)
 */
export interface IndicatorAnalysis {
  indicator_id: string;
  indicator_name: string;
  symbol: string;
  role: string;
  long_term: {
    timeframe: string;
    analysis: string;
    takeaway: string;
  };
  short_term: {
    timeframe: string;
    analysis: string;
    takeaway: string;
  };
}

/**
 * Database Record Type (matches drizzle schema)
 */
export interface DomainAnalysisRecord {
  id: number;
  date: string;  // DATE type in database
  dimensionCode: string;
  dimensionName: string;
  asOfDate: string;  // DATE type in database
  fullAnalysis: DomainAnalysisResponse;  // JSONB
  indicatorCount: number | null;
  integratedReadBullets: string[] | null;  // JSONB
  overallConclusionSummary: string | null;
  toneHeadline: string | null;
  toneBullets: string[] | null;  // JSONB
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Insert Type (for database operations)
 */
export interface InsertDomainAnalysis {
  date: string;
  dimensionCode: string;
  dimensionName: string;
  asOfDate: string;
  fullAnalysis: DomainAnalysisResponse;
  indicatorCount?: number;
  integratedReadBullets?: string[];
  overallConclusionSummary?: string;
  toneHeadline?: string;
  toneBullets?: string[];
}

/**
 * API Response Types
 */
export interface LatestDomainAnalysisResponse {
  success: boolean;
  data: DomainAnalysisResponse | null;
  error?: string;
}

export interface AllDomainsResponse {
  success: boolean;
  data: DomainAnalysisResponse[];
  error?: string;
}

export interface DomainHistoryResponse {
  success: boolean;
  data: DomainAnalysisResponse[];
  days: number;
  error?: string;
}

/**
 * OpenAI Assistant Types
 */
export interface AssistantRunOptions {
  assistantId: string;
  instructions: string;
  imageUrls: string[];
  model?: string;
  temperature?: number;
}

export interface AssistantRunResult {
  success: boolean;
  response?: DomainAnalysisResponse;
  error?: string;
  runId?: string;
  threadId?: string;
}

/**
 * HTML Generation Types
 */
export interface HTMLGenerationOptions {
  domainAnalysis: DomainAnalysisResponse;
  outputPath: string;
  template?: string;
}

export interface HTMLGenerationResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

