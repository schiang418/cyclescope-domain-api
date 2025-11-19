import 'dotenv/config';

console.log('=== Environment Variable Test ===\n');

const key = process.env.OPENAI_API_KEY;
console.log('API Key from process.env:');
console.log(`  Length: ${key?.length || 0}`);
console.log(`  Value: ${key}`);
console.log(`  First 50 chars: ${key?.substring(0, 50)}`);
console.log(`  Last 50 chars: ${key?.substring((key?.length || 0) - 50)}`);

