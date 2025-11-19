import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, and, lt, sql } from 'drizzle-orm';
import { domainAnalyses, type DomainAnalysis, type InsertDomainAnalysis, type DomainAnalysisJSON } from '../drizzle/schema';

let _db: ReturnType<typeof drizzle> | null = null;

/**
 * Get database instance (lazy initialization)
 */
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL);
      _db = drizzle(client);
    } catch (error) {
      console.error('[Database] Failed to connect:', error);
      _db = null;
    }
  }
  return _db;
}

/**
 * Upsert domain analysis
 * 
 * Inserts a new record or updates existing one for the same date + dimension_code.
 * This ensures only one record per domain per day.
 * 
 * @param analysis - Domain analysis data to insert/update
 */
export async function upsertDomainAnalysis(analysis: InsertDomainAnalysis): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot upsert domain analysis: database not available');
    return;
  }

  try {
    await db
      .insert(domainAnalyses)
      .values(analysis)
      .onConflictDoUpdate({
        target: [domainAnalyses.date, domainAnalyses.dimensionCode],
        set: {
          dimensionName: analysis.dimensionName,
          asOfDate: analysis.asOfDate,
          fullAnalysis: analysis.fullAnalysis,
          indicatorCount: analysis.indicatorCount,
          integratedReadBullets: analysis.integratedReadBullets,
          overallConclusionSummary: analysis.overallConclusionSummary,
          toneHeadline: analysis.toneHeadline,
          toneBullets: analysis.toneBullets,
          updatedAt: sql`NOW()`,
        },
      });

    console.log(`[Database] Upserted domain analysis: ${analysis.dimensionCode} for ${analysis.date}`);
  } catch (error) {
    console.error('[Database] Failed to upsert domain analysis:', error);
    throw error;
  }
}

/**
 * Get latest domain analysis for a specific dimension
 * 
 * @param dimensionCode - Domain code (e.g., "macro", "leadership")
 * @returns Latest domain analysis or undefined if not found
 */
export async function getLatestDomainAnalysis(dimensionCode: string): Promise<DomainAnalysis | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot get domain analysis: database not available');
    return undefined;
  }

  try {
    const result = await db
      .select()
      .from(domainAnalyses)
      .where(eq(domainAnalyses.dimensionCode, dimensionCode))
      .orderBy(sql`${domainAnalyses.date} DESC`)
      .limit(1);

    return result[0];
  } catch (error) {
    console.error('[Database] Failed to get latest domain analysis:', error);
    return undefined;
  }
}

/**
 * Get all latest domain analyses (one per domain)
 * 
 * @returns Array of latest domain analyses for all dimensions
 */
export async function getAllLatestDomainAnalyses(): Promise<DomainAnalysis[]> {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot get domain analyses: database not available');
    return [];
  }

  try {
    // Get the latest date for each dimension_code
    const latestDates = await db
      .select({
        dimensionCode: domainAnalyses.dimensionCode,
        maxDate: sql<string>`MAX(${domainAnalyses.date})`.as('max_date'),
      })
      .from(domainAnalyses)
      .groupBy(domainAnalyses.dimensionCode);

    // Fetch full records for those latest dates
    const results: DomainAnalysis[] = [];
    for (const { dimensionCode, maxDate } of latestDates) {
      const record = await db
        .select()
        .from(domainAnalyses)
        .where(
          and(
            eq(domainAnalyses.dimensionCode, dimensionCode),
            eq(domainAnalyses.date, maxDate)
          )
        )
        .limit(1);

      if (record[0]) {
        results.push(record[0]);
      }
    }

    return results;
  } catch (error) {
    console.error('[Database] Failed to get all latest domain analyses:', error);
    return [];
  }
}

/**
 * Get domain analysis history for a specific dimension
 * 
 * @param dimensionCode - Domain code (e.g., "macro", "leadership")
 * @param limit - Maximum number of records to return (default: 5)
 * @returns Array of domain analyses ordered by date descending
 */
export async function getDomainAnalysisHistory(
  dimensionCode: string,
  limit: number = 5
): Promise<DomainAnalysis[]> {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot get domain analysis history: database not available');
    return [];
  }

  try {
    const results = await db
      .select()
      .from(domainAnalyses)
      .where(eq(domainAnalyses.dimensionCode, dimensionCode))
      .orderBy(sql`${domainAnalyses.date} DESC`)
      .limit(limit);

    return results;
  } catch (error) {
    console.error('[Database] Failed to get domain analysis history:', error);
    return [];
  }
}

/**
 * Clean up old domain analyses (5-day retention policy)
 * 
 * Deletes records older than 5 days to keep database size manageable.
 * Should be called periodically (e.g., daily after generating new analyses).
 */
export async function cleanupOldAnalyses(): Promise<number> {
  const db = await getDb();
  if (!db) {
    console.warn('[Database] Cannot cleanup old analyses: database not available');
    return 0;
  }

  try {
    // Calculate cutoff date (5 days ago)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 5);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0]; // "YYYY-MM-DD"

    // Delete records older than cutoff date
    const result = await db
      .delete(domainAnalyses)
      .where(lt(domainAnalyses.date, cutoffDateStr));

    const deletedCount = result.rowCount || 0;
    console.log(`[Database] Cleaned up ${deletedCount} old domain analyses (older than ${cutoffDateStr})`);

    return deletedCount;
  } catch (error) {
    console.error('[Database] Failed to cleanup old analyses:', error);
    return 0;
  }
}

/**
 * Parse Assistant JSON and prepare for database insertion
 * 
 * Extracts key fields from the full JSON for quick queries.
 * 
 * @param json - Raw JSON from OpenAI Assistant
 * @param date - Date for the analysis record (YYYY-MM-DD)
 * @returns InsertDomainAnalysis object ready for upsert
 */
export function parseAssistantJSON(json: DomainAnalysisJSON, date: string): InsertDomainAnalysis {
  return {
    date,
    dimensionCode: json.dimension_code,
    dimensionName: json.dimension_name,
    asOfDate: json.as_of_date,
    fullAnalysis: json,
    
    // Extracted fields
    indicatorCount: json.indicators?.length || 0,
    integratedReadBullets: json.integrated_dimension_read?.bullets || [],
    overallConclusionSummary: json.overall_conclusion?.summary || '',
    toneHeadline: json.dimension_tone?.tone_headline || '',
    toneBullets: json.dimension_tone?.tone_bullets || [],
  };
}

