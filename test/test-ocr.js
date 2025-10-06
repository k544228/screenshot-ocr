/**
 * OCR 功能測試
 * 測試從圖片中提取文字的功能
 */

import { OCRExtractor } from '../lib/ocr.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// 載入環境變數
dotenv.config();

console.log('\n🧪 OCR 文字提取測試套件\n');
console.log('開始時間:', new Date().toLocaleString('zh-TW'));

// 檢查 API 金鑰
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ 未設定 OPENAI_API_KEY 環境變數');
  console.log('\n請在 .env 文件中設定 OPENAI_API_KEY');
  process.exit(1);
}

console.log('✓ API 金鑰已設定');
console.log('✓ 使用模型: gpt-4o-mini (支持視覺)');

/**
 * 測試用的示例圖片 URL
 * 使用真實的中文文字截圖測試
 */
const TEST_IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/200px-Wikipedia-logo-v2.svg.png';

/**
 * 測試 1: 使用公開圖片 URL
 */
async function testImageURL() {
  console.log('\n📝 測試 1: 從圖片 URL 提取文字');
  console.log('==================================================');

  try {
    const extractor = new OCRExtractor();

    console.log('測試圖片:', TEST_IMAGE_URL);
    console.log('\n開始 OCR 處理...\n');

    const text = await extractor.extractText(TEST_IMAGE_URL, {
      preserveFormatting: true,
      ignoreImages: true
    });

    console.log('✅ 提取成功！\n');
    console.log('提取的文字長度:', text.length, '字元');
    console.log('\n==================================================');
    console.log('提取結果:');
    console.log('==================================================');
    console.log(text);
    console.log('==================================================\n');

    return true;
  } catch (error) {
    console.error('❌ 提取失敗:', error.message);
    return false;
  }
}

/**
 * 測試 2: 使用本地圖片（如果存在）
 */
async function testLocalImage() {
  console.log('\n📝 測試 2: 從本地圖片提取文字');
  console.log('==================================================');

  const testImagePath = path.join(process.cwd(), 'test', 'test-image.png');

  // 檢查測試圖片是否存在
  if (!fs.existsSync(testImagePath)) {
    console.log('⏭️  跳過：未找到測試圖片');
    console.log(`   請將測試圖片放在: ${testImagePath}`);
    return true;
  }

  try {
    const extractor = new OCRExtractor();

    // 讀取圖片並轉換為 Base64
    const imageBuffer = fs.readFileSync(testImagePath);
    const base64Image = imageBuffer.toString('base64');

    console.log('圖片大小:', (imageBuffer.length / 1024).toFixed(2), 'KB');
    console.log('\n開始 OCR 處理...\n');

    const text = await extractor.extractText(base64Image, {
      preserveFormatting: true,
      ignoreImages: true
    });

    console.log('✅ 提取成功！\n');
    console.log('提取的文字長度:', text.length, '字元');
    console.log('\n==================================================');
    console.log('提取結果:');
    console.log('==================================================');
    console.log(text);
    console.log('==================================================\n');

    return true;
  } catch (error) {
    console.error('❌ 提取失敗:', error.message);
    return false;
  }
}

/**
 * 測試說明
 */
function printInstructions() {
  console.log('\n📖 測試說明');
  console.log('==================================================');
  console.log('1. 測試 1 使用公開圖片 URL（需要網路連接）');
  console.log('2. 測試 2 使用本地圖片（可選）');
  console.log('\n如何提供測試圖片：');
  console.log('- 將截圖保存為 test/test-image.png');
  console.log('- 或使用任何包含中文文字的圖片');
  console.log('\n實際使用方式：');
  console.log('- iOS Shortcut 會將截圖轉為 Base64');
  console.log('- 發送 POST 請求到 /api/ocr');
  console.log('- 返回提取的文字內容');
  console.log('==================================================\n');
}

/**
 * 執行所有測試
 */
async function runAllTests() {
  const testNumber = process.argv[2];

  if (testNumber === '1') {
    await testImageURL();
  } else if (testNumber === '2') {
    await testLocalImage();
  } else {
    printInstructions();
    console.log('提示: 運行 "npm run test:ocr 1" 測試圖片 URL');
    console.log('     運行 "npm run test:ocr 2" 測試本地圖片\n');
  }

  console.log('\n✅ 測試完成！\n');
}

// 執行測試
runAllTests().catch(error => {
  console.error('\n💥 測試過程發生錯誤:', error);
  process.exit(1);
});
