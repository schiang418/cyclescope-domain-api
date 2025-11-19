/**
 * Detailed OpenAI API diagnostic test
 */

import 'dotenv/config';
import OpenAI from 'openai';

async function main() {
  console.log('=== OpenAI API Diagnostic Test ===\n');

  const apiKey = process.env.OPENAI_API_KEY;
  const assistantId = process.env.OPENAI_ASSISTANT_ID;

  console.log('Environment:');
  console.log(`  API Key length: ${apiKey?.length || 0}`);
  console.log(`  API Key prefix: ${apiKey?.substring(0, 10)}...`);
  console.log(`  Assistant ID: ${assistantId}\n`);

  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY not set');
    process.exit(1);
  }

  // Test with different configurations
  console.log('Test 1: Default OpenAI client...');
  try {
    const client1 = new OpenAI({ apiKey });
    const response = await client1.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 5,
    });
    console.log('✅ Chat completion works!');
    console.log(`   Response: ${response.choices[0].message.content}\n`);
  } catch (error: any) {
    console.error('❌ Chat completion failed:');
    console.error(`   Status: ${error.status}`);
    console.error(`   Message: ${error.message}`);
    console.error(`   Type: ${error.type}`);
    console.error(`   Code: ${error.code}\n`);
  }

  // Test Assistant API specifically
  console.log('Test 2: Retrieving Assistant...');
  try {
    const client2 = new OpenAI({ apiKey });
    const assistant = await client2.beta.assistants.retrieve(assistantId!);
    console.log('✅ Assistant retrieved!');
    console.log(`   Name: ${assistant.name}`);
    console.log(`   Model: ${assistant.model}\n`);
  } catch (error: any) {
    console.error('❌ Assistant retrieval failed:');
    console.error(`   Status: ${error.status}`);
    console.error(`   Message: ${error.message}`);
    console.error(`   Headers:`, error.headers);
    console.error(`   Full error:`, JSON.stringify(error, null, 2));
  }

  process.exit(0);
}

main();

