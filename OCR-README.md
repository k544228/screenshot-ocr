# OCR 文字提取服務

## 📱 實際使用說明

這個服務已經從**翻譯服務**改為**純 OCR 文字提取服務**，專門用於從截圖中提取繁體中文文字。

### 為什麼改用 OCR？

原本的問題：
- Perplexity 頁面**本身已經是繁體中文**
- 只是想要**一鍵複製整篇文章**到剪貼簿
- 之前的方案使用 URL 提取會得到英文原文，需要翻譯

現在的方案：
- ✅ 直接截圖已經顯示的繁體中文頁面
- ✅ OCR 提取圖片中的文字
- ✅ 不需要翻譯，直接複製到剪貼簿

---

## 🚀 快速開始

### 1. 本地測試（需要真實截圖）

由於 GPT-4o-mini 需要處理真實的 PNG/JPG 截圖，請按照以下步驟測試：

#### 準備測試截圖
1. 在手機或電腦上截取任何包含中文文字的頁面
2. 將截圖命名為 `test-image.png`
3. 放到 `test/` 目錄下

#### 運行測試
```bash
npm run test:ocr 2
```

### 2. API 端點

#### 端點地址
```
POST https://your-domain.vercel.app/api/ocr
```

#### 請求格式（單張圖片）
```json
{
  "image": "base64_encoded_image_data"
}
```

#### 請求格式（多張圖片）
```json
{
  "images": [
    "base64_image_1",
    "base64_image_2",
    "base64_image_3"
  ]
}
```

#### 響應格式
```json
{
  "success": true,
  "data": {
    "text": "提取的文字內容...",
    "stats": {
      "imageCount": 1,
      "textLength": 1234,
      "extractedAt": "2025-10-06T06:00:00.000Z"
    }
  }
}
```

---

## 📲 iOS Shortcut 設置

### Shortcut 流程
```
1. 截圖（Share Sheet）
2. 將圖片轉為 Base64
3. 發送 POST 請求到 /api/ocr
4. 解析返回的文字
5. 複製到剪貼簿
6. 顯示通知
```

### 詳細步驟

1. **創建新 Shortcut**
   - 打開「捷徑」App
   - 點擊右上角「+」創建新捷徑

2. **添加動作**

   **a. 接收輸入**
   ```
   動作：接收「Share Sheet」輸入
   類型：圖像
   ```

   **b. Base64 編碼**
   ```
   動作：Base64 編碼
   輸入：捷徑輸入（圖片）
   ```

   **c. 構建請求體**
   ```
   動作：文字
   內容：{"image": "BASE64_CONTENT"}

   然後替換 BASE64_CONTENT 為「Base64 編碼結果」
   ```

   **d. 發送 API 請求**
   ```
   動作：取得 URL 內容
   URL：https://your-domain.vercel.app/api/ocr
   方法：POST
   Header：Content-Type: application/json
   請求本文：上一步的文字
   ```

   **e. 解析結果**
   ```
   動作：從輸入取得字典
   鍵：data.text
   ```

   **f. 複製到剪貼簿**
   ```
   動作：拷貝到剪貼簿
   內容：字典值
   ```

   **g. 顯示通知**
   ```
   動作：顯示通知
   內容：「✅ 文字已複製到剪貼簿」
   ```

3. **測試 Shortcut**
   - 在任何 App 中截圖
   - 點擊分享按鈕
   - 選擇你的 Shortcut
   - 文字會自動複製到剪貼簿

---

## 🎯 功能特點

### ✅ 支持的功能
- 從截圖中提取繁體中文、英文、數字等文字
- 保持原始格式（標題、段落、列表等）
- 自動忽略圖片、廣告等非文字內容
- 支持多張圖片批量處理
- 低成本（GPT-4o-mini）

### ⚠️ 限制
- 需要清晰的截圖（模糊圖片識別率低）
- 單張圖片建議不超過 4MB
- 需要 OpenAI API 有效額度

---

## 💰 成本估算

使用 GPT-4o-mini Vision API：
- 輸入：約 $0.15 / 1M tokens
- 一張普通截圖：約 500-1000 tokens
- **單次 OCR 成本：< $0.001 美元（不到 1 毛錢台幣）**

非常適合個人使用！

---

## 🔧 本地開發

### 環境變數
在 `.env` 文件中設置：
```env
OPENAI_API_KEY=your-openai-api-key
```

### 測試命令
```bash
# 測試圖片 URL（可能不支持某些格式）
npm run test:ocr 1

# 測試本地圖片（推薦）
npm run test:ocr 2
```

---

## 📦 部署到 Vercel

### 1. 提交代碼到 GitHub
```bash
git add .
git commit -m "Add OCR text extraction feature"
git push
```

### 2. 在 Vercel 設置環境變數
- 登入 Vercel
- 選擇項目
- Settings → Environment Variables
- 添加：`OPENAI_API_KEY`

### 3. 部署
```bash
npm run deploy
```

### 4. 獲取 API URL
部署完成後，你會得到：
```
https://your-project.vercel.app/api/ocr
```

把這個 URL 用在 iOS Shortcut 中！

---

## 📝 使用場景

1. **Perplexity 文章複製**
   - 截圖文章內容
   - 運行 Shortcut
   - 直接粘貼到筆記 App

2. **網頁文字提取**
   - 無法複製的網頁文字
   - 截圖後自動提取

3. **圖片文字識別**
   - PDF 截圖轉文字
   - 照片中的文字提取

---

## ❓ 常見問題

### Q: 為什麼不用免費的 OCR 服務？
A: 免費 OCR 服務通常：
- 識別準確率較低（特別是中文）
- 不保留格式
- 有廣告或限流
- GPT-4o-mini 成本極低，質量極高

### Q: 可以識別手寫文字嗎？
A: 可以，但準確率取決於手寫清晰度

### Q: 支持其他語言嗎？
A: 支持！GPT-4o-mini 支持多種語言的 OCR

### Q: 多張圖片怎麼處理？
A: iOS Shortcut 可以選擇多張圖片，會自動批量處理並合併結果

---

## 🎉 完成！

現在你有一個完全自動化的截圖文字提取系統：
1. ✅ 截圖
2. ✅ 點擊 Shortcut
3. ✅ 文字自動複製到剪貼簿

再也不用手動輸入網頁文字了！
