/**
 * Vercel Serverless Function
 * API 端點：從截圖中提取文字
 *
 * 使用方式：
 * POST /api/ocr
 * Body: { "image": "base64_encoded_image_or_url" }
 *
 * 或上傳多張圖片：
 * Body: { "images": ["image1", "image2", ...] }
 */

import { OCRExtractor } from '../lib/ocr.js';

export default async function handler(req, res) {
  // 設置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 處理 OPTIONS 請求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只接受 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: '只支援 POST 請求'
    });
  }

  try {
    const { image, images, options = {} } = req.body;

    // 驗證輸入
    if (!image && !images) {
      return res.status(400).json({
        success: false,
        error: '請提供 image 或 images 參數'
      });
    }

    // 驗證 API 金鑰
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: '伺服器配置錯誤：缺少 OPENAI_API_KEY'
      });
    }

    const extractor = new OCRExtractor(apiKey);
    let extractedText;
    let imageCount = 1;

    // 單張圖片處理
    if (image) {
      console.log('開始 OCR 文字提取...');
      extractedText = await extractor.extractText(image, {
        preserveFormatting: true,
        ignoreImages: true,
        ...options
      });
    }
    // 多張圖片批量處理
    else if (images && Array.isArray(images)) {
      imageCount = images.length;
      console.log(`開始批量 OCR 處理（${imageCount} 張圖片）`);
      extractedText = await extractor.extractFromMultipleImages(images);
    }

    console.log(`OCR 完成（提取 ${extractedText.length} 字元）`);

    // 返回結果
    return res.status(200).json({
      success: true,
      data: {
        text: extractedText,
        stats: {
          imageCount,
          textLength: extractedText.length,
          extractedAt: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('OCR 錯誤:', error);

    return res.status(500).json({
      success: false,
      error: error.message || 'OCR 過程中發生錯誤'
    });
  }
}
