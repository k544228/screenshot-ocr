/**
 * 內容提取模組
 * 使用 Jina Reader 從網頁 URL 提取乾淨的文章內容
 */

const JINA_READER_BASE = 'https://r.jina.ai';

/**
 * 從 URL 提取文章內容
 * @param {string} url - 文章網址
 * @returns {Promise<Object>} - 提取的內容（包含標題和正文）
 */
export async function extractContent(url) {
  try {
    // 使用 Jina Reader 提取內容
    const jinaUrl = `${JINA_READER_BASE}/${url}`;

    const response = await fetch(jinaUrl, {
      headers: {
        'Accept': 'text/plain',
        'X-Return-Format': 'markdown'
      }
    });

    if (!response.ok) {
      throw new Error(`提取失敗: HTTP ${response.status}`);
    }

    const markdown = await response.text();

    // 解析標題和內容
    const { title, content } = parseMarkdown(markdown);

    return {
      success: true,
      url,
      title,
      content,
      markdown,
      extractedAt: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      url,
      error: error.message
    };
  }
}

/**
 * 解析 Markdown 內容，提取標題和正文
 * @param {string} markdown - Markdown 格式的文章
 * @returns {Object} - 包含標題和內容
 */
function parseMarkdown(markdown) {
  const lines = markdown.trim().split('\n');
  let title = '';
  let contentLines = [];
  let foundTitle = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 找到第一個 # 標題作為文章標題
    if (!foundTitle && line.startsWith('# ')) {
      title = line.replace(/^#\s+/, '').trim();
      foundTitle = true;
      continue;
    }

    // 跳過空行（在找到標題之前）
    if (!foundTitle && !line) {
      continue;
    }

    // 收集內容
    if (foundTitle) {
      contentLines.push(lines[i]);
    }
  }

  // 如果沒找到標題，使用第一行作為標題
  if (!title && contentLines.length > 0) {
    title = contentLines[0].trim();
    contentLines = contentLines.slice(1);
  }

  const content = contentLines.join('\n').trim();

  return { title, content };
}

/**
 * 驗證 URL 是否有效
 * @param {string} url - 要驗證的 URL
 * @returns {boolean} - 是否為有效的 URL
 */
export function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * 清理和標準化 URL
 * @param {string} url - 原始 URL
 * @returns {string} - 清理後的 URL
 */
export function normalizeUrl(url) {
  // 移除前後空白
  url = url.trim();

  // 如果沒有協議，自動添加 https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  return url;
}

export default {
  extractContent,
  isValidUrl,
  normalizeUrl
};
