# ⚡ 快速開始指南

## 📋 前置準備檢查清單

在開始之前，請確認：

- [ ] 已安裝 Node.js 18 或更高版本
- [ ] 已獲取 Anthropic API Key（⚠️ 不是 Claude Code 的 OAuth Token！）
- [ ] 有 iOS 設備（iPhone/iPad）用於測試捷徑

---

## 🔑 步驟 1：獲取 Claude API 金鑰

### ⚠️ 重要提示

**Claude Code 的 OAuth Token 無法用於此 API！**

你需要的是 **Anthropic API Key**，格式類似：`sk-ant-api03-...`

### 獲取步驟

1. 前往 [Anthropic Console](https://console.anthropic.com/settings/keys)
2. 使用 Google/GitHub 帳號登入（或註冊新帳號）
3. 點擊「Create Key」
4. 輸入名稱（例如：「Perplexity Translator」）
5. 複製生成的 API Key（⚠️ 只會顯示一次！）

**新用戶福利**：免費 $5 額度，可翻譯約 1500 篇文章！

詳細說明：[GET-API-KEY.md](./GET-API-KEY.md)

---

## 📦 步驟 2：安裝專案

```bash
# 進入專案目錄
cd "C:\Users\KEN\Desktop\其他文件\github website fuond\news-set"

# 安裝依賴（已完成）
npm install
```

---

## ⚙️ 步驟 3：設定 API 金鑰

編輯 `.env` 文件，替換為你的 API Key：

```env
ANTHROPIC_API_KEY=sk-ant-api03-你的實際金鑰
```

---

## 🧪 步驟 4：本地測試

### 測試翻譯功能

```bash
npm test 1
```

**成功輸出示例：**
```
✅ 翻譯成功！

原文長度: 500 字元
譯文長度: 450 字元

==================================================
翻譯結果:
==================================================
# 分析師警告 AI 泡沫超越網路時代

AI 投資的快速擴張引起了金融分析師的擔憂...
```

### 啟動本地服務器

```bash
npm run dev
```

訪問 http://localhost:3000 查看 API 狀態頁面。

---

## 🚀 步驟 5：部署到 Vercel

### 安裝 Vercel CLI

```bash
npm install -g vercel
```

### 登入 Vercel

```bash
vercel login
```

### 部署

```bash
vercel --prod
```

**重要**：部署時會要求設定環境變數，確保添加：
- `ANTHROPIC_API_KEY`: 你的 Claude API 金鑰

部署完成後會得到一個網址，例如：
```
https://your-project.vercel.app
```

---

## 📱 步驟 6：設定 iOS 捷徑

### 方法 A：手動創建（推薦）

詳細步驟請參考：[iOS-Shortcut-Setup.md](./iOS-Shortcut-Setup.md)

### 快速版本：

1. **打開「捷徑」App**

2. **點擊「+」創建新捷徑**

3. **添加以下動作**（按順序）：

   ① **接收** → 選擇「URL」類型

   ② **字典** → 添加：
   ```
   鍵: url
   值: 捷徑輸入
   ```

   ③ **取得 URL 內容** → 設定：
   ```
   URL: https://your-project.vercel.app/api/translate
   方法: POST
   請求正文: JSON
   JSON: 字典（上一步）
   ```

   ④ **取得字典值** → 取得 `data.translation`

   ⑤ **拷貝到剪貼板**

   ⑥ **顯示通知** → 內容：`✅ 翻譯完成！`

4. **設定捷徑屬性**
   - 名稱：`Perplexity 翻譯器`
   - 開啟「在分享工作表中顯示」
   - 分享類型：URL

---

## ✅ 步驟 7：測試完整流程

1. **在 Safari 打開任何英文文章**
   - 例如：https://www.bbc.com/news

2. **點擊分享按鈕**
   - 選擇「Perplexity 翻譯器」

3. **等待翻譯**
   - 約 5-10 秒

4. **查看結果**
   - 翻譯已自動複製到剪貼簿
   - 可以貼到任何 App

---

## 🎯 使用場景

### 場景 1：翻譯 Perplexity 文章

```
1. 在 Perplexity 瀏覽文章
2. 點擊分享 → Perplexity 翻譯器
3. 翻譯完成，貼到筆記 App
```

### 場景 2：翻譯新聞

```
BBC, CNN, Guardian 等任何英文新聞網站
分享 → 翻譯 → 完成
```

### 場景 3：翻譯技術文章

```
Medium, Dev.to, GitHub README
分享 → 翻譯 → 學習
```

---

## 🐛 疑難排解

### 問題 1：測試失敗，顯示 authentication_error

**原因**：API Key 錯誤或使用了 OAuth Token

**解決方法**：
1. 檢查 `.env` 中的 Key 格式是否為 `sk-ant-api03-...`
2. 確認不是 OAuth Token（格式：`sk-ant-oat01-...`）
3. 重新獲取 API Key：[GET-API-KEY.md](./GET-API-KEY.md)

### 問題 2：iOS 捷徑無法執行

**原因**：API URL 設定錯誤

**解決方法**：
1. 確認 Vercel 部署成功
2. 檢查捷徑中的 URL 是否正確
3. 測試 API 端點：
   ```bash
   curl -X POST https://your-project.vercel.app/api/translate \
     -H "Content-Type: application/json" \
     -d '{"content": "Hello"}'
   ```

### 問題 3：翻譯很慢

**原因**：文章太長

**說明**：
- 短文章（< 1000 字）：3-5 秒
- 長文章（> 3000 字）：15-30 秒（會自動分段翻譯）

---

## 💰 費用追蹤

### 查看使用量

1. 登入 [Anthropic Console](https://console.anthropic.com/)
2. 查看「Usage」頁面
3. 監控：
   - 已使用額度
   - 剩餘額度
   - 每日統計

### 估算費用

| 使用量 | 約略費用 |
|--------|---------|
| 10 篇文章 | $0.09（約 NT$3）|
| 100 篇文章 | $0.90（約 NT$27）|
| 1000 篇/月 | $9（約 NT$270）|

---

## 📚 下一步

- [ ] 閱讀完整文檔：[README.md](./README.md)
- [ ] 了解 API 詳細用法：查看 [API 文檔](#) 章節
- [ ] 自定義翻譯風格：修改 `lib/translator.js`
- [ ] 分享給朋友：讓更多人使用

---

## 🎉 完成！

現在你已經擁有：
- ✅ 個人專屬的翻譯 API
- ✅ iOS 一鍵翻譯捷徑
- ✅ 無限制的文章翻譯能力
- ✅ 專業級的翻譯品質

**開始享受你的翻譯助手吧！** 🚀

---

## 💡 提示

- **保存好你的 API Key**：建議用密碼管理器存儲
- **定期檢查使用量**：避免超出預算
- **分享專案給朋友**：幫助更多人突破語言障礙

有問題？查看 [常見問題](./README.md#常見問題) 或提交 Issue。
