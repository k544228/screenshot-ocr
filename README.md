# 🌐 Perplexity 翻譯器

一鍵將 Perplexity（或任何網站）的英文文章翻譯成繁體中文的 iOS 捷徑 + API 服務。

使用 **Claude Sonnet 4** AI 模型，提供專業級翻譯品質，遠超 Google 翻譯。

---

## ✨ 功能特色

- 🎯 **一鍵翻譯**：在 iOS 分享選單中直接翻譯網頁
- 🤖 **AI 驅動**：使用 Claude Sonnet 4，翻譯自然流暢
- 📱 **iOS 整合**：完美整合到 iPhone/iPad 分享工作表
- 🚀 **快速部署**：一鍵部署到 Vercel，完全免費
- 🌍 **支援所有網站**：不只 Perplexity，任何文章都能翻譯
- 💾 **自動複製**：翻譯結果自動複製到剪貼簿

---

## 📖 目錄

- [快速開始](#快速開始)
- [本地開發](#本地開發)
- [部署到 Vercel](#部署到-vercel)
- [iOS 捷徑設定](#ios-捷徑設定)
- [API 文檔](#api-文檔)
- [常見問題](#常見問題)

---

## 🚀 快速開始

### 1. 克隆專案

\`\`\`bash
git clone https://github.com/your-username/news-set.git
cd news-set
\`\`\`

### 2. 安裝依賴

\`\`\`bash
npm install
\`\`\`

### 3. 設定環境變數

複製 \`.env.example\` 並設定你的 Claude API 金鑰：

\`\`\`bash
cp .env.example .env
\`\`\`

編輯 \`.env\` 文件：

\`\`\`env
ANTHROPIC_API_KEY=your-api-key-here
\`\`\`

> 💡 **如何獲取 API 金鑰**：
> 1. 前往 [Anthropic Console](https://console.anthropic.com/settings/keys)
> 2. 登入或註冊帳號
> 3. 創建新的 API 金鑰
> 4. 複製並貼到 \`.env\` 文件

### 4. 本地測試

\`\`\`bash
# 啟動本地服務器
npm run dev

# 在另一個終端測試翻譯功能
npm test
\`\`\`

訪問 [http://localhost:3000](http://localhost:3000) 查看服務狀態。

---

## 💻 本地開發

### 專案結構

\`\`\`
news-set/
├── api/
│   └── translate.js          # Vercel API 端點
├── lib/
│   ├── translator.js         # Claude 翻譯模組
│   └── content-extractor.js  # 內容提取模組（Jina Reader）
├── test/
│   ├── local-server.js       # 本地開發服務器
│   └── test-translate.js     # 測試腳本
├── .env                      # 環境變數（不提交到 git）
├── .env.example              # 環境變數範例
├── package.json              # 專案配置
├── vercel.json               # Vercel 部署配置
└── README.md                 # 本文件
\`\`\`

### 可用指令

\`\`\`bash
# 啟動本地開發服務器
npm run dev

# 運行測試套件
npm test

# 部署到 Vercel
npm run deploy
\`\`\`

### 測試腳本說明

\`\`\`bash
# 運行所有測試
npm test

# 只測試直接翻譯
npm test 1

# 只測試 URL 內容提取
npm test 2

# 只測試完整工作流程
npm test 3
\`\`\`

---

## 🌐 部署到 Vercel

### 方式一：使用 Vercel CLI（推薦）

\`\`\`bash
# 安裝 Vercel CLI
npm install -g vercel

# 登入 Vercel
vercel login

# 部署
vercel --prod
\`\`\`

### 方式二：通過 GitHub

1. 將專案推送到 GitHub
2. 前往 [Vercel Dashboard](https://vercel.com/new)
3. 選擇你的 GitHub 倉庫
4. 點擊「Import」
5. 設定環境變數：
   - \`ANTHROPIC_API_KEY\`: 你的 Claude API 金鑰
6. 點擊「Deploy」

### 設定環境變數

在 Vercel Dashboard 中設定以下環境變數：

| 變數名稱 | 說明 | 範例值 |
|---------|------|--------|
| \`ANTHROPIC_API_KEY\` | Claude API 金鑰 | \`sk-ant-...\` |
| \`CLAUDE_MODEL\` | Claude 模型名稱 | \`claude-sonnet-4-20250514\` |
| \`TRANSLATION_MAX_TOKENS\` | 最大 token 數 | \`4000\` |
| \`TRANSLATION_TEMPERATURE\` | 翻譯溫度 | \`0.3\` |

---

## 📱 iOS 捷徑設定

詳細步驟請參考 [iOS 捷徑設定教學](./iOS-Shortcut-Setup.md)

### 快速步驟：

1. **部署 API**（見上方）
2. **創建 iOS 捷徑**：
   - 打開「捷徑」App
   - 創建新捷徑
   - 添加以下動作順序：
     1. 接收 URL 輸入
     2. 建立 JSON 字典（鍵：\`url\`，值：輸入的 URL）
     3. 取得 URL 內容（POST 到你的 API 端點）
     4. 從 JSON 取得 \`data.translation\`
     5. 複製到剪貼簿
     6. 顯示通知
3. **啟用分享選單**：
   - 在捷徑設定中開啟「在分享工作表中顯示」
   - 選擇分享類型：URL

### 使用方式：

1. 在 Safari、Chrome 或 Perplexity 中打開文章
2. 點擊分享按鈕
3. 選擇「Perplexity 翻譯器」捷徑
4. 等待翻譯完成（約 5-10 秒）
5. 翻譯結果已複製到剪貼簿！

---

## 📡 API 文檔

### 端點

\`\`\`
POST /api/translate
\`\`\`

### 請求格式

#### 方式 1：翻譯 URL

\`\`\`json
{
  "url": "https://www.perplexity.ai/discover/you/article-id",
  "options": {
    "preserveFormatting": true
  }
}
\`\`\`

#### 方式 2：直接翻譯文本

\`\`\`json
{
  "content": "Your English text to translate...",
  "options": {
    "preserveFormatting": true,
    "customInstructions": "Focus on technical accuracy"
  }
}
\`\`\`

### 回應格式

#### 成功回應

\`\`\`json
{
  "success": true,
  "data": {
    "originalUrl": "https://...",
    "extractedTitle": "Article Title",
    "translation": "翻譯後的繁體中文內容...",
    "stats": {
      "originalLength": 1500,
      "translationLength": 1200,
      "translatedAt": "2025-10-05T10:30:00.000Z"
    }
  }
}
\`\`\`

#### 錯誤回應

\`\`\`json
{
  "success": false,
  "error": "錯誤訊息"
}
\`\`\`

### cURL 範例

\`\`\`bash
curl -X POST https://your-project.vercel.app/api/translate \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://www.perplexity.ai/discover/you/article-id"
  }'
\`\`\`

---

## ❓ 常見問題

### Q: 為什麼翻譯失敗？

**可能原因：**
- API 金鑰無效或過期
- 網路連線問題
- 文章內容受保護（需要登入）
- API 額度用盡

**解決方法：**
1. 檢查 \`.env\` 中的 API 金鑰是否正確
2. 確認網路連線正常
3. 嘗試翻譯其他公開文章
4. 查看 Vercel 部署日誌：\`vercel logs\`

### Q: 翻譯需要多久？

- **短文章（< 1000 字）**：3-5 秒
- **中等文章（1000-3000 字）**：5-10 秒
- **長文章（> 3000 字）**：15-30 秒（自動分段翻譯）

### Q: 支援哪些網站？

幾乎所有公開的文章網站：
- ✅ Perplexity
- ✅ Medium
- ✅ BBC News
- ✅ CNN
- ✅ The Guardian
- ✅ 技術部落格（Dev.to, Hashnode 等）
- ✅ 學術論文網站

不支援：
- ❌ 需要登入才能閱讀的內容
- ❌ 付費訂閱內容
- ❌ 影片或音頻內容

### Q: 翻譯品質如何？

使用 **Claude Sonnet 4** 模型，優勢：
- ✅ 理解上下文，翻譯更自然
- ✅ 保留原文語氣和風格
- ✅ 專業術語翻譯準確
- ✅ 符合繁體中文閱讀習慣

比 Google 翻譯好在：
- 更流暢的中文表達
- 更好的技術術語處理
- 保持原文結構和格式

### Q: 費用多少？

#### Claude API 費用
- **Sonnet 4 模型**：約 $0.003 / 1000 字元
- **估算**：
  - 1 篇文章（3000 字）≈ $0.009（約 NT$0.3）
  - 100 篇文章 ≈ $0.90（約 NT$27）
  - 1000 篇/月 ≈ $9（約 NT$270）

#### Vercel 費用
- **Hobby 方案**：完全免費
  - 每月 100GB 頻寬
  - 無限次數請求（合理使用）
  - 對個人使用足夠

### Q: 如何修改翻譯風格？

編輯 \`lib/translator.js\` 中的 \`_buildSystemPrompt\` 方法，添加自定義指示：

\`\`\`javascript
const systemPrompt = \`你是一位專業的英文到繁體中文翻譯專家。

翻譯風格：
- 使用口語化表達（或：使用正式書面語）
- 保留技術術語的英文原文
- 加入適當的標點符號和段落

...\`;
\`\`\`

---

## 🛠️ 技術棧

- **翻譯引擎**：Anthropic Claude Sonnet 4
- **內容提取**：Jina Reader API
- **部署平台**：Vercel Serverless Functions
- **運行環境**：Node.js 18+
- **依賴套件**：
  - \`@anthropic-ai/sdk\` - Claude API SDK
  - \`dotenv\` - 環境變數管理
  - \`node-fetch\` - HTTP 請求（開發用）

---

## 📄 授權

MIT License

---

## 🤝 貢獻

歡迎提交 Issue 或 Pull Request！

---

## 📮 聯絡

如有問題或建議，請開 Issue 或聯絡開發者。

---

## 🎉 致謝

- [Anthropic](https://www.anthropic.com/) - 提供 Claude AI 模型
- [Jina AI](https://jina.ai/) - 提供內容提取服務
- [Vercel](https://vercel.com/) - 提供免費部署平台

---

**享受你的翻譯助手吧！** 🚀
