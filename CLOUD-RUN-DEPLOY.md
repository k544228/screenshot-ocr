# Cloud Run 部署指南

## 前置需求

1. **Google Cloud 帳號** - 需要有 Google Cloud 帳號
2. **Google Cloud Vision API Key** - 需要申請 API Key
3. **gcloud CLI** - 需要安裝 Google Cloud CLI

## 步驟 1: 獲取 Google Vision API Key

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 創建新項目（或選擇現有項目）
3. 啟用 **Cloud Vision API**:
   ```
   APIs & Services -> Enable APIs and Services -> 搜尋 "Cloud Vision API" -> 啟用
   ```
4. 創建 API Key:
   ```
   APIs & Services -> Credentials -> Create Credentials -> API Key
   ```
5. **限制 API Key**（重要）:
   - 點擊剛創建的 API Key
   - API restrictions -> Restrict key
   - 選擇 "Cloud Vision API"
   - 保存

## 步驟 2: 安裝 Google Cloud CLI

### Windows:
```bash
# 下載並安裝
https://cloud.google.com/sdk/docs/install

# 初始化
gcloud init
```

### macOS/Linux:
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

## 步驟 3: 部署到 Cloud Run

### 方法 A: 使用命令行（推薦）

```bash
# 1. 進入專案目錄
cd news-set

# 2. 設置 Google Cloud 項目
gcloud config set project YOUR_PROJECT_ID

# 3. 部署到 Cloud Run
gcloud run deploy screenshot-ocr \
  --source . \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_VISION_API_KEY=你的API_KEY

# 4. 部署完成後會顯示服務 URL
```

### 方法 B: 使用 Docker（手動）

```bash
# 1. 構建 Docker 映像
docker build -t gcr.io/YOUR_PROJECT_ID/screenshot-ocr .

# 2. 推送到 Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/screenshot-ocr

# 3. 部署到 Cloud Run
gcloud run deploy screenshot-ocr \
  --image gcr.io/YOUR_PROJECT_ID/screenshot-ocr \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_VISION_API_KEY=你的API_KEY
```

## 步驟 4: 設置環境變量（如果沒有在部署時設置）

```bash
gcloud run services update screenshot-ocr \
  --update-env-vars GOOGLE_VISION_API_KEY=你的API_KEY \
  --region asia-east1
```

## 步驟 5: 驗證部署

訪問 Cloud Run 提供的 URL，應該能看到 OCR 工具界面。

## 常見問題

### 1. Build failed

**問題**: 構建失敗
**解決**: 確保所有依賴都在 `package.json` 中正確列出

### 2. API Key 錯誤

**問題**: `需要 Google Vision API Key`
**解決**: 確認環境變量設置正確
```bash
gcloud run services describe screenshot-ocr --region asia-east1
```

### 3. 超過免費額度

**問題**: Vision API 超過免費額度
**解決**:
- 檢查 [Google Cloud Console](https://console.cloud.google.com/billing) 的使用量
- 考慮設置預算警報
- 免費額度：每月 1000 次請求

## 成本估算

- **Cloud Run**: 每月 200 萬次請求免費
- **Cloud Vision API**: 每月 1000 次請求免費
- **總成本**: 基本免費（輕度使用）

## 監控和日誌

### 查看日誌
```bash
gcloud run logs read screenshot-ocr --region asia-east1
```

### 查看監控
前往: [Cloud Run Console](https://console.cloud.google.com/run)

## 更新部署

```bash
# 更新代碼後重新部署
gcloud run deploy screenshot-ocr \
  --source . \
  --region asia-east1
```

## 刪除服務

```bash
gcloud run services delete screenshot-ocr --region asia-east1
```

## 注意事項

⚠️ **重要**:
1. 不要將 API Key 提交到 Git
2. 建議設置 API Key 限制
3. 監控 API 使用量避免超額
4. 定期檢查 Cloud Run 日誌

## 參考資料

- [Cloud Run 文檔](https://cloud.google.com/run/docs)
- [Cloud Vision API 文檔](https://cloud.google.com/vision/docs)
- [定價資訊](https://cloud.google.com/run/pricing)
