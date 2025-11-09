import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log('🔑 API Key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT FOUND');
console.log('\n📡 Testing Gemini API endpoints...\n');

// Test different API versions and model names
const tests = [
  { version: 'v1beta', model: 'gemini-pro' },
  { version: 'v1beta', model: 'gemini-1.5-flash' },
  { version: 'v1beta', model: 'gemini-1.5-pro' },
  { version: 'v1', model: 'gemini-pro' },
  { version: 'v1', model: 'gemini-1.5-flash' },
  { version: 'v1', model: 'gemini-1.5-pro' },
];

for (const test of tests) {
  const url = `https://generativelanguage.googleapis.com/${test.version}/models/${test.model}:generateContent?key=${API_KEY}`;
  
  try {
    console.log(`Testing: ${test.version}/models/${test.model}...`);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: 'Hello' }]
        }]
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ SUCCESS! Model works: ${test.version}/models/${test.model}`);
      console.log(`   Response: ${JSON.stringify(data.candidates?.[0]?.content?.parts?.[0]?.text || data).substring(0, 100)}...\n`);
      break; // Stop on first success
    } else {
      console.log(`❌ Failed: ${data.error?.message || JSON.stringify(data).substring(0, 100)}\n`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
  }
}

console.log('\n🔍 Trying to list available models...\n');

const listUrls = [
  `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`,
  `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`,
];

for (const url of listUrls) {
  try {
    const version = url.includes('/v1beta/') ? 'v1beta' : 'v1';
    console.log(`Listing models from ${version}...`);
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok && data.models) {
      console.log(`✅ Available models in ${version}:`);
      data.models.forEach(model => {
        console.log(`  • ${model.name} - ${model.displayName || 'N/A'}`);
        console.log(`    Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
      });
      break;
    } else {
      console.log(`❌ ${data.error?.message || 'Failed to list models'}\n`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
  }
}
