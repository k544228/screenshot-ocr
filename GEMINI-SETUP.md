# 🆓 Google Gemini API 設定指南

## 🎉 恭喜！你現在使用完全免費的 Google Gemini AI

Gemini 是 Google 的 AI 模型，翻譯品質優秀，而且**完全免費**！

---

## 📝 獲取 Gemini API Key（2 分鐘）

### 步驟 1：訪問 Google AI Studio

前往：https://makersuite.google.com/app/apikey

或：https://aistudio.google.com/apikey

### 步驟 2：登入 Google 帳號

使用你的 Google 帳號登入（Gmail 帳號即可）

### 步驟 3：創建 API Key

1. 點擊「**Get API Key**」或「**Create API Key**」
2. 選擇或創建一個 Google Cloud 專案
   - 如果沒有專案，選擇「Create API key in new project」
   - 專案名稱可以隨意（例如：「Translator」）
3. 點擊「Create」
4. **立即複製 API Key**（格式：`AIza...`）

⚠️ **重要**：API Key 只會顯示一次，請立即複製並保存！

### 步驟 4：更新 .env 文件

打開專案中的 `.env` 文件，貼上你的 API Key：

\`\`\`env
GOOGLE_API_KEY=AIzaSyC_你的實際金鑰
\`\`\`

---

## ✅ 測試翻譯功能

### 本地測試

\`\`\`bash
cd "C:/Users/KEN/Desktop/其他文件/github website fuond/news-set"
npm test 1
\`\`\`

**預期結果：**

\`\`\`
✅ 翻譯成功！

原文長度: 500 字元
譯文長度: 450 字元

==================================================
翻譯結果:
==================================================
# 分析師警告 AI 泡沫超越網路時代

AI 投資的快速擴張引起了金融分析師的擔憂...
\`\`\`

---

## 🚀 部署到 Vercel

### 步驟 1：推送到 GitHub

\`\`\`bash
cd "C:/Users/KEN/Desktop/其他文件/github website fuond/news-set"

# 添加所有更新的文件
git add .
git commit -m "Switch to Google Gemini API (Free)"

# 推送到 GitHub（替換 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/perplexity-translator.git
git branch -M main
git push -u origin main
\`\`\`

### 步驟 2：部署到 Vercel

\`\`\`bash
vercel --prod
\`\`\`

### 步驟 3：設定環境變數

部署時，Vercel 會要求設定環境變數：

| 變數名稱 | 值 | 說明 |
|---------|---|------|
| `GOOGLE_API_KEY` | `AIzaSyC_你的金鑰` | 從 Google AI Studio 獲取 |
| `GEMINI_MODEL` | `gemini-1.5-flash` | 使用快速模型（免費） |
| `TRANSLATION_MAX_TOKENS` | `4000` | 最大輸出長度 |
| `TRANSLATION_TEMPERATURE` | `0.3` | 翻譯一致性（0-1） |

### 步驟 4：測試部署

\`\`\`bash
# 測試 API（替換為你的 Vercel 網址）
curl -X POST https://你的網址.vercel.app/api/translate \\
  -H "Content-Type: application/json" \\
  -d '{"content": "Hello, World!"}'
\`\`\`

---

## 📱 設定 iOS 捷徑

### API URL

在 iOS 捷徑中，使用你的 Vercel 部署網址：

\`\`\`
https://你的專案名稱.vercel.app/api/translate
\`\`\`

### 完整設定

參考：[iOS-Shortcut-Setup.md](./iOS-Shortcut-Setup.md)

---

## 💰 Gemini API 限制

### 免費額度

- ✅ **完全免費**
- ✅ 每分鐘 60 次請求
- ✅ 每天 1500 次請求
- ✅ 無需信用卡

### 付費方案

如果免費額度不夠用（通常足夠個人使用），可以升級：

- **Gemini Pro**: $0.001 / 1000 字元（比 Claude 便宜 3 倍）

---

## 🆚 Gemini vs Claude 比較

| 項目 | Gemini 1.5 Flash | Claude Sonnet 4 |
|-----|------------------|-----------------|
| 費用 | **免費** | $0.003 / 1000 字元 |
| 翻譯品質 | 優秀 ⭐⭐⭐⭐ | 卓越 ⭐⭐⭐⭐⭐ |
| 速度 | 極快 | 快 |
| 免費額度 | 每天 1500 次 | $5（約 1500 篇） |
| 適合對象 | 個人使用 | 專業需求 |

**結論**：對於個人使用，Gemini 完全足夠且免費！

---

## ❓ 常見問題

### Q: Gemini 翻譯品質如何？

**非常好！**
- ✅ 理解上下文
- ✅ 自然流暢的中文
- ✅ 保留原文格式
- ✅ 專業術語準確

與 Claude 的差異主要在極細微的語感，一般使用完全察覺不出。

### Q: 免費額度會用完嗎？

**對個人使用來說，幾乎不可能**

- 每天 1500 次請求
- 即使你每天翻譯 50 篇文章也綽綽有餘
- 超過限制後會在第二天重置

### Q: 如何查看使用量？

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 選擇你的專案
3. 查看「APIs & Services」→「Dashboard」
4. 可以看到每日使用統計

### Q: API Key 洩漏怎麼辦？

1. 前往 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 刪除舊的 Key
3. 創建新的 Key
4. 更新 `.env` 和 Vercel 環境變數

### Q: 可以同時支援 Gemini 和 Claude 嗎？

可以！我可以幫你修改程式碼，讓用戶可以選擇使用哪個 API。

---

## 🎯 下一步

### ✅ 檢查清單

- [ ] 已獲取 Gemini API Key
- [ ] 已更新 `.env` 文件
- [ ] 本地測試成功（`npm test 1`）
- [ ] 推送到 GitHub
- [ ] 部署到 Vercel
- [ ] 設定 iOS 捷徑
- [ ] 測試完整流程

### 🚀 開始使用

1. 在 Safari 打開任何英文文章
2. 點擊分享 → Perplexity 翻譯器
3. 等待翻譯
4. 享受免費的專業翻譯！

---

## 🎉 完成！

你現在擁有：

- ✅ 完全免費的翻譯 API
- ✅ 專業級的翻譯品質
- ✅ iOS 一鍵翻譯功能
- ✅ 無使用限制（個人使用）

**開始享受你的免費翻譯助手吧！** 🚀

---

## 📚 相關文檔

- [QUICK-START.md](./QUICK-START.md) - 完整快速開始指南
- [iOS-Shortcut-Setup.md](./iOS-Shortcut-Setup.md) - iOS 捷徑設定
- [DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md) - 詳細部署指南
- [README.md](./README.md) - 專案文檔

---

**有問題？** 隨時告訴我，我會立即幫助你！💬
