/**
 * 測試翻譯功能
 * 使用方式：npm test
 */

import 'dotenv/config';
import { OpenAITranslator } from '../lib/translator.js';
import { extractContent } from '../lib/content-extractor.js';

// 測試文本
const TEST_CONTENT = `
# Analysts Warn AI Bubble Surpasses Dot-Com Era

The rapid expansion of AI investments has raised concerns among financial analysts, who are drawing comparisons to the dot-com bubble of the late 1990s and early 2000s. Some experts believe the current surge in AI-related stocks and venture capital funding may be unsustainable.

According to recent market analysis, companies adding "AI" to their names or products have seen dramatic stock price increases, reminiscent of the ".com" effect during the internet boom. This has led to valuations that many consider inflated beyond reasonable expectations.

However, not all analysts agree. Supporters argue that unlike the dot-com era, AI technologies are already demonstrating real-world applications and generating revenue across various industries, from healthcare to manufacturing.
`.trim();

// 測試 URL（可以替換為實際的 Perplexity 文章）
const TEST_URL = 'https://www.perplexity.ai/discover/you/analysts-warn-ai-bubble-surpas-OR1EcSq6Tz6seO8XN9Ic4w';

async function testDirectTranslation() {
  console.log('\n📝 測試 1: 直接翻譯文本\n');
  console.log('='.repeat(50));

  try {
    const translator = new OpenAITranslator();
    console.log('開始翻譯...');

    const translation = await translator.translate(TEST_CONTENT, {
      preserveFormatting: true
    });

    console.log('\n✅ 翻譯成功！\n');
    console.log('原文長度:', TEST_CONTENT.length, '字元');
    console.log('譯文長度:', translation.length, '字元');
    console.log('\n' + '='.repeat(50));
    console.log('翻譯結果:');
    console.log('='.repeat(50));
    console.log(translation);
    console.log('='.repeat(50));

    return true;
  } catch (error) {
    console.error('\n❌ 翻譯失敗:', error.message);
    return false;
  }
}

async function testUrlExtraction() {
  console.log('\n🌐 測試 2: 從 URL 提取內容\n');
  console.log('='.repeat(50));
  console.log('URL:', TEST_URL);

  try {
    console.log('\n提取內容中...');
    const result = await extractContent(TEST_URL);

    if (!result.success) {
      console.error('\n❌ 內容提取失敗:', result.error);
      return false;
    }

    console.log('\n✅ 內容提取成功！\n');
    console.log('標題:', result.title);
    console.log('內容長度:', result.content.length, '字元');
    console.log('提取時間:', result.extractedAt);
    console.log('\n前 200 字元:');
    console.log(result.content.substring(0, 200) + '...');

    return result;
  } catch (error) {
    console.error('\n❌ 提取失敗:', error.message);
    return false;
  }
}

async function testFullWorkflow() {
  console.log('\n🚀 測試 3: 完整工作流程（提取 + 翻譯）\n');
  console.log('='.repeat(50));

  try {
    // 步驟 1: 提取內容
    console.log('步驟 1/2: 提取文章內容...');
    const extracted = await extractContent(TEST_URL);

    if (!extracted.success) {
      throw new Error(`提取失敗: ${extracted.error}`);
    }

    console.log('✓ 提取成功');
    console.log('  標題:', extracted.title);
    console.log('  長度:', extracted.content.length, '字元\n');

    // 步驟 2: 翻譯
    console.log('步驟 2/2: 翻譯成繁體中文...');
    const translator = new OpenAITranslator();

    const fullText = `# ${extracted.title}\n\n${extracted.content}`;
    let translation;

    if (fullText.length > 3000) {
      console.log('  文章較長，使用分段翻譯...');
      translation = await translator.translateLongText(fullText);
    } else {
      translation = await translator.translate(fullText, {
        preserveFormatting: true
      });
    }

    console.log('✓ 翻譯成功\n');

    console.log('='.repeat(50));
    console.log('📊 統計資訊');
    console.log('='.repeat(50));
    console.log('原文長度:', fullText.length, '字元');
    console.log('譯文長度:', translation.length, '字元');
    console.log('完成時間:', new Date().toLocaleString('zh-TW'));

    console.log('\n' + '='.repeat(50));
    console.log('📄 翻譯結果');
    console.log('='.repeat(50));
    console.log(translation);
    console.log('='.repeat(50));

    return true;
  } catch (error) {
    console.error('\n❌ 測試失敗:', error.message);
    return false;
  }
}

// 主測試函數
async function runTests() {
  console.log('\n🧪 Perplexity 翻譯器測試套件\n');
  console.log('開始時間:', new Date().toLocaleString('zh-TW'));

  // 檢查 API 金鑰
  if (!process.env.OPENAI_API_KEY) {
    console.error('\n❌ 錯誤: 未設定 OPENAI_API_KEY 環境變數');
    console.error('請在 .env 文件中設定你的 OpenAI API 金鑰\n');
    process.exit(1);
  }

  console.log('✓ API 金鑰已設定');
  console.log('✓ 使用模型:', process.env.OPENAI_MODEL || 'gpt-4o-mini');

  // 選擇測試
  const args = process.argv.slice(2);
  const testType = args[0] || 'all';

  try {
    if (testType === 'all' || testType === '1') {
      await testDirectTranslation();
    }

    if (testType === 'all' || testType === '2') {
      await testUrlExtraction();
    }

    if (testType === 'all' || testType === '3') {
      await testFullWorkflow();
    }

    console.log('\n\n✅ 所有測試完成！\n');
  } catch (error) {
    console.error('\n\n❌ 測試過程中發生錯誤:', error);
    process.exit(1);
  }
}

// 執行測試
runTests();
