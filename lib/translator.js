/**
 * OpenAI API 翻譯模組
 * 使用 OpenAI GPT-4o-mini 將英文文章翻譯成繁體中文
 * 費用極低，品質優秀！
 */

import OpenAI from 'openai';

/**
 * 創建翻譯器實例
 */
export class OpenAITranslator {
  constructor(apiKey, options = {}) {
    const key = apiKey || process.env.OPENAI_API_KEY;

    if (!key) {
      throw new Error('未設定 OPENAI_API_KEY 環境變數');
    }

    this.client = new OpenAI({ apiKey: key });
    this.model = options.model || process.env.OPENAI_MODEL || 'gpt-4o-mini';
    this.temperature = options.temperature || parseFloat(process.env.TRANSLATION_TEMPERATURE) || 0.3;
    this.maxTokens = options.maxTokens || parseInt(process.env.TRANSLATION_MAX_TOKENS) || 4000;
  }

  /**
   * 翻譯文章成繁體中文
   * @param {string} content - 英文內容
   * @param {object} options - 翻譯選項
   * @returns {Promise<string>} - 翻譯後的繁體中文內容
   */
  async translate(content, options = {}) {
    const {
      preserveFormatting = true,
      includeTitle = false,
      customInstructions = ''
    } = options;

    const systemPrompt = this._buildSystemPrompt(preserveFormatting, customInstructions);
    const userMessage = this._buildUserMessage(content, includeTitle);

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens,
      });

      const translation = response.choices[0].message.content.trim();

      if (!translation) {
        throw new Error('API 回應為空');
      }

      return translation;
    } catch (error) {
      // 更詳細的錯誤信息
      if (error.status === 401) {
        throw new Error('OpenAI API Key 無效，請檢查 OPENAI_API_KEY 環境變數');
      } else if (error.status === 429) {
        throw new Error('API 配額已用盡或請求過於頻繁，請稍後再試');
      } else if (error.status === 500) {
        throw new Error('OpenAI 服務器錯誤，請稍後再試');
      } else {
        throw new Error(`翻譯失敗: ${error.message}`);
      }
    }
  }

  /**
   * 建立系統提示詞
   */
  _buildSystemPrompt(preserveFormatting, customInstructions) {
    let prompt = `你是一位專業的英文到繁體中文翻譯專家。你的任務是將英文內容準確、流暢地翻譯成繁體中文。

翻譯要求：
1. 使用正確的繁體中文（台灣用語）
2. 保持原文的語氣和風格
3. 確保翻譯自然流暢，符合中文閱讀習慣
4. 專有名詞保留英文或使用通用的中文翻譯
5. 技術術語使用業界標準的中文翻譯`;

    if (preserveFormatting) {
      prompt += `\n6. 保留原文的段落結構和格式（如標題、列表、引用等）`;
    }

    if (customInstructions) {
      prompt += `\n\n額外指示：\n${customInstructions}`;
    }

    prompt += `\n\n請直接輸出翻譯結果，不要添加任何解釋或註釋。`;

    return prompt;
  }

  /**
   * 建立用戶訊息
   */
  _buildUserMessage(content, includeTitle) {
    if (includeTitle) {
      return `請將以下英文文章翻譯成繁體中文：\n\n${content}`;
    }
    return content;
  }

  /**
   * 批量翻譯（將長文章分段翻譯）
   * @param {string} content - 長文本內容
   * @param {number} chunkSize - 每段的大小（字元數）
   * @returns {Promise<string>} - 完整翻譯結果
   */
  async translateLongText(content, chunkSize = 3000) {
    // 按段落分割
    const paragraphs = content.split('\n\n');
    const chunks = [];
    let currentChunk = '';

    for (const paragraph of paragraphs) {
      if (currentChunk.length + paragraph.length > chunkSize && currentChunk) {
        chunks.push(currentChunk);
        currentChunk = paragraph;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk);
    }

    // 翻譯每個分段
    const translations = [];
    for (let i = 0; i < chunks.length; i++) {
      console.log(`翻譯進度: ${i + 1}/${chunks.length}`);
      const translation = await this.translate(chunks[i], { preserveFormatting: true });
      translations.push(translation);

      // 避免 API 限流，稍作延遲
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return translations.join('\n\n');
  }
}

/**
 * 便捷函數：快速翻譯
 * @param {string} content - 要翻譯的內容
 * @param {string} apiKey - API 金鑰（可選，預設從環境變數讀取）
 * @returns {Promise<string>} - 翻譯結果
 */
export async function quickTranslate(content, apiKey = null) {
  const translator = new OpenAITranslator(apiKey);
  return await translator.translate(content);
}

// 向後兼容：導出為 default 和別名
export { OpenAITranslator as default, OpenAITranslator as GeminiTranslator, OpenAITranslator as ClaudeTranslator };
