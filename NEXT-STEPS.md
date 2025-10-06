# 🎯 下一步行動指南

## 📊 當前狀態

✅ **已完成：**
- [x] 專案結構建立
- [x] 所有程式碼開發完成
- [x] API Key 已設定
- [x] 本地 Git 倉庫已創建並提交
- [x] 依賴套件已安裝

⚠️ **發現的問題：**
- [x] Claude API 額度不足（需要充值）

⏸️ **待完成：**
- [ ] 推送到 GitHub
- [ ] 部署到 Vercel
- [ ] 設定 iOS 捷徑
- [ ] 測試完整流程

---

## 🔴 重要：API 額度問題

### 問題說明

測試時發現錯誤：
```
Your credit balance is too low to access the Anthropic API.
```

### 解決方案（二選一）

#### 方案 A：充值 Anthropic 帳戶

**步驟：**
1. 前往 [Anthropic Console - Billing](https://console.anthropic.com/settings/billing)
2. 添加付款方式（信用卡）
3. 購買 Credits：
   - 建議充值：$10（可翻譯約 3000 篇文章）
   - 最低充值：$5（可翻譯約 1500 篇文章）
4. 等待幾分鐘讓額度生效
5. 返回測試：`npm test 1`

**優勢：**
- ✅ 翻譯品質最好（Claude Sonnet 4）
- ✅ 程式碼無需修改
- ✅ 立即可用

#### 方案 B：改用 Google Gemini（完全免費）

**步驟：**
1. 告訴我：「請幫我切換到 Gemini」
2. 我會幫你修改程式碼
3. 你去獲取 Gemini API Key（免費）
4. 更新 .env 文件
5. 測試並部署

**優勢：**
- ✅ **完全免費**
- ✅ 無需信用卡
- ✅ 翻譯品質也不錯
- ✅ 每分鐘 60 次請求

---

## 📦 步驟 1：推送到 GitHub

### 選項 A：使用網頁（推薦，最簡單）

1. **創建 GitHub 倉庫**
   - 訪問：https://github.com/new
   - Repository name: `perplexity-translator`
   - Description: `🌐 一鍵將 Perplexity 文章翻譯成繁體中文`
   - 選擇：**Public**
   - ⚠️ **不要**勾選任何初始化選項
   - 點擊「Create repository」

2. **推送代碼**

   創建倉庫後，GitHub 會顯示指令。在 Git Bash 中執行：

   ```bash
   cd "C:/Users/KEN/Desktop/其他文件/github website fuond/news-set"

   # 替換 YOUR_USERNAME 為你的 GitHub 用戶名
   git remote add origin https://github.com/YOUR_USERNAME/perplexity-translator.git
   git branch -M main
   git push -u origin main
   ```

### 選項 B：使用自動化腳本

```bash
# 在 Git Bash 中執行
cd "C:/Users/KEN/Desktop/其他文件/github website fuond/news-set"
bash github-setup.sh
```

腳本會引導你完成設定。

### 驗證

推送成功後，訪問你的 GitHub 倉庫確認文件已上傳：
```
https://github.com/YOUR_USERNAME/perplexity-translator
```

---

## 🌐 步驟 2：部署到 Vercel

### 前置條件

確保你已解決 API 額度問題（方案 A 或 B）。

### 部署步驟

1. **安裝 Vercel CLI**（如果尚未安裝）
   ```bash
   npm install -g vercel
   ```

2. **登入 Vercel**
   ```bash
   vercel login
   ```

   會打開瀏覽器讓你登入（可使用 GitHub 帳號）。

3. **執行部署**
   ```bash
   cd "C:/Users/KEN/Desktop/其他文件/github website fuond/news-set"
   vercel --prod
   ```

4. **設定環境變數**

   部署過程中會詢問環境變數，輸入以下值：

   | 變數名稱 | 值 |
   |---------|---|
   | `ANTHROPIC_API_KEY` | 你的 API Key（確保有額度！）|
   | `CLAUDE_MODEL` | `claude-sonnet-4-20250514` |
   | `TRANSLATION_MAX_TOKENS` | `4000` |
   | `TRANSLATION_TEMPERATURE` | `0.3` |

   如果使用 Gemini，變數會不同（我會告訴你）。

5. **記錄部署網址**

   部署完成後，Vercel 會給你一個網址，例如：
   ```
   https://perplexity-translator-xxx.vercel.app
   ```

   **重要**：記下這個網址，iOS 捷徑需要用到！

### 測試部署

```bash
# 測試 API（替換網址）
curl -X POST https://你的網址.vercel.app/api/translate \
  -H "Content-Type: application/json" \
  -d "{\"content\": \"Hello, World!\"}"
```

預期返回：
```json
{
  "success": true,
  "data": {
    "translation": "你好，世界！",
    ...
  }
}
```

---

## 📱 步驟 3：設定 iOS 捷徑

### 詳細教學

請參考：[iOS-Shortcut-Setup.md](./iOS-Shortcut-Setup.md)

### 快速版本

1. **打開「捷徑」App**

2. **創建新捷徑**，按順序添加：

   | 步驟 | 動作 | 設定 |
   |-----|------|------|
   | 1 | 接收 | 類型：URL |
   | 2 | 字典 | 鍵：`url`，值：`捷徑輸入` |
   | 3 | 取得 URL 內容 | URL：`https://你的vercel網址.vercel.app/api/translate`<br>方法：POST<br>請求正文：JSON<br>JSON：字典 |
   | 4 | 取得字典值 | 鍵：`data.translation` |
   | 5 | 拷貝到剪貼板 | - |
   | 6 | 顯示通知 | 內容：`✅ 翻譯完成！` |

3. **設定捷徑屬性**
   - 名稱：`Perplexity 翻譯器`
   - 開啟「在分享工作表中顯示」
   - 分享類型：URL

4. **測試**
   - 在 Safari 打開英文網站
   - 點擊分享 → 選擇你的捷徑
   - 等待翻譯完成

---

## ✅ 步驟 4：測試完整流程

### 測試 1：Perplexity 文章

1. 打開 Perplexity 文章（例如你之前提到的那篇）
2. 點擊分享
3. 選擇「Perplexity 翻譯器」
4. 等待 5-10 秒
5. 翻譯自動複製到剪貼簿
6. 貼到筆記 App 查看

### 測試 2：其他網站

試試這些網站：
- BBC News: https://www.bbc.com/news
- CNN: https://www.cnn.com/tech
- Medium: https://medium.com

### 測試 3：長文章

找一篇超過 3000 字的文章，測試分段翻譯功能。

---

## 📋 完整檢查清單

### API 設定

- [ ] 已解決 API 額度問題
  - [ ] 方案 A：充值 Anthropic 帳戶
  - [ ] 方案 B：切換到 Gemini
- [ ] 本地測試成功（`npm test 1`）

### GitHub

- [ ] 在 GitHub 創建倉庫
- [ ] 推送代碼到 GitHub
- [ ] 確認所有文件已上傳
- [ ] README 顯示正常

### Vercel

- [ ] 安裝 Vercel CLI
- [ ] 登入 Vercel
- [ ] 執行 `vercel --prod`
- [ ] 設定環境變數
- [ ] 記錄部署網址
- [ ] 測試 API 端點

### iOS 捷徑

- [ ] 創建捷徑
- [ ] 設定 Vercel API URL
- [ ] 啟用分享功能
- [ ] 測試 Perplexity 文章
- [ ] 測試其他網站
- [ ] 測試長文章

### 最終驗證

- [ ] 完整流程測試通過
- [ ] 翻譯品質滿意
- [ ] 速度可接受
- [ ] 無錯誤發生

---

## 🆘 需要幫助？

### 問題 1：API 額度不足

**我推薦：使用免費的 Gemini**

只需告訴我：「請幫我切換到 Gemini」，我會立即幫你修改程式碼。

### 問題 2：不知道如何充值

1. 訪問 [Anthropic Billing](https://console.anthropic.com/settings/billing)
2. 點擊「Add payment method」
3. 輸入信用卡資訊
4. 點擊「Add credits」
5. 選擇金額（建議 $10）
6. 完成付款

### 問題 3：GitHub 推送失敗

確認：
1. 倉庫已在 GitHub 創建
2. 用戶名拼寫正確
3. 有網路連接
4. 已登入 GitHub

### 問題 4：Vercel 部署失敗

檢查：
1. API Key 正確且有額度
2. 環境變數設定完整
3. 查看錯誤日誌：`vercel logs`

### 問題 5：iOS 捷徑不工作

確認：
1. API URL 正確（包含 https://）
2. 網路連接正常
3. API 已部署並測試成功

---

## 🎉 完成後

完成所有步驟後，你將擁有：

- ✅ 公開的 GitHub 倉庫
- ✅ 運行中的 Vercel API
- ✅ 可用的 iOS 一鍵翻譯
- ✅ 專業級的翻譯品質

---

## 💡 現在就開始！

### 立即行動

1. **決定 API 方案**
   - [ ] 充值 Anthropic（$10，最佳品質）
   - [ ] 切換到 Gemini（免費，品質也好）

2. **開始部署**
   - [ ] 推送到 GitHub
   - [ ] 部署到 Vercel
   - [ ] 設定 iOS 捷徑

3. **享受你的翻譯助手！** 🚀

---

## 📞 聯絡我

如果你遇到任何問題或需要：
- 切換到 Gemini API
- 修改翻譯風格
- 添加新功能
- 解決錯誤

**隨時告訴我！我會立即幫助你。**

---

**準備好了嗎？讓我們開始吧！** 🎊
