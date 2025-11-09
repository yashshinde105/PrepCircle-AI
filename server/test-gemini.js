import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

console.log('🔍 Testing Gemini API...\n');

// Test 1: List available models
console.log('📋 Attempting to list available models...');
try {
  const models = await genAI.listModels();
  console.log('✅ Available models:');
  models.forEach(model => {
    console.log(`  • ${model.name}`);
    console.log(`    Display Name: ${model.displayName}`);
    console.log(`    Supported Methods: ${model.supportedGenerationMethods.join(', ')}`);
    console.log('');
  });
} catch (error) {
  console.error('❌ Error listing models:', error.message);
}

// Test 2: Try generating content with different models
const testModels = [
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-1.5-pro-latest',
  'gemini-1.5-pro',
  'gemini-pro',
  'models/gemini-1.5-flash-latest',
  'models/gemini-1.5-flash',
  'models/gemini-pro'
];

console.log('\n🧪 Testing content generation with different model names...\n');

for (const modelName of testModels) {
  try {
    console.log(`Testing: ${modelName}...`);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Say "Hello, this model works!" in one sentence.');
    const response = await result.response;
    const text = response.text();
    console.log(`✅ SUCCESS with ${modelName}`);
    console.log(`   Response: ${text}\n`);
    break; // Stop on first success
  } catch (error) {
    console.log(`❌ FAILED with ${modelName}: ${error.message}\n`);
  }
}

console.log('🏁 Test complete!');
