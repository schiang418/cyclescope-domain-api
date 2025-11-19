import { router, publicProcedure } from './trpc';
import { z } from 'zod';
import { generateDomainAnalysis } from './assistants/domainAnalysis';
import {
  upsertDomainAnalysis,
  getLatestDomainAnalysis,
  getAllLatestDomainAnalyses,
  getDomainAnalysisHistory,
  parseAssistantJSON,
} from './db';

/**
 * Main API Router
 * 
 * Provides endpoints for domain analysis generation and retrieval
 */
export const appRouter = router({
  // Health check endpoint
  health: publicProcedure.query(() => {
    const hasDatabase = !!process.env.DATABASE_URL;
    const hasOpenAI = !!process.env.OPENAI_API_KEY && !!process.env.OPENAI_ASSISTANT_ID;

    return {
      status: 'ok',
      service: 'CycleScope Domain API',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: hasDatabase ? 'connected' : 'not connected (Phase 2)',
      openai: hasOpenAI ? 'configured' : 'not configured (Phase 4)',
    };
  }),

  // Domain analysis endpoints
  domain: router({
    /**
     * Generate domain analysis using OpenAI Assistant
     * 
     * This endpoint:
     * 1. Calls OpenAI Assistant with chart URLs
     * 2. Parses the JSON response
     * 3. Stores the analysis in the database
     * 4. Returns the analysis
     */
    analyze: publicProcedure
      .input(z.object({
        dimensionCode: z.enum(['MACRO', 'LEADERSHIP', 'BREADTH', 'LIQUIDITY', 'VOLATILITY', 'SENTIMENT']),
        asOfDate: z.string().optional(), // YYYY-MM-DD format, defaults to today
      }))
      .mutation(async ({ input }) => {
        try {
          const { dimensionCode, asOfDate } = input;
          const date = asOfDate || new Date().toISOString().split('T')[0];

          console.log(`[API] Generating analysis for ${dimensionCode} as of ${date}`);

          // Generate analysis using OpenAI Assistant
          const analysisJSON = await generateDomainAnalysis(dimensionCode, date);

          // Parse and prepare for database
          const dbRecord = parseAssistantJSON(analysisJSON, date);

          // Store in database
          await upsertDomainAnalysis(dbRecord);

          console.log(`[API] Analysis complete for ${dimensionCode}`);

          return {
            success: true,
            dimensionCode,
            date,
            analysis: analysisJSON,
          };
        } catch (error) {
          console.error('[API] Failed to generate analysis:', error);
          throw new Error(`Failed to generate domain analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }),

    /**
     * Get latest domain analysis for a specific dimension
     */
    latest: publicProcedure
      .input(z.object({
        dimensionCode: z.enum(['MACRO', 'LEADERSHIP', 'BREADTH', 'LIQUIDITY', 'VOLATILITY', 'SENTIMENT']),
      }))
      .query(async ({ input }) => {
        try {
          const analysis = await getLatestDomainAnalysis(input.dimensionCode);
          
          if (!analysis) {
            return {
              found: false,
              dimensionCode: input.dimensionCode,
              message: 'No analysis found for this dimension',
            };
          }

          return {
            found: true,
            dimensionCode: input.dimensionCode,
            date: analysis.date,
            analysis: analysis.fullAnalysis,
          };
        } catch (error) {
          console.error('[API] Failed to get latest analysis:', error);
          throw new Error(`Failed to get latest analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }),

    /**
     * Get all latest domain analyses (one per domain)
     */
    all: publicProcedure.query(async () => {
      try {
        const analyses = await getAllLatestDomainAnalyses();
        
        return {
          count: analyses.length,
          analyses: analyses.map(a => ({
            dimensionCode: a.dimensionCode,
            dimensionName: a.dimensionName,
            date: a.date,
            asOfDate: a.asOfDate,
            toneHeadline: a.toneHeadline,
            overallConclusionSummary: a.overallConclusionSummary,
            indicatorCount: a.indicatorCount,
          })),
        };
      } catch (error) {
        console.error('[API] Failed to get all analyses:', error);
        throw new Error(`Failed to get all analyses: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

    /**
     * Get domain analysis history for a specific dimension
     */
    history: publicProcedure
      .input(z.object({
        dimensionCode: z.enum(['MACRO', 'LEADERSHIP', 'BREADTH', 'LIQUIDITY', 'VOLATILITY', 'SENTIMENT']),
        limit: z.number().min(1).max(30).optional().default(5),
      }))
      .query(async ({ input }) => {
        try {
          const analyses = await getDomainAnalysisHistory(input.dimensionCode, input.limit);
          
          return {
            dimensionCode: input.dimensionCode,
            count: analyses.length,
            analyses: analyses.map(a => ({
              date: a.date,
              asOfDate: a.asOfDate,
              toneHeadline: a.toneHeadline,
              overallConclusionSummary: a.overallConclusionSummary,
              indicatorCount: a.indicatorCount,
              createdAt: a.createdAt,
            })),
          };
        } catch (error) {
          console.error('[API] Failed to get analysis history:', error);
          throw new Error(`Failed to get analysis history: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;

