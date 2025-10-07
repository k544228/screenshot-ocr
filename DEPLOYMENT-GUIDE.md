# 部署指南

## 📦 完整部署步驟

### 第一步：創建 GitHub Repository

1. **打開 GitHub**
   - 前往 https://github.com/new
   - 或在 GitHub 首頁點擊右上角「+」→「New repository」

2. **填寫 Repository 信息**
   ```
   Repository name: screenshot-ocr
   Description: 截圖文字提取工具 - 使用 GPT-4o Vision 從截圖中提取文字
   Public/Private: 建議選 Public（這樣可以免費部署）

   ⚠️ 不要勾選「Add a README file」
   ⚠️ 不要添加 .gitignore（我們已經有了）
   ⚠️ 不要添加 license（可以稍後添加）
   ```

3. **創建 Repository**
   - 點擊「Create repository」按鈕

4. **複製 Repository URL**
   - 創建後會看到 Repository URL，類似：
   ```
   https://github.com/YOUR_USERNAME/screenshot-ocr.git
   ```

---

### 第二步：推送代碼到 GitHub

在 `news-set` 目錄下執行以下命令（把 YOUR_USERNAME 替換成你的 GitHub 用戶名）：

```bash
# 添加遠程倉庫
git remote add origin https://github.com/YOUR_USERNAME/screenshot-ocr.git

# 推送代碼
git branch -M master
git push -u origin master
```

如果需要登入，輸入你的 GitHub 用戶名和 Personal Access Token（不是密碼）。

---

### 第三步：部署到 Vercel

#### 方法一：通過 Vercel 網站（推薦）

1. **前往 Vercel**
   - 訪問 https://vercel.com
   - 點擊右上角「Login」或「Sign Up」
   - 選擇「Continue with GitHub」登入

2. **導入項目**
   - 登入後點擊「Add New...」→「Project」
   - 在列表中找到 `screenshot-ocr` repository
   - 點擊「Import」

3. **配置項目**
   ```
   Framework Preset: Other
   Root Directory: ./
   Build Command: (留空)
   Output Directory: public
   Install Command: npm install
   ```

4. **設置環境變數**
   - 在「Environment Variables」區域添加：
   ```
   Name: OPENAI_API_KEY
   Value: [你的 OpenAI API Key]
   ```
   - ⚠️ 確保選擇所有環境（Production, Preview, Development）

5. **部署**
   - 點擊「Deploy」
   - 等待部署完成（約 1-2 分鐘）

6. **獲取網址**
   - 部署成功後，你會得到一個網址，類似：
   ```
   https://screenshot-ocr.vercel.app
   ```

#### 方法二：使用 Vercel CLI（如果安裝了 vercel）

```bash
# 安裝 Vercel CLI（如果還沒安裝）
npm i -g vercel

# 登入
vercel login

# 部署
vercel --prod
```

在部署過程中：
- 選擇「Link to existing project」或「Create new project」
- 按照提示完成部署

---

### 第四步：測試網站

1. **訪問部署的網址**
   ```
   https://your-project.vercel.app
   ```

2. **測試功能**
   - 上傳一張包含中文文字的截圖
   - 點擊「提取文字」
   - 檢查是否正確提取文字
   - 點擊「複製文字」測試複製功能

---

### 第五步：配置自定義域名（可選）

如果你有自己的域名：

1. **在 Vercel 項目設置中**
   - 進入項目 Settings → Domains
   - 添加你的域名
   - 按照指示配置 DNS

---

## 🎯 快速命令參考

### 本地開發
```bash
cd "C:\Users\KEN\Desktop\其他文件\github website fuond\news-set"

# 測試 OCR 功能
npm run test:ocr 2

# 啟動本地開發服務器（如果需要）
npm run dev
```

### Git 操作
```bash
# 查看狀態
git status

# 添加更改
git add .

# 提交
git commit -m "Your commit message"

# 推送到 GitHub
git push
```

### Vercel 部署
```bash
# 快速部署（如果安裝了 Vercel CLI）
vercel --prod
```

---

## 🔐 安全注意事項

1. **環境變數**
   - ✅ OpenAI API Key 已經在 Vercel 環境變數中設置
   - ✅ `.env` 文件已在 `.gitignore` 中，不會上傳到 GitHub
   - ⚠️ 不要在代碼中硬編碼 API Key

2. **API 額度監控**
   - 定期檢查 OpenAI 使用量：https://platform.openai.com/usage
   - 建議設置使用限額
   - 每次 OCR 成本約 $0.001 美元

3. **訪問控制**
   - 目前網站是公開的，任何人都可以使用
   - 如果需要限制訪問，可以添加密碼或 API Key 驗證

---

## 📱 iOS Shortcut 配置（可選）

如果你想要在 iOS 上直接使用 Shortcut 而不是網頁：

### Shortcut 配置
```
1. 接收截圖（Share Sheet）
2. Base64 編碼
3. 發送 POST 到 https://your-project.vercel.app/api/ocr
4. 解析返回的 data.text
5. 複製到剪貼簿
6. 顯示通知
```

詳細步驟請參考 `OCR-README.md` 中的 iOS Shortcut 設置章節。

---

## 🐛 故障排除

### 部署失敗
- 檢查 `vercel.json` 配置
- 確保所有依賴都在 `package.json` 中
- 查看 Vercel 部署日誌

### OCR 不工作
- 檢查 Vercel 環境變數中的 `OPENAI_API_KEY` 是否正確
- 查看瀏覽器控制台錯誤信息
- 確認 OpenAI API 有足夠額度

### 圖片無法上傳
- 檢查圖片格式（只支持 PNG, JPG, JPEG）
- 確認圖片大小不超過 4MB
- 檢查網絡連接

---

## 📞 需要幫助？

1. **查看文檔**
   - `OCR-README.md` - 詳細使用說明
   - `DEPLOYMENT-GUIDE.md` - 本文檔

2. **檢查日誌**
   - Vercel: https://vercel.com/dashboard → 你的項目 → Logs
   - 瀏覽器控制台: F12 → Console

3. **常見問題**
   - API Key 無效 → 檢查環境變數設置
   - 提取失敗 → 確認圖片清晰度
   - 部署失敗 → 查看 Vercel 錯誤日誌

---

## ✅ 部署檢查清單

- [ ] GitHub Repository 已創建
- [ ] 代碼已推送到 GitHub
- [ ] Vercel 項目已創建
- [ ] OPENAI_API_KEY 環境變數已設置
- [ ] 部署成功
- [ ] 網站可訪問
- [ ] 上傳截圖功能正常
- [ ] OCR 提取功能正常
- [ ] 複製功能正常

全部完成後，你就可以開始使用截圖文字提取工具了！🎉
