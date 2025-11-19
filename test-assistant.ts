/**
 * Test script for OpenAI Assistant integration
 * 
 * Usage: npm run test:assistant
 */

import 'dotenv/config';
import { generateDomainAnalysis } from './server/assistants/domainAnalysis';

async function main() {
  console.log('=== OpenAI Assistant Integration Test ===\n');

  // Check environment variables
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not set in .env');
    process.exit(1);
  }

  if (!process.env.OPENAI_ASSISTANT_ID) {
    console.error('❌ OPENAI_ASSISTANT_ID not set in .env');
    process.exit(1);
  }

  console.log('✅ Environment variables loaded');
  console.log(`   API Key: ${process.env.OPENAI_API_KEY.substring(0, 20)}...`);
  console.log(`   Assistant ID: ${process.env.OPENAI_ASSISTANT_ID}\n`);

  try {
    console.log('Starting Macro domain analysis...\n');
    
    const result = await generateDomainAnalysis('macro', '2025-01-19');
    
    console.log('\n=== Analysis Complete ===\n');
    console.log('Dimension:', result.dimension_name);
    console.log('Code:', result.dimension_code);
    console.log('As of date:', result.as_of_date);
    console.log('Indicators analyzed:', result.indicators.length);
    console.log('Tone:', result.dimension_tone.tone_headline);
    console.log('\nFull response:');
    console.log(JSON.stringify(result, null, 2));
    
    console.log('\n✅ Test successful!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

main();

