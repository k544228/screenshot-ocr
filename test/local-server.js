/**
 * 本地開發服務器
 * 模擬 Vercel 環境，用於本地測試
 */

import 'dotenv/config';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import translateHandler from '../api/translate.js';
import ocrHandler from '../api/ocr.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

// 簡單的路由處理
async function requestHandler(req, res) {
  // 解析請求 body
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    // 解析 JSON
    if (body) {
      try {
        req.body = JSON.parse(body);
      } catch (e) {
        req.body = {};
      }
    } else {
      req.body = {};
    }

    // 路由
    if (req.url === '/api/translate' || req.url === '/api/translate/') {
      await translateHandler(req, res);
    } else if (req.url === '/api/ocr' || req.url === '/api/ocr/') {
      await ocrHandler(req, res);
    } else if (req.url === '/' || req.url === '/index.html') {
      // 提供實際的 index.html 文件
      const indexPath = path.join(__dirname, '..', 'index.html');
      try {
        const content = fs.readFileSync(indexPath, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading index.html');
      }
    } else if (req.url === '/old' || req.url === '/old.html') {
      // 簡單的首頁
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Perplexity 翻譯器 API</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      line-height: 1.6;
    }
    h1 { color: #333; }
    .endpoint {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    code {
      background: #e8e8e8;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
    pre {
      background: #2d2d2d;
      color: #f8f8f8;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
    }
    .status {
      color: #22c55e;
      font-weight: bold;
    }
    button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }
    button:hover {
      background: #2563eb;
    }
    #result {
      margin-top: 20px;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <h1>🌐 Perplexity 翻譯器 API</h1>
  <p class="status">✅ 服務運行中</p>

  <div class="endpoint">
    <h2>API 端點</h2>
    <p><code>POST /api/translate</code></p>

    <h3>請求格式：</h3>
    <pre>{
  "url": "https://example.com/article",
  "options": {
    "preserveFormatting": true
  }
}</pre>

    <h3>或直接翻譯文本：</h3>
    <pre>{
  "content": "Your text to translate..."
}</pre>
  </div>

  <div class="endpoint">
    <h2>快速測試</h2>
    <p>點擊下方按鈕測試翻譯功能：</p>
    <button onclick="testTranslate()">測試翻譯</button>
    <div id="result"></div>
  </div>

  <div class="endpoint">
    <h2>使用方式</h2>
    <ol>
      <li>使用 iOS 捷徑分享文章連結</li>
      <li>捷徑會自動調用此 API</li>
      <li>等待翻譯完成</li>
      <li>結果自動複製到剪貼簿</li>
    </ol>
    <p>查看 <a href="https://github.com/your-repo/news-set">完整文檔</a></p>
  </div>

  <script>
    async function testTranslate() {
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = '<p style="color: #3b82f6;">⏳ 翻譯中，請稍候...</p>';

      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: 'Hello, this is a test. AI technology is changing the world.'
          })
        });

        const data = await response.json();

        if (data.success) {
          resultDiv.innerHTML = \`
            <h3 style="color: #22c55e;">✅ 翻譯成功！</h3>
            <p><strong>翻譯結果：</strong></p>
            <pre style="background: #f0f9ff; color: #0c4a6e; padding: 15px;">\${data.data.translation}</pre>
            <p><small>原文長度: \${data.data.stats.originalLength} | 譯文長度: \${data.data.stats.translationLength}</small></p>
          \`;
        } else {
          resultDiv.innerHTML = \`<p style="color: #ef4444;">❌ 錯誤: \${data.error}</p>\`;
        }
      } catch (error) {
        resultDiv.innerHTML = \`<p style="color: #ef4444;">❌ 請求失敗: \${error.message}</p>\`;
      }
    }
  </script>
</body>
</html>
      `);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
  });
}

// 啟動服務器
const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log('\n🚀 截圖文字提取 - 本地開發服務器');
  console.log('='.repeat(50));
  console.log(`✓ 服務運行在: http://localhost:${PORT}`);
  console.log(`✓ OCR 頁面: http://localhost:${PORT}/`);
  console.log(`✓ API 端點: http://localhost:${PORT}/api/ocr`);
  console.log(`✓ API 端點: http://localhost:${PORT}/api/translate`);
  console.log('='.repeat(50));
  console.log('\n按 Ctrl+C 停止服務器\n');
});

// 優雅關閉
process.on('SIGINT', () => {
  console.log('\n\n👋 關閉服務器...');
  server.close(() => {
    console.log('✓ 服務器已關閉\n');
    process.exit(0);
  });
});
