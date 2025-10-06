import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function main() {
  console.log('API Key:', process.env.GOOGLE_API_KEY.substring(0, 20) + '...');

  try {
    // 使用 v1 API 而不是 v1beta
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = "Translate 'Hello, World!' to Traditional Chinese.";

    console.log('\n發送請求...');
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log('\n✅ 成功！');
    console.log('回應:', text);
  } catch (error) {
    console.error('\n❌ 錯誤:', error.message);
    console.error('\n完整錯誤:', error);
  }
}

main();
