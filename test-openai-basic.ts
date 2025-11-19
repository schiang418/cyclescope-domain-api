/**
 * Basic OpenAI API test
 * 
 * Tests:
 * 1. API key validity
 * 2. Assistant existence
 * 3. Basic API connectivity
 */

import 'dotenv/config';
import OpenAI from 'openai';

async function main() {
  console.log('=== OpenAI API Basic Test ===\n');

  const apiKey = process.env.OPENAI_API_KEY;
  const assistantId = process.env.OPENAI_ASSISTANT_ID;

  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY not set');
    process.exit(1);
  }

  if (!assistantId) {
    console.error('❌ OPENAI_ASSISTANT_ID not set');
    process.exit(1);
  }

  console.log('✅ Environment variables loaded');
  console.log(`   API Key: ${apiKey.substring(0, 20)}...`);
  console.log(`   Assistant ID: ${assistantId}\n`);

  const openai = new OpenAI({ apiKey });

  // Test 1: List models (basic API test)
  console.log('Test 1: Testing basic API connectivity...');
  try {
    const models = await openai.models.list();
    console.log('✅ API key is valid');
    console.log(`   Found ${models.data.length} models\n`);
  } catch (error: any) {
    console.error('❌ API key test failed:', error.message);
    process.exit(1);
  }

  // Test 2: Retrieve assistant
  console.log('Test 2: Checking if Assistant exists...');
  try {
    const assistant = await openai.beta.assistants.retrieve(assistantId);
    console.log('✅ Assistant found!');
    console.log(`   Name: ${assistant.name || 'Unnamed'}`);
    console.log(`   Model: ${assistant.model}`);
    console.log(`   Instructions: ${assistant.instructions?.substring(0, 100)}...`);
    console.log(`   Tools: ${assistant.tools.length} tools\n`);
  } catch (error: any) {
    console.error('❌ Assistant not found:', error.message);
    console.error('   Status:', error.status);
    console.error('   Error:', error);
    process.exit(1);
  }

  // Test 3: Create a simple thread
  console.log('Test 3: Creating a test thread...');
  try {
    const thread = await openai.beta.threads.create();
    console.log('✅ Thread created successfully');
    console.log(`   Thread ID: ${thread.id}\n`);
  } catch (error: any) {
    console.error('❌ Thread creation failed:', error.message);
    process.exit(1);
  }

  console.log('=== All Tests Passed ===');
  console.log('✅ API key is valid');
  console.log('✅ Assistant exists and is accessible');
  console.log('✅ Ready to use OpenAI Assistant API\n');
  
  process.exit(0);
}

main();

