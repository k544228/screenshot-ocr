/**
 * Google Translate API 翻譯模組
 * 使用免費的 Google Translate API
 */

/**
 * Google Translate 翻譯器
 */
export class GoogleTranslator {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.GOOGLE_TRANSLATE_API_KEY;
    this.apiEndpoint = 'https://translation.googleapis.com/language/translate/v2';
  }

  /**
   * 翻譯文字
   * @param {string} text - 要翻譯的文字
   * @param {object} options - 翻譯選項
   * @returns {Promise<string>} - 翻譯後的文字
   */
  async translate(text, options = {}) {
    const {
      targetLanguage = 'zh-TW',
      sourceLanguage = 'auto'
    } = options;

    try {
      const url = new URL(this.apiEndpoint);
      url.searchParams.append('key', this.apiKey);
      url.searchParams.append('q', text);
      url.searchParams.append('target', targetLanguage);

      if (sourceLanguage !== 'auto') {
        url.searchParams.append('source', sourceLanguage);
      }

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `翻譯失敗 (${response.status})`);
      }

      const data = await response.json();

      if (!data.data?.translations?.[0]?.translatedText) {
        throw new Error('翻譯結果為空');
      }

      return data.data.translations[0].translatedText;
    } catch (error) {
      if (error.message.includes('API key not valid')) {
        throw new Error('Google Translate API Key 無效');
      } else if (error.message.includes('quota')) {
        throw new Error('Google Translate API 配額已用盡');
      } else {
        throw new Error(`Google 翻譯失敗: ${error.message}`);
      }
    }
  }

  /**
   * 批量翻譯（將長文本分段）
   */
  async translateLongText(text, chunkSize = 5000) {
    // Google Translate API 單次限制約 5000 字元
    const chunks = [];
    const paragraphs = text.split('\n\n');
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

    const translations = [];
    for (let i = 0; i < chunks.length; i++) {
      console.log(`翻譯進度: ${i + 1}/${chunks.length}`);
      const translation = await this.translate(chunks[i]);
      translations.push(translation);

      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    return translations.join('\n\n');
  }
}

/**
 * 不使用 API 的簡易翻譯（使用免費的 Google Translate 網頁版）
 * 注意：這個方法不穩定，Google 可能隨時封鎖
 */
export class GoogleTranslatorFree {
  async translate(text, options = {}) {
    const {
      targetLanguage = 'zh-TW',
      sourceLanguage = 'auto'
    } = options;

    try {
      // 使用 Google Translate 的免費端點
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`翻譯失敗 (${response.status})`);
      }

      const data = await response.json();

      // 解析返回的數組結構
      if (!data || !Array.isArray(data) || !data[0]) {
        throw new Error('翻譯結果格式錯誤');
      }

      const translations = data[0].map(item => item[0]).filter(Boolean);
      return translations.join('');
    } catch (error) {
      throw new Error(`Google 免費翻譯失敗: ${error.message}`);
    }
  }

  async translateLongText(text, chunkSize = 5000) {
    const chunks = [];
    const paragraphs = text.split('\n\n');
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

    const translations = [];
    for (let i = 0; i < chunks.length; i++) {
      console.log(`翻譯進度: ${i + 1}/${chunks.length}`);
      const translation = await this.translate(chunks[i]);
      translations.push(translation);

      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return translations.join('\n\n');
  }
}

export default GoogleTranslatorFree;
