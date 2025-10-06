# 🎉 開始使用你的免費翻譯器！

## ✅ 已完成的工作

我已經幫你：
- ✅ 切換到完全免費的 Google Gemini API
- ✅ 更新所有程式碼和配置
- ✅ 創建完整的設定文檔
- ✅ 提交到 Git 倉庫

---

## 🚀 接下來只需 3 步驟！

### 步驟 1：獲取 Gemini API Key（2 分鐘）⭐

**前往：** https://makersuite.google.com/app/apikey

1. 用 Google 帳號登入
2. 點擊「Get API Key」
3. 選擇「Create API key in new project」
4. **複製 API Key**（格式：`AIza...`）

**更新 .env 文件：**

打開 `C:\Users\KEN\Desktop\其他文件\github website fuond\news-set\.env`

貼上你的 API Key：

\`\`\`env
GOOGLE_API_KEY=AIzaSyC_你的實際金鑰這裡
\`\`\`

📖 **詳細步驟**：查看 [GEMINI-SETUP.md](./GEMINI-SETUP.md)

---

### 步驟 2：測試翻譯功能（1 分鐘）

\`\`\`bash
cd "C:/Users/KEN/Desktop/其他文件/github website fuond/news-set"
npm test 1
\`\`\`

**成功的話會看到：**

\`\`\`
✅ 翻譯成功！

翻譯結果:
==================================================
# 分析師警告 AI 泡沫超越網路時代

AI 投資的快速擴張引起了金融分析師的擔憂...
\`\`\`

---

### 步驟 3：部署到 GitHub 和 Vercel（5 分鐘）

#### 3.1 創建 GitHub 倉庫

訪問：https://github.com/new

設定：
- Repository name: `perplexity-translator`
- Public
- **不要勾選任何初始化選項**

#### 3.2 推送代碼

\`\`\`bash
cd "C:/Users/KEN/Desktop/其他文件/github website fuond/news-set"

# 替換 YOUR_USERNAME 為你的 GitHub 用戶名
git remote add origin https://github.com/YOUR_USERNAME/perplexity-translator.git
git branch -M main
git push -u origin main
\`\`\`

#### 3.3 部署到 Vercel

\`\`\`bash
vercel --prod
\`\`\`

設定環境變數時輸入：
- `GOOGLE_API_KEY`: 你的 Gemini API Key

記下部署後的網址（例如：`https://perplexity-translator.vercel.app`）

---

## 📱 步驟 4：設定 iOS 捷徑（5 分鐘）

### 快速版本

1. 打開「捷徑」App
2. 創建新捷徑，添加這些動作：
   - **接收** → 類型：URL
   - **字典** → 鍵：`url`，值：`捷徑輸入`
   - **取得 URL 內容** →
     - URL: `https://你的vercel網址.vercel.app/api/translate`
     - 方法：POST
     - 請求正文：JSON
     - JSON：字典
   - **取得字典值** → 鍵：`data.translation`
   - **拷貝到剪貼板**
   - **顯示通知** → 內容：`✅ 翻譯完成！`

3. 設定捷徑屬性：
   - 名稱：`Perplexity 翻譯器`
   - 開啟「在分享工作表中顯示」
   - 分享類型：URL

📖 **詳細步驟**：查看 [iOS-Shortcut-Setup.md](./iOS-Shortcut-Setup.md)

---

## 🎯 開始使用！

### 翻譯 Perplexity 文章

1. 在 Safari 打開 Perplexity 文章
2. 點擊分享按鈕
3. 選擇「Perplexity 翻譯器」
4. 等待 5-10 秒
5. 翻譯自動複製到剪貼簿！

### 支援的網站

- ✅ Perplexity
- ✅ BBC News
- ✅ CNN
- ✅ Medium
- ✅ The Guardian
- ✅ 幾乎所有公開的英文文章網站

---

## 💰 完全免費！

### Gemini API 限制

- ✅ **完全免費**
- ✅ 每分鐘 60 次請求
- ✅ 每天 1500 次請求
- ✅ 無需信用卡
- ✅ 翻譯品質優秀

即使每天翻譯 50 篇文章也綽綽有餘！

---

## 📚 完整文檔

| 文檔 | 說明 |
|------|------|
| **[GEMINI-SETUP.md](./GEMINI-SETUP.md)** | ⭐ Gemini API 設定指南 |
| [iOS-Shortcut-Setup.md](./iOS-Shortcut-Setup.md) | iOS 捷徑詳細設定 |
| [DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md) | 完整部署指南 |
| [README.md](./README.md) | 專案文檔 |
| [PROJECT-SUMMARY.md](./PROJECT-SUMMARY.md) | 專案總結 |

---

## ❓ 遇到問題？

### 問題 1：測試失敗，顯示「未設定 GOOGLE_API_KEY」

**解決：**
1. 檢查 `.env` 文件是否有 `GOOGLE_API_KEY=...`
2. 確認 API Key 正確（格式：`AIza...`）
3. 重新運行測試

### 問題 2：推送到 GitHub 失敗

**解決：**
1. 確認已在 GitHub 創建倉庫
2. 檢查用戶名拼寫
3. 確認有網路連接

### 問題 3：iOS 捷徑不工作

**解決：**
1. 確認 Vercel API URL 正確
2. 測試 API 端點是否正常
3. 檢查網路連接

---

## 🎊 完成檢查清單

- [ ] 已獲取 Gemini API Key
- [ ] 已更新 `.env` 文件
- [ ] 本地測試成功
- [ ] 推送到 GitHub
- [ ] 部署到 Vercel
- [ ] 設定 iOS 捷徑
- [ ] 測試完整翻譯流程

---

## 🚀 現在就開始吧！

1. **立即前往**：https://makersuite.google.com/app/apikey
2. **獲取 API Key**（2 分鐘）
3. **測試翻譯**（1 分鐘）
4. **部署使用**（10 分鐘）

**30 分鐘後，你就擁有專業的免費翻譯助手了！** 🎉

---

## 💬 需要幫助？

隨時告訴我：
- 「測試失敗」
- 「部署有問題」
- 「iOS 捷徑設定不對」

我會立即幫助你！💪

---

**開始行動吧！** 🚀
