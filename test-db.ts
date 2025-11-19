/**
 * Database Test Script
 * 
 * Tests database operations with mock data
 * Run with: npm run test:db
 */

import { upsertDomainAnalysis, getLatestDomainAnalysis, getAllLatestDomainAnalyses, cleanupOldAnalyses, parseAssistantJSON } from './server/db';
import type { DomainAnalysisJSON } from './drizzle/schema';

// Mock Assistant JSON (Macro domain example)
const mockMacroJSON: DomainAnalysisJSON = {
  as_of_date: "2025-01-15",
  dimension_name: "Macro",
  dimension_code: "macro",
  
  indicators: [
    {
      indicator_id: "spx",
      indicator_name: "S&P 500",
      symbol: "SPX",
      role: "Equity benchmark",
      long_term: {
        timeframe: "Monthly / 15-yr",
        analysis: "The long-term trend remains upward, with the index holding above major multi-year support zones.",
        takeaway: "Long-term trend is still up, but momentum has moderated."
      },
      short_term: {
        timeframe: "Daily / 6-mo",
        analysis: "SPX remains above the 20-day and 50-day moving averages, though both have begun to flatten.",
        takeaway: "Short-term trend is positive but softening."
      }
    },
    {
      indicator_id: "copper_gold",
      indicator_name: "Copper/Gold Ratio",
      symbol: "COPPER:GOLD",
      role: "Growth proxy",
      long_term: {
        timeframe: "Weekly / 10-yr",
        analysis: "The ratio has been declining for several years and has broken below major long-term support levels.",
        takeaway: "Long-term trend shows sustained weakness in growth appetite."
      },
      short_term: {
        timeframe: "Weekly / 6-mo",
        analysis: "The ratio remains pinned near the lows without any basing structure.",
        takeaway: "Short-term action continues to confirm weakness."
      }
    }
  ],
  
  integrated_dimension_read: {
    bullets: [
      "SPX: Uptrend intact but momentum softening",
      "Copper/Gold: Persistent weakness signals soft growth appetite"
    ]
  },
  
  overall_conclusion: {
    summary: "Macro indicators show firm equity structure, weak growth proxies, and strengthening dollar and yields."
  },
  
  dimension_tone: {
    tone_headline: "Mixed macro conditions across major indicators",
    tone_bullets: [
      "SPX trend firm but moderating",
      "Growth proxy weak",
      "USD firming"
    ]
  }
};

async function testDatabase() {
  console.log('\n🧪 Testing Database Operations\n');
  console.log('=' .repeat(60));
  
  try {
    // Test 1: Parse Assistant JSON
    console.log('\n1️⃣  Testing parseAssistantJSON()...');
    const today = new Date().toISOString().split('T')[0];
    const parsedData = parseAssistantJSON(mockMacroJSON, today);
    console.log('✅ Parsed data:');
    console.log(`   - Date: ${parsedData.date}`);
    console.log(`   - Dimension: ${parsedData.dimensionName} (${parsedData.dimensionCode})`);
    console.log(`   - Indicator Count: ${parsedData.indicatorCount}`);
    console.log(`   - Tone Headline: ${parsedData.toneHeadline}`);
    
    // Test 2: Upsert domain analysis
    console.log('\n2️⃣  Testing upsertDomainAnalysis()...');
    await upsertDomainAnalysis(parsedData);
    console.log('✅ Upserted domain analysis successfully');
    
    // Test 3: Get latest domain analysis
    console.log('\n3️⃣  Testing getLatestDomainAnalysis()...');
    const latest = await getLatestDomainAnalysis('macro');
    if (latest) {
      console.log('✅ Retrieved latest analysis:');
      console.log(`   - ID: ${latest.id}`);
      console.log(`   - Date: ${latest.date}`);
      console.log(`   - Dimension: ${latest.dimensionName}`);
      console.log(`   - Indicators: ${latest.indicatorCount}`);
      console.log(`   - Tone: ${latest.toneHeadline}`);
    } else {
      console.log('❌ No analysis found');
    }
    
    // Test 4: Get all latest analyses
    console.log('\n4️⃣  Testing getAllLatestDomainAnalyses()...');
    const allLatest = await getAllLatestDomainAnalyses();
    console.log(`✅ Retrieved ${allLatest.length} domain analyses:`);
    allLatest.forEach(analysis => {
      console.log(`   - ${analysis.dimensionName}: ${analysis.date}`);
    });
    
    // Test 5: Cleanup old analyses
    console.log('\n5️⃣  Testing cleanupOldAnalyses()...');
    const deletedCount = await cleanupOldAnalyses();
    console.log(`✅ Cleaned up ${deletedCount} old records`);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ All database tests passed!\n');
    
  } catch (error) {
    console.error('\n❌ Database test failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

testDatabase();

