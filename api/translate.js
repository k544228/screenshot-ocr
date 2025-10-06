/**
 * Vercel Serverless Function
 * API 端點：翻譯網頁內容
 *
 * 使用方式：
 * POST /api/translate
 * Body: { "url": "https://example.com/article" }
 *
 * 或
 *
 * POST /api/translate
 * Body: { "content": "Text to translate..." }
 */

import { ClaudeTranslator } from '../lib/translator.js';
import { extractContent, isValidUrl, normalizeUrl } from '../lib/content-extractor.js';

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
    const { url, content, options = {} } = req.body;

    // 驗證輸入
    if (!url && !content) {
      return res.status(400).json({
        success: false,
        error: '請提供 url 或 content 參數'
      });
    }

    let textToTranslate = content;
    let extractedData = null;

    // 如果提供 URL，先提取內容
    if (url) {
      const normalizedUrl = normalizeUrl(url);

      if (!isValidUrl(normalizedUrl)) {
        return res.status(400).json({
          success: false,
          error: '無效的 URL 格式'
        });
      }

      console.log(`提取內容: ${normalizedUrl}`);
      extractedData = await extractContent(normalizedUrl);

      if (!extractedData.success) {
        return res.status(500).json({
          success: false,
          error: `內容提取失敗: ${extractedData.error}`
        });
      }

      // 組合標題和內容
      textToTranslate = `# ${extractedData.title}\n\n${extractedData.content}`;
    }

    // 驗證 API 金鑰
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: '伺服器配置錯誤：缺少 API 金鑰'
      });
    }

    // 執行翻譯
    console.log(`開始翻譯（長度: ${textToTranslate.length} 字元）`);
    const translator = new ClaudeTranslator(apiKey);

    let translation;
    // 如果文章很長，使用分段翻譯
    if (textToTranslate.length > 3000) {
      translation = await translator.translateLongText(textToTranslate);
    } else {
      translation = await translator.translate(textToTranslate, {
        preserveFormatting: true,
        ...options
      });
    }

    console.log(`翻譯完成（長度: ${translation.length} 字元）`);

    // 返回結果
    return res.status(200).json({
      success: true,
      data: {
        originalUrl: url || null,
        extractedTitle: extractedData?.title || null,
        translation,
        stats: {
          originalLength: textToTranslate.length,
          translationLength: translation.length,
          translatedAt: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('翻譯錯誤:', error);

    return res.status(500).json({
      success: false,
      error: error.message || '翻譯過程中發生錯誤'
    });
  }
}
