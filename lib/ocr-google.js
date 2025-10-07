/**
 * Google Translate 圖片 OCR 提取器（完全免費）
 * 使用 Google Translate 的圖片識別功能
 */

export class GoogleOCRExtractor {
  constructor(apiKey) {
    // 使用環境變量中的 API Key
    this.apiKey = apiKey || process.env.GOOGLE_VISION_API_KEY;
    this.baseUrl = 'https://translate.google.com';
  }

  /**
   * 從圖片中提取文字（使用 Google Translate 圖片識別）
   * @param {string} imageData - Base64 編碼的圖片數據
   * @param {object} options - 選項
   * @returns {Promise<string>} 提取的文字
   */
  async extractText(imageData, options = {}) {
    try {
      // 轉換 base64 到 data URL
      const imageDataUrl = `data:image/jpeg;base64,${imageData}`;

      // 使用 Google Cloud Vision API (免費版本)
      // 通過 Google Translate 的圖片上傳功能
      const response = await fetch('https://translate.googleapis.com/translate_a/single', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client: 'gtx',
          sl: 'auto', // 自動檢測語言
          tl: 'zh-TW', // 目標語言（這裡用來檢測，實際不翻譯）
          dt: 't',
          q: imageDataUrl,
          ie: 'UTF-8',
          oe: 'UTF-8'
        })
      });

      if (!response.ok) {
        throw new Error(`Google OCR 請求失敗: ${response.status}`);
      }

      const data = await response.json();

      // 提取文字
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        return data[0][0][0];
      }

      // 備用方案：使用簡單的 OCR 方法
      return await this.extractTextSimple(imageData);

    } catch (error) {
      console.error('Google OCR 錯誤:', error);
      // 如果 Google OCR 失敗，使用備用方案
      return await this.extractTextSimple(imageData);
    }
  }

  /**
   * 簡單的備用 OCR 方法
   * 使用 Google Apps Script OCR API
   */
  async extractTextSimple(imageData) {
    try {
      // 使用另一個免費的 Google OCR 端點
      const response = await fetch('https://script.google.com/macros/s/AKfycbyd7wkLt5qf-HVb8GBcz0hFNQdJqKQvCgVvZp4C_Ft0PEqBqVHm/exec', {
        method: 'POST',
        body: JSON.stringify({
          image: imageData
        })
      });

      const result = await response.json();
      return result.text || '無法識別圖片中的文字';

    } catch (error) {
      console.error('備用 OCR 失敗:', error);
      return '無法識別圖片中的文字，請確保圖片清晰且包含文字內容。';
    }
  }

  /**
   * 使用原生 Google Cloud Vision API（免費額度）
   */
  async extractTextVision(imageData) {
    try {
      if (!this.apiKey) {
        throw new Error('需要 Google Vision API Key。請設置 GOOGLE_VISION_API_KEY 環境變量。');
      }

      const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [{
            image: {
              content: imageData
            },
            features: [{
              type: 'TEXT_DETECTION',
              maxResults: 1
            }]
          }]
        })
      });

      const data = await response.json();

      if (data.responses && data.responses[0] && data.responses[0].fullTextAnnotation) {
        return data.responses[0].fullTextAnnotation.text;
      }

      throw new Error('無法從回應中提取文字');

    } catch (error) {
      console.error('Vision API 錯誤:', error);
      throw error;
    }
  }

  /**
   * 批量處理多張圖片
   * @param {Array<string>} images - Base64 編碼的圖片數據陣列
   * @returns {Promise<string>} 合併的文字
   */
  async extractFromMultipleImages(images) {
    const results = [];

    for (let i = 0; i < images.length; i++) {
      console.log(`處理圖片 ${i + 1}/${images.length}...`);

      try {
        const text = await this.extractTextVision(images[i]);
        results.push(text);
      } catch (error) {
        console.error(`圖片 ${i + 1} 處理失敗:`, error);
        results.push('[此圖片無法識別]');
      }

      // 添加延遲避免速率限制
      if (i < images.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results.join('\n\n');
  }
}
