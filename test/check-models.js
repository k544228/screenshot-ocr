import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// 測試不同的模型名稱
const modelsToTry = [
  'gemini-pro',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-1.0-pro',
];

async function testModel(modelName) {
  try {
    console.log(`\n測試模型: ${modelName}`);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Hello');
    const response = await result.response;
    const text = response.text();
    console.log(`✅ ${modelName} 可用！回應: ${text.substring(0, 50)}...`);
    return true;
  } catch (error) {
    console.log(`❌ ${modelName} 不可用: ${error.message.substring(0, 100)}`);
    return false;
  }
}

async function main() {
  console.log('檢查可用的 Gemini 模型...\n');

  for (const model of modelsToTry) {
    await testModel(model);
  }
}

main();
