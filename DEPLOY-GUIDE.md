# 🚀 部署指南

## ⚠️ 重要提示：API 額度問題

測試時發現你的 Claude API 額度不足：

```
Your credit balance is too low to access the Anthropic API.
Please go to Plans & Billing to upgrade or purchase credits.
```

### 解決方案

#### 選項 1：充值 Anthropic 帳戶（推薦）

1. 前往 [Anthropic Console - Billing](https://console.anthropic.com/settings/billing)
2. 添加付款方式
3. 購買 credits（建議 $10，可用很久）
4. 返回測試：`npm test 1`

#### 選項 2：使用免費的 Google Gemini（替代方案）

Google Gemini 完全免費，我可以幫你修改程式碼使用 Gemini。

---

## 📦 創建 GitHub 倉庫

### 方式一：使用 GitHub 網頁（推薦）

1. **前往 GitHub**
   - 訪問：https://github.com/new

2. **創建新倉庫**
   - Repository name: `perplexity-translator`
   - Description: `🌐 一鍵將 Perplexity 文章翻譯成繁體中文 | Claude Sonnet 4 AI 翻譯 + iOS 捷徑整合`
   - 選擇：Public
   - **不要**勾選 "Add a README file"
   - **不要**勾選 "Add .gitignore"
   - 點擊 "Create repository"

3. **連接本地倉庫並推送**

   在創建倉庫後，GitHub 會顯示指令，複製以下命令執行：

   ```bash
   cd "C:\Users\KEN\Desktop\其他文件\github website fuond\news-set"

   # 添加遠端倉庫（替換 YOUR_USERNAME 為你的 GitHub 用戶名）
   git remote add origin https://github.com/YOUR_USERNAME/perplexity-translator.git

   # 推送到 GitHub
   git branch -M main
   git push -u origin main
   ```

### 方式二：使用 GitHub Desktop

1. 打開 GitHub Desktop
2. File → Add Local Repository
3. 選擇專案路徑：`C:\Users\KEN\Desktop\其他文件\github website fuond\news-set`
4. 點擊 "Publish repository"
5. 設定倉庫名稱和描述
6. 點擊 "Publish"

---

## 🌐 部署到 Vercel

### 步驟 1：安裝 Vercel CLI

```bash
npm install -g vercel
```

### 步驟 2：登入 Vercel

```bash
vercel login
```

### 步驟 3：部署

```bash
cd "C:\Users\KEN\Desktop\其他文件\github website fuond\news-set"
vercel --prod
```

### 步驟 4：設定環境變數

部署過程中，Vercel 會問你是否要設定環境變數：

1. **ANTHROPIC_API_KEY**
   - 輸入你的 API Key：`sk-ant-api03-Psla...`
   - **重要**：確保這個 Key 有足夠的額度！

2. **其他變數**（使用默認值即可）
   - CLAUDE_MODEL: `claude-sonnet-4-20250514`
   - TRANSLATION_MAX_TOKENS: `4000`
   - TRANSLATION_TEMPERATURE: `0.3`

### 步驟 5：獲取部署網址

部署完成後，Vercel 會給你一個網址，例如：

```
https://perplexity-translator.vercel.app
```

記下這個網址，你需要在 iOS 捷徑中使用。

---

## 📱 設定 iOS 捷徑

### 完整步驟

詳見：[iOS-Shortcut-Setup.md](./iOS-Shortcut-Setup.md)

### 快速版

1. 打開「捷徑」App
2. 創建新捷徑，添加以下動作：
   - 接收 URL
   - 建立字典 `{"url": "輸入的URL"}`
   - 取得 URL 內容（POST 到 `https://你的vercel網址.vercel.app/api/translate`）
   - 從 JSON 取得 `data.translation`
   - 複製到剪貼簿
3. 開啟「在分享工作表中顯示」

---

## 🧪 測試部署

### 測試 API 端點

```bash
curl -X POST https://你的vercel網址.vercel.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello, this is a test translation."}'
```

預期結果：

```json
{
  "success": true,
  "data": {
    "translation": "你好，這是一個測試翻譯。",
    "stats": {
      "originalLength": 35,
      "translationLength": 13,
      "translatedAt": "2025-10-06T..."
    }
  }
}
```

### 測試 iOS 捷徑

1. 在 Safari 打開任何英文網站
2. 點擊分享
3. 選擇「Perplexity 翻譯器」
4. 等待翻譯
5. 檢查剪貼簿

---

## ⚡ 替代方案：使用 Google Gemini（免費）

如果你想使用完全免費的翻譯服務，我可以幫你修改程式碼使用 Google Gemini：

### Gemini 優勢

- ✅ **完全免費**
- ✅ 每分鐘 60 次請求
- ✅ 翻譯品質也很好
- ✅ 無需信用卡

### 修改步驟

1. **獲取 Gemini API Key**
   - 訪問：https://makersuite.google.com/app/apikey
   - 點擊 "Get API Key"
   - 創建或選擇 Google Cloud 專案
   - 複製 API Key

2. **修改程式碼**
   我可以幫你修改 `lib/translator.js` 使用 Gemini API

要我幫你切換到 Gemini 嗎？

---

## 📊 部署檢查清單

### GitHub

- [ ] 在 GitHub 創建新倉庫
- [ ] 連接本地倉庫
- [ ] 推送代碼到 GitHub
- [ ] 確認所有文件都已上傳

### Vercel

- [ ] 安裝 Vercel CLI
- [ ] 登入 Vercel 帳號
- [ ] 執行 `vercel --prod` 部署
- [ ] 設定環境變數（ANTHROPIC_API_KEY）
- [ ] 確認 API 額度充足
- [ ] 測試 API 端點
- [ ] 記錄部署網址

### iOS

- [ ] 創建 iOS 捷徑
- [ ] 設定 API URL（Vercel 網址）
- [ ] 測試分享功能
- [ ] 測試實際翻譯

---

## 💰 費用提醒

### 充值建議

| 金額 | 可翻譯文章數 | 適合 |
|------|------------|------|
| $5 | ~1,500 篇 | 輕度使用 |
| $10 | ~3,000 篇 | 中度使用 |
| $20 | ~6,000 篇 | 重度使用 |

---

## 🆘 遇到問題？

### API 額度不足

**錯誤訊息：**
```
Your credit balance is too low
```

**解決：**
1. 前往 [Anthropic Billing](https://console.anthropic.com/settings/billing)
2. 充值或切換到 Gemini

### 部署失敗

**檢查：**
1. 環境變數是否正確設定
2. API Key 是否有效
3. 查看 Vercel 日誌：`vercel logs`

### iOS 捷徑不工作

**檢查：**
1. API URL 是否正確
2. 網路連接是否正常
3. 在瀏覽器測試 API 端點

---

## 🎉 完成！

完成所有步驟後，你將擁有：

- ✅ GitHub 公開倉庫
- ✅ Vercel 部署的 API
- ✅ iOS 一鍵翻譯功能

**現在就開始部署吧！** 🚀

需要切換到免費的 Gemini API 嗎？告訴我，我立即幫你修改！
