/**
 * 支持的翻譯語言列表
 * 按使用率從高到低排序
 */

export const LANGUAGES = [
  // 使用率最高的語言
  { code: 'auto', name: '自動檢測', nameEn: 'Auto Detect', popular: true },
  { code: 'zh-TW', name: '繁體中文', nameEn: 'Traditional Chinese', popular: true },
  { code: 'en', name: '英文', nameEn: 'English', popular: true },
  { code: 'zh-CN', name: '簡體中文', nameEn: 'Simplified Chinese', popular: true },
  { code: 'ja', name: '日文', nameEn: 'Japanese', popular: true },
  { code: 'ko', name: '韓文', nameEn: 'Korean', popular: true },
  { code: 'es', name: '西班牙文', nameEn: 'Spanish', popular: true },
  { code: 'fr', name: '法文', nameEn: 'French', popular: true },
  { code: 'de', name: '德文', nameEn: 'German', popular: true },
  { code: 'pt', name: '葡萄牙文', nameEn: 'Portuguese', popular: true },

  // 其他常用語言（按字母排序）
  { code: 'ar', name: '阿拉伯文', nameEn: 'Arabic' },
  { code: 'bg', name: '保加利亞文', nameEn: 'Bulgarian' },
  { code: 'ca', name: '加泰羅尼亞文', nameEn: 'Catalan' },
  { code: 'cs', name: '捷克文', nameEn: 'Czech' },
  { code: 'da', name: '丹麥文', nameEn: 'Danish' },
  { code: 'nl', name: '荷蘭文', nameEn: 'Dutch' },
  { code: 'et', name: '愛沙尼亞文', nameEn: 'Estonian' },
  { code: 'fi', name: '芬蘭文', nameEn: 'Finnish' },
  { code: 'el', name: '希臘文', nameEn: 'Greek' },
  { code: 'he', name: '希伯來文', nameEn: 'Hebrew' },
  { code: 'hi', name: '印地文', nameEn: 'Hindi' },
  { code: 'hu', name: '匈牙利文', nameEn: 'Hungarian' },
  { code: 'id', name: '印尼文', nameEn: 'Indonesian' },
  { code: 'it', name: '義大利文', nameEn: 'Italian' },
  { code: 'lv', name: '拉脫維亞文', nameEn: 'Latvian' },
  { code: 'lt', name: '立陶宛文', nameEn: 'Lithuanian' },
  { code: 'ms', name: '馬來文', nameEn: 'Malay' },
  { code: 'no', name: '挪威文', nameEn: 'Norwegian' },
  { code: 'pl', name: '波蘭文', nameEn: 'Polish' },
  { code: 'ro', name: '羅馬尼亞文', nameEn: 'Romanian' },
  { code: 'ru', name: '俄文', nameEn: 'Russian' },
  { code: 'sk', name: '斯洛伐克文', nameEn: 'Slovak' },
  { code: 'sl', name: '斯洛維尼亞文', nameEn: 'Slovenian' },
  { code: 'sv', name: '瑞典文', nameEn: 'Swedish' },
  { code: 'th', name: '泰文', nameEn: 'Thai' },
  { code: 'tr', name: '土耳其文', nameEn: 'Turkish' },
  { code: 'uk', name: '烏克蘭文', nameEn: 'Ukrainian' },
  { code: 'vi', name: '越南文', nameEn: 'Vietnamese' },
];

/**
 * 獲取熱門語言（前10個）
 */
export function getPopularLanguages() {
  return LANGUAGES.filter(lang => lang.popular);
}

/**
 * 搜尋語言（支持中文和英文）
 */
export function searchLanguages(query) {
  if (!query || query.trim() === '') {
    return LANGUAGES;
  }

  const lowerQuery = query.toLowerCase().trim();

  return LANGUAGES.filter(lang => {
    const nameLower = lang.name.toLowerCase();
    const nameEnLower = lang.nameEn.toLowerCase();
    const codeLower = lang.code.toLowerCase();

    return nameLower.includes(lowerQuery) ||
           nameEnLower.includes(lowerQuery) ||
           codeLower.includes(lowerQuery);
  });
}

/**
 * 根據語言代碼獲取語言名稱
 */
export function getLanguageName(code) {
  const lang = LANGUAGES.find(l => l.code === code);
  return lang ? lang.name : code;
}

export default LANGUAGES;
