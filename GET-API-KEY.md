# 🔑 如何獲取 Claude API 金鑰

## ❗ 重要說明

你目前使用的是 **Claude Code 的 OAuth Token**，這個 Token 只能用於 Claude Code 產品，不能用於直接的 API 調用。

要使用翻譯 API，你需要獲取一個 **Anthropic API Key**。

---

## 📝 獲取步驟

### 方式一：通過 Anthropic Console（推薦）

1. **訪問 Anthropic Console**
   - 前往：https://console.anthropic.com/

2. **登入帳號**
   - 使用你的 Claude 帳號登入
   - 或註冊新帳號（可以使用 Google/GitHub 登入）

3. **前往 API Keys 頁面**
   - 左側選單點擊 「Settings」
   - 選擇「API Keys」
   - 或直接訪問：https://console.anthropic.com/settings/keys

4. **創建新的 API Key**
   - 點擊「Create Key」按鈕
   - 輸入 Key 的名稱（例如：「Perplexity Translator」）
   - 點擊「Create Key」

5. **複製 API Key**
   - ⚠️ **重要**：API Key 只會顯示一次！
   - 立即複製並保存到安全的地方
   - Key 的格式：\`sk-ant-api03-...\`

6. **更新 .env 文件**
   - 打開專案中的 \`.env\` 文件
   - 替換 \`ANTHROPIC_API_KEY\` 的值：
   \`\`\`env
   ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
   \`\`\`

---

### 方式二：使用替代服務（免費額度）

如果你不想直接使用 Anthropic API，可以使用這些替代方案：

#### 選項 A：Google Gemini（完全免費）

1. 前往 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 獲取 Gemini API Key（完全免費）
3. 修改翻譯模組使用 Gemini API

#### 選項 B：OpenAI API

1. 前往 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 創建 API Key
3. 修改翻譯模組使用 GPT-4

---

## 💰 費用說明

### Anthropic Claude API

#### 免費額度
- 新用戶有 $5 美元免費額度
- 足夠翻譯約 1500-2000 篇文章

#### 付費價格（Sonnet 4）
- **輸入**：$3 / 百萬 tokens
- **輸出**：$15 / 百萬 tokens
- **估算**：
  - 1 篇文章（3000 字）≈ $0.009（約 NT$0.3）
  - 100 篇文章 ≈ $0.90（約 NT$27）
  - 1000 篇/月 ≈ $9（約 NT$270）

---

## 🔍 驗證 API Key

獲取 API Key 後，可以運行測試驗證：

\`\`\`bash
# 測試 API 連接
npm test 1
\`\`\`

如果看到以下輸出，表示成功：

\`\`\`
✅ 翻譯成功！

原文長度: XXX 字元
譯文長度: XXX 字元
\`\`\`

---

## ❓ 常見問題

### Q: 我沒有信用卡，可以使用嗎？

**可以！**
- Anthropic 新用戶有 $5 免費額度
- 不需要綁定信用卡即可使用
- 免費額度用完後才需要付款

### Q: 免費額度用完後會怎樣？

- API 會返回錯誤：\`insufficient_quota\`
- 不會自動扣款
- 需要手動添加付款方式才能繼續使用

### Q: 如何查看使用量？

1. 登入 [Anthropic Console](https://console.anthropic.com/)
2. 查看「Usage」頁面
3. 可以看到：
   - 當前使用量
   - 剩餘額度
   - 每日使用統計

### Q: API Key 洩漏怎麼辦？

1. 立即前往 [API Keys](https://console.anthropic.com/settings/keys) 頁面
2. 刪除洩漏的 Key
3. 創建新的 Key
4. 更新 \`.env\` 文件

---

## 🛡️ 安全建議

1. **永遠不要提交 .env 文件到 Git**
   - \`.gitignore\` 已經包含了 \`.env\`
   - 雙重檢查確保不會意外提交

2. **不要在程式碼中硬編碼 API Key**
   - 永遠使用環境變數
   - 部署時在 Vercel 設定環境變數

3. **定期輪換 API Key**
   - 每 3-6 個月更換一次
   - 如果懷疑洩漏，立即更換

4. **限制 API Key 權限**
   - 在 Anthropic Console 中可以設定 Key 的權限
   - 建議只給予必要的權限

---

## 🔄 使用其他翻譯 API

如果你想使用其他服務，可以修改 \`lib/translator.js\`：

### 使用 Google Gemini（免費）

\`\`\`javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function translate(content) {
  const prompt = \`請將以下英文翻譯成繁體中文：\n\n\${content}\`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}
\`\`\`

### 使用 DeepL（有免費額度）

\`\`\`javascript
import * as deepl from 'deepl-node';

const translator = new deepl.Translator(process.env.DEEPL_AUTH_KEY);

async function translate(content) {
  const result = await translator.translateText(
    content,
    'en',
    'zh-TW'
  );
  return result.text;
}
\`\`\`

---

## 📞 需要幫助？

如果遇到問題：

1. 查看 [Anthropic 文檔](https://docs.anthropic.com/)
2. 查看專案的 [常見問題](./README.md#常見問題)
3. 提交 Issue

---

**獲取 API Key 後，就可以開始享受你的翻譯助手了！** 🎉
