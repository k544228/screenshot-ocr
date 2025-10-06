# 🚀 OpenAI API 設定指南

## ✅ 已完成切換

專案已成功切換到 **OpenAI GPT-4o-mini**！

---

## 📝 獲取 OpenAI API Key（2 分鐘）

### 步驟 1：訪問 OpenAI Platform

前往：https://platform.openai.com/api-keys

### 步驟 2：登入或註冊

- 使用 Google/Microsoft 帳號快速登入
- 或用 Email 註冊新帳號

### 步驟 3：創建 API Key

1. 點擊「**Create new secret key**」
2. 輸入 Key 名稱（例如：「Translator」）
3. 權限保持預設即可
4. 點擊「Create secret key」
5. **立即複製 API Key**（格式：`sk-proj-...`）

⚠️ **重要**：API Key 只會顯示一次，請立即複製！

### 步驟 4：充值帳戶

OpenAI 需要最低 $5 充值：

1. 前往：https://platform.openai.com/settings/organization/billing/overview
2. 點擊「Add payment method」
3. 輸入信用卡資訊
4. 充值 $5（建議充 $10，可用很久）

**費用說明：**
- GPT-4o-mini：$0.15 / 百萬 tokens
- 100 篇文章約 $0.03
- $5 可翻譯約 15,000 篇文章

---

## ⚙️ 設定 API Key

### 更新 .env 文件

打開 `C:\Users\KEN\Desktop\其他文件\github website fuond\news-set\.env`

貼上你的 API Key：

\`\`\`env
OPENAI_API_KEY=sk-proj-你的實際金鑰
\`\`\`

---

## ✅ 測試翻譯

\`\`\`bash
cd "C:/Users/KEN/Desktop/其他文件/github website fuond/news-set"
npm test 1
\`\`\`

**成功的話會看到：**

\`\`\`
✅ 翻譯成功！

原文長度: 500 字元
譯文長度: 450 字元

==================================================
翻譯結果:
==================================================
# 分析師警告 AI 泡沫超越網路時代

AI 投資的快速擴張引發了金融分析師的擔憂...
\`\`\`

---

## 🚀 部署到 Vercel

### 步驟 1：提交 Git 更新

\`\`\`bash
cd "C:/Users/KEN/Desktop/其他文件/github website fuond/news-set"

git add .
git commit -m "Switch to OpenAI GPT-4o-mini"
\`\`\`

### 步驟 2：創建 GitHub 倉庫

訪問：https://github.com/new

設定：
- Repository name: `perplexity-translator`
- Public
- 不勾選任何初始化選項

### 步驟 3：推送到 GitHub

\`\`\`bash
# 替換 YOUR_USERNAME
git remote add origin https://github.com/YOUR_USERNAME/perplexity-translator.git
git branch -M main
git push -u origin main
\`\`\`

### 步驟 4：部署到 Vercel

\`\`\`bash
vercel --prod
\`\`\`

設定環境變數：
- `OPENAI_API_KEY`: 你的 OpenAI API Key

記下部署網址（例如：`https://perplexity-translator.vercel.app`）

---

## 📱 設定 iOS 捷徑

### 創建捷徑

1. 打開「捷徑」App
2. 創建新捷徑，添加動作：
   - **接收** → 類型：URL
   - **字典** → 鍵：`url`，值：`捷徑輸入`
   - **取得 URL 內容** →
     - URL: `https://你的vercel網址.vercel.app/api/translate`
     - 方法：POST
     - JSON：字典
   - **取得字典值** → 鍵：`data.translation`
   - **拷貝到剪貼板**
   - **顯示通知** → `✅ 翻譯完成！`

3. 設定：
   - 名稱：`Perplexity 翻譯器`
   - 開啟「在分享工作表中顯示」

📖 **詳細步驟**：[iOS-Shortcut-Setup.md](./iOS-Shortcut-Setup.md)

---

## 🎯 開始使用

1. 在 Safari 打開英文文章
2. 點擊分享 → Perplexity 翻譯器
3. 等待 3-5 秒
4. 翻譯自動複製到剪貼簿！

---

## 💰 費用追蹤

### 查看使用量

1. 前往 [OpenAI Usage](https://platform.openai.com/usage)
2. 查看每日使用統計
3. 監控剩餘額度

### 費用估算

| 使用量 | 約略費用 |
|--------|---------|
| 10 篇文章 | $0.003 |
| 100 篇文章 | $0.03 |
| 1000 篇/月 | $0.30 |

**極低成本！** 個人使用每月不到 $1。

---

## 🆚 與其他 API 比較

| API | 費用 | 翻譯品質 | 設定難度 | 穩定性 |
|-----|------|---------|---------|--------|
| **OpenAI** | **$0.15/M** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Gemini | 免費 | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| Claude | $3/M | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**結論**：OpenAI 是性價比最高的選擇！

---

## ❓ 常見問題

### Q: API Key 無效怎麼辦？

1. 確認複製完整（包含 `sk-proj-` 前綴）
2. 檢查帳戶是否已充值
3. 重新生成 API Key

### Q: 測試失敗顯示「insufficient_quota」？

需要充值帳戶：
1. https://platform.openai.com/settings/organization/billing/overview
2. 充值至少 $5

### Q: 翻譯品質如何？

**非常好！**
- 自然流暢的繁體中文
- 理解上下文
- 專業術語準確
- 接近人工翻譯品質

### Q: 可以用免費的 API 嗎？

OpenAI 不提供免費額度，但：
- 費用極低（$5 可用很久）
- 品質穩定
- 無需複雜配置
- 值得投資

---

## ✅ 完成檢查清單

- [ ] 已獲取 OpenAI API Key
- [ ] 已充值帳戶（至少 $5）
- [ ] 已更新 `.env` 文件
- [ ] 本地測試成功
- [ ] 推送到 GitHub
- [ ] 部署到 Vercel
- [ ] 設定 iOS 捷徑
- [ ] 測試完整流程

---

## 🎉 完成！

你現在擁有：
- ✅ 穩定可靠的翻譯 API
- ✅ 專業級翻譯品質
- ✅ 極低的使用成本
- ✅ iOS 一鍵翻譯功能

**開始享受你的翻譯助手吧！** 🚀

---

**有問題？** 隨時告訴我，我會立即幫助你！💬
