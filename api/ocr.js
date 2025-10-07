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

    // 獲取 Google Vision 服務帳戶憑證（內建，Base64 編碼）
    const googleServiceAccount = process.env.GOOGLE_SERVICE_ACCOUNT ||
      'ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiZ2VuLWxhbmctY2xpZW50LTAyMTkyMDYwNTQiLAogICJwcml2YXRlX2tleV9pZCI6ICI0OTJjZTljY2I1NzZkMjk4ZjI2OGRiOGQ1NDJiODc4Zjg0NDZhN2RmIiwKICAicHJpdmF0ZV9rZXkiOiAiLS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tXG5NSUlFdlFJQkFEQU5CZ2txaGtpRzl3MEJBUUVGQUFTQ0JLY3dnZ1NqQWdFQUFvSUJBUUM2TmMvbzB6Mkc1SzhBXG54cC9ZNjgzTm0xTHNlQWpjYnJWNmN0Yzdrb1dXMmFHM0V5ZkI1SkdieTZwbEV3L2VGdUdJc0hwdmdXTk5FVFhuXG5SVnl5Z3ZUMEFXU21ucThQbHdOM2xwMXQ0ZGN3aVpkTkJDV1l3clJhQlpWRXkrZDRFODZBcTFQMFJXQmdxRVhlXG5tWXRWTTcwVm44eXZnWVpuSVZOZUlLdWVPVlZkc3Fpa2svMHhkM0Zjc3JmNTJwS2FwOEJHV0t1SUFRLzFEQzJGXG5HdnpQNTRqdDlkczduRGJpcFJXclpoeFlIeXFGRy96bkNhRFFsOXlQRENCMlNlOTYxMTZEbTg1bFM1ZVJ1UnhZXG5MSnVvRFRQVTdWV2owakY1RWczcVB1dmxLVFNqdmdRRVU5QkozQ1ZieTUyOWNBL3NOcmlaMXBkOGhsUVliOE91XG5GVXczMUp6YkFnTUJBQUVDZ2dFQVNmWTcyYitsN2FHQnZXNG5hYkxuc09Zai90Y0N0Z09uUTdhL3RPTFMrd01BXG5qOFlsQVllM0trbXdLYXR6bndRNW11QjJFVG8wWmhVUzh3U0MrRWk1NFAxNHJCSFZlUHpEbk1tUFNHanUzMUdYXG5iamphY2gzTUl3R2FzNVBHSWRURUxpbGZGR1JHRHI1bjJpM2t3UGZtLytMVUcxWDRPNWhxRTdZb1ZKVnpTZDZSXG5jTUJMbEtqQ0RFMkNjU29HdmlwS1p1OWZaMXUveHJpWnNIZXhJbm1yczZ6UHNXVmZmRHYzTmE1ajRwc2VURmdRXG5NUlZ0ZVNMRE1PWFlieU5Bdi9jSnB6N2NDdDc2bzkrOTZ6eFpTdXRJWUpnVDFiQ1JyWGFQbndBZXlUYXhFeTU2XG51V1RlSkdsV3J2K2FPTGt2YldHdTdQWE5zdmY4VXcrVkcrd1U2c1BBU1FLQmdRRHgzdHhaUGJWckZVMGl4ZmpvXG5vVEk4dUlYUHJ1b2NlVUlKbmFLL2JsQ3BPWS9SL2h4Rys3RlZnQ1V3cWZGdHl6RVhEUXB1SGF4bzJveDh3ZEx6XG5xa2VmekM5TWdpcktFV1l1Q2pMRWpndGlwYi9XOGVTaldZL2ZGdllIaVFlb0dCRE85bUFBcmlsVFJCS2ZwWFNnXG5pWmNNNCtrSmM4NERvcjlXTEtPbjZKYmJQd0tCZ1FERkZvOFcvdXFweTVyNStDd05jQjcwbTczWlgxUDkrT1pGXG53M0ZDNElPdlpRS1JLMjdxTmo0aVI5c2wvUjZjNExoOXU2Yk0vRmRjcUJGSXVoQkxMU2VjcXJ0K29ubjA1a0VJXG54TzQ0ZURtZjVUVmd2ZHpyNmVpV2hodFB3aVlSNjk4YnFjcnhrdFU5Z0QvODBtUEc0dXd0K0o0c3R2MDRvK2x5XG5NNWU3Ym9talpRS0JnSG1kdnB3Y3ZERG8yQTFKRUR3Z2VYc3dxUS9oZXBQd29MVG5EMk5FRzhqTFNiYWtHQ0hWXG5BcmprSTA4UjFIU0plOWlFVlI5RFNtSzZxWE05bmsybzdEUzhYWGdSNTJRTlZaeUd3am8wMWlLM0J2d1VTd3ViXG55QXk3cGQvcUZmQitrVTBQY3Z4RWxrRG85SmhUZ0k0TVFPaFpYTjdFM096VkUzSklKYzRTMUcvUEFvR0FZVkdQXG5YSEtKbTBnL2dWa3JINE9TdFlSRnpaVkYyeTNSUHZlUDhNNytGMWlRV1BDU2R6SkxvZy9MUmNua0dPRGFHTFBWXG5YSGpxQm9XeTZ5OTlKakhvMG5KMzNNTUw1NExlOEI2VjV1cHV3ZWFqWWQ2K3ZQc21iMVZQSFNZb09FYzVSdWFqXG5vSCs1cmdHckZ3TW9ZNmZmcVorUE0xTTBYSWlMbUdtamJkamFQQVVDZ1lFQXVqbEczamFvOXl2anBQZjBrNG1FXG5Pd1JXVUFPS3cwaXo0UDhNNEJKaTAxbDJxeklIVldRNHlOWG1WbmRhbWRPTy9aWnpQQ2lYQXFrWUdSeUEzSENiXG4wVmsra0thTE1ZOWtTa0E4TTFoQWlHOW53bThRMlV3eFBvRW9QMGtLcGh6aUtER2lRQVpzWkdORzMvNW1rdG14XG4yK3lacEZkeEF2UkU3Uk5Dd3JydENMQT1cbi0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS1cbiIsCiAgImNsaWVudF9lbWFpbCI6ICIyNzYyNjQ2MTI0NzktY29tcHV0ZUBkZXZlbG9wZXIuZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgImNsaWVudF9pZCI6ICIxMTMxODc0MTc5ODQzMjI4NzA1MDUiLAogICJhdXRoX3VyaSI6ICJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20vby9vYXV0aDIvYXV0aCIsCiAgInRva2VuX3VyaSI6ICJodHRwczovL29hdXRoMi5nb29nbGVhcGlzLmNvbS90b2tlbiIsCiAgImF1dGhfcHJvdmlkZXJfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9vYXV0aDIvdjEvY2VydHMiLAogICJjbGllbnRfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9yb2JvdC92MS9tZXRhZGF0YS94NTA5LzI3NjI2NDYxMjQ3OS1jb21wdXRlJTQwZGV2ZWxvcGVyLmdzZXJ2aWNlYWNjb3VudC5jb20iLAogICJ1bml2ZXJzZV9kb21haW4iOiAiZ29vZ2xlYXBpcy5jb20iCn0K';

    const extractor = new GoogleOCRExtractor(googleServiceAccount);
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
              const translator = new OpenAITranslator(apiKey);
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
            const translator = new OpenAITranslator(apiKey);
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
