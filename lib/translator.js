/**
 * Claude API 翻譯模組
 * 使用 Anthropic Claude API 將英文文章翻譯成繁體中文
 */

import Anthropic from '@anthropic-ai/sdk';

/**
 * 創建翻譯器實例
 */
export class ClaudeTranslator {
  constructor(apiKey, options = {}) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    });

    this.model = options.model || process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';
    this.maxTokens = options.maxTokens || parseInt(process.env.TRANSLATION_MAX_TOKENS) || 4000;
    this.temperature = options.temperature || parseFloat(process.env.TRANSLATION_TEMPERATURE) || 0.3;
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
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      });

      return this._extractTranslation(response);
    } catch (error) {
      throw new Error(`翻譯失敗: ${error.message}`);
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
   * 從 API 回應中提取翻譯結果
   */
  _extractTranslation(response) {
    if (response.content && response.content.length > 0) {
      return response.content[0].text.trim();
    }
    throw new Error('API 回應格式錯誤');
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
  const translator = new ClaudeTranslator(apiKey);
  return await translator.translate(content);
}

export default ClaudeTranslator;
