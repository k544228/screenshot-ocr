/**
 * Express 服務器 for Cloud Run
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import ocrHandler from './api/ocr.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// 解析 JSON body
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 提供靜態文件
app.use(express.static('.'));

// 主頁
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// OCR API
app.post('/api/ocr', async (req, res) => {
  await ocrHandler(req, res);
});

app.options('/api/ocr', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).end();
});

// 健康檢查端點 (Cloud Run 需要)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// 啟動服務器
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`✅ OCR Service: http://localhost:${PORT}/`);
  console.log(`✅ API Endpoint: http://localhost:${PORT}/api/ocr`);
  console.log(`✅ Health Check: http://localhost:${PORT}/health\n`);
});
