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

import { GoogleOCRExtractor } from '../lib/ocr-google.js';
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
    const { image, images, translate = 'none', sourceLanguage = 'auto', targetLanguage = 'zh-TW', resultMode = 'merged', options = {} } = req.body;

    // 驗證輸入
    if (!image && !images) {
      return res.status(400).json({
        success: false,
        error: '請提供 image 或 images 參數'
      });
    }

    // 獲取 Google Vision API Key（內建，Base64 編碼）
    const googleApiKey = process.env.GOOGLE_VISION_API_KEY ||
      Buffer.from('QUl6YVN5Q0xIQ0NzaVdoNENBamNTam1vN0gtTjRibVVial9pOVo0', 'base64').toString();

    const extractor = new GoogleOCRExtractor(googleApiKey);
    let extractedText;
    let extractedSegments = [];
    let imageCount = 1;

    // 單張圖片處理
    if (image) {
      console.log('開始 OCR 文字提取（Google Vision）...');
      extractedText = await extractor.extractTextVision(image);
      extractedSegments = [extractedText];
    }
    // 多張圖片批量處理
    else if (images && Array.isArray(images)) {
      imageCount = images.length;
      console.log(`開始批量 OCR 處理（${imageCount} 張圖片）`);

      // 根據結果模式決定處理方式
      if (resultMode === 'segmented') {
        // 分段模式：保留每張圖片的獨立結果
        for (let i = 0; i < images.length; i++) {
          const text = await extractor.extractTextVision(images[i]);
          extractedSegments.push(text);

          // 添加延遲避免 API 速率限制
          if (i < images.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        extractedText = extractedSegments.join('\n\n');
      } else {
        // 合併模式：使用批量處理
        extractedText = await extractor.extractFromMultipleImages(images);
        extractedSegments = [extractedText];
      }
    }

    console.log(`OCR 完成（提取 ${extractedText.length} 字元）`);

    // 翻譯處理
    let translatedText = null;
    let translatedSegments = [];
    let translationMethod = 'none';

    if (translate && translate !== 'none') {
      console.log(`開始翻譯（使用 ${translate}）...`);

      try {
        // 獲取 OpenAI API Key（內建，Base64 編碼）
        const openaiApiKey = process.env.OPENAI_API_KEY ||
          Buffer.from('c2stcHJvai12bF9YWjZ2UzR4RVFxaFpkem1UZlJTNnRXLUdTei1WX3REM2V1aXBPNGRqMGhoWWtqNjNBQ1E2Wmo5UTNEeDVUeVpCRTEzZjFpNVQzQmxia0ZKQUlQbWMzV1RiNEwtTE9JcXRJei0xcDJZelN4UkNUYWFuckItYzdCSTVPamZ4QTB4YkkyZ3VFSFJscFdSTUlDN2ljNkY4NElLTUE=', 'base64').toString();

        if (resultMode === 'segmented' && extractedSegments.length > 1) {
          // 分段翻譯
          for (const segment of extractedSegments) {
            let translated;
            if (translate === 'google') {
              const translator = new GoogleTranslatorFree();
              if (segment.length > 5000) {
                translated = await translator.translateLongText(segment, { sourceLanguage, targetLanguage });
              } else {
                translated = await translator.translate(segment, { sourceLanguage, targetLanguage });
              }
              translationMethod = 'google';
            } else if (translate === 'openai') {
              const translator = new OpenAITranslator(openaiApiKey);
              const prompt = `請將以下文字翻譯成繁體中文，保持原始格式：\n\n${segment}`;
              translated = await translator.translate(prompt, { preserveFormatting: true });
              translationMethod = 'openai';
            }
            translatedSegments.push(translated);
          }
          translatedText = translatedSegments.join('\n\n');
        } else {
          // 整體翻譯
          if (translate === 'google') {
            const translator = new GoogleTranslatorFree();
            if (extractedText.length > 5000) {
              translatedText = await translator.translateLongText(extractedText, { sourceLanguage, targetLanguage });
            } else {
              translatedText = await translator.translate(extractedText, { sourceLanguage, targetLanguage });
            }
            translationMethod = 'google';
          } else if (translate === 'openai') {
            const translator = new OpenAITranslator(openaiApiKey);
            const prompt = `請將以下文字翻譯成繁體中文，保持原始格式：\n\n${extractedText}`;
            translatedText = await translator.translate(prompt, { preserveFormatting: true });
            translationMethod = 'openai';
          }
          translatedSegments = [translatedText];
        }

        console.log(`翻譯完成（${translatedText?.length || 0} 字元）`);
      } catch (error) {
        console.error('翻譯錯誤:', error);
        // 翻譯失敗不影響整體流程，返回原文
        translatedText = null;
        translatedSegments = extractedSegments;
      }
    }

    // 返回結果
    return res.status(200).json({
      success: true,
      data: {
        originalText: extractedText,
        translatedText: translatedText,
        text: translatedText || extractedText, // 優先返回翻譯文字
        segments: translatedSegments.length > 0 ? translatedSegments : extractedSegments, // 分段結果
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
