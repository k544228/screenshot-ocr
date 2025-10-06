/**
 * OCR 文字提取模組
 * 使用 OpenAI GPT-4o Vision 從截圖中提取繁體中文文字
 * 保持原始格式，忽略圖片內容
 */

import OpenAI from 'openai';

/**
 * OCR 文字提取器
 */
export class OCRExtractor {
  constructor(apiKey, options = {}) {
    const key = apiKey || process.env.OPENAI_API_KEY;

    if (!key) {
      throw new Error('未設定 OPENAI_API_KEY 環境變數');
    }

    this.client = new OpenAI({ apiKey: key });
    this.model = options.model || 'gpt-4o-mini';
    this.temperature = options.temperature || 0.1; // 低溫度以提高準確性
  }

  /**
   * 從圖片中提取文字
   * @param {string} imageData - Base64 編碼的圖片或圖片 URL
   * @param {object} options - 提取選項
   * @returns {Promise<string>} - 提取的文字內容
   */
  async extractText(imageData, options = {}) {
    const {
      preserveFormatting = true,
      ignoreImages = true
    } = options;

    const systemPrompt = this._buildSystemPrompt(preserveFormatting, ignoreImages);

    try {
      // 判斷是 URL 還是 Base64
      const imageContent = imageData.startsWith('http')
        ? { type: 'image_url', image_url: { url: imageData } }
        : { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageData}` } };

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: systemPrompt },
              imageContent
            ]
          }
        ],
        temperature: this.temperature,
        max_tokens: 4000,
      });

      const extractedText = response.choices[0].message.content.trim();

      if (!extractedText) {
        throw new Error('未能從圖片中提取到文字');
      }

      return extractedText;
    } catch (error) {
      if (error.status === 401) {
        throw new Error('OpenAI API Key 無效，請檢查 OPENAI_API_KEY 環境變數');
      } else if (error.status === 429) {
        throw new Error('API 配額已用盡或請求過於頻繁，請稍後再試');
      } else if (error.status === 400) {
        throw new Error('圖片格式錯誤或圖片過大，請檢查圖片');
      } else {
        throw new Error(`OCR 提取失敗: ${error.message}`);
      }
    }
  }

  /**
   * 批量處理多張截圖
   * @param {Array<string>} images - 圖片數據陣列
   * @returns {Promise<string>} - 合併的文字內容
   */
  async extractFromMultipleImages(images) {
    const results = [];

    for (let i = 0; i < images.length; i++) {
      console.log(`處理圖片 ${i + 1}/${images.length}`);
      const text = await this.extractText(images[i]);
      results.push(text);

      // 避免 API 限流
      if (i < images.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return results.join('\n\n');
  }

  /**
   * 建立系統提示詞
   */
  _buildSystemPrompt(preserveFormatting, ignoreImages) {
    let prompt = `請從這張截圖中提取所有文字內容。

要求：
1. 提取圖片中的所有文字
2. 保持原始語言（不要翻譯）
3. 只輸出文字內容，不要添加任何解釋或註釋`;

    if (preserveFormatting) {
      prompt += `\n4. 盡可能保持原始格式（標題、段落、列表等）`;
    }

    if (ignoreImages) {
      prompt += `\n5. 忽略截圖中的圖片、圖表、廣告等非文字內容`;
    }

    return prompt;
  }
}

/**
 * 便捷函數：快速提取文字
 */
export async function quickOCR(imageData, apiKey = null) {
  const extractor = new OCRExtractor(apiKey);
  return await extractor.extractText(imageData);
}

export default OCRExtractor;
