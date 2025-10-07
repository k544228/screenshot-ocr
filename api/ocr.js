/**
 * Vercel Serverless Function
 * API 端點：從截圖中提取文字並可選翻譯
 *
 * 使用方式：
 * POST /api/ocr
 * Body: {
 *   "image": "base64_encoded_image_or_url",
 *   "translate": "google" | "openai" | "none",
 *   "targetLanguage": "zh-TW" | "en" | ...
 * }
 */

import { OCRExtractor } from '../lib/ocr.js';
import { GoogleTranslatorFree } from '../lib/translator-google.js';
import { OpenAITranslator } from '../lib/translator.js';

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
    const { image, images, translate = 'none', targetLanguage = 'zh-TW', options = {} } = req.body;

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

    // 翻譯處理
    let translatedText = null;
    let translationMethod = 'none';

    if (translate && translate !== 'none') {
      console.log(`開始翻譯（使用 ${translate}）...`);

      try {
        if (translate === 'google') {
          const translator = new GoogleTranslatorFree();
          if (extractedText.length > 5000) {
            translatedText = await translator.translateLongText(extractedText);
          } else {
            translatedText = await translator.translate(extractedText, { targetLanguage });
          }
          translationMethod = 'google';
        } else if (translate === 'openai') {
          const translator = new OpenAITranslator(apiKey);
          const prompt = `請將以下文字翻譯成繁體中文，保持原始格式：\n\n${extractedText}`;
          translatedText = await translator.translate(prompt, { preserveFormatting: true });
          translationMethod = 'openai';
        }

        console.log(`翻譯完成（${translatedText?.length || 0} 字元）`);
      } catch (error) {
        console.error('翻譯錯誤:', error);
        // 翻譯失敗不影響整體流程，返回原文
        translatedText = null;
      }
    }

    // 返回結果
    return res.status(200).json({
      success: true,
      data: {
        originalText: extractedText,
        translatedText: translatedText,
        text: translatedText || extractedText, // 優先返回翻譯文字
        stats: {
          imageCount,
          originalTextLength: extractedText.length,
          translatedTextLength: translatedText?.length || 0,
          translationMethod,
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
