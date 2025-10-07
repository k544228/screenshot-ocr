/**
 * Google Cloud Vision API OCR 提取器
 * 使用 Google Cloud Vision API 進行文字識別（服務帳戶認證）
 */

export class GoogleOCRExtractor {
  constructor(serviceAccountJson) {
    // 如果傳入的是 JSON 字符串，解析它
    if (typeof serviceAccountJson === 'string') {
      try {
        this.serviceAccount = JSON.parse(serviceAccountJson);
      } catch (e) {
        // 如果解析失敗，假設它是 base64 編碼的
        try {
          const decoded = Buffer.from(serviceAccountJson, 'base64').toString();
          this.serviceAccount = JSON.parse(decoded);
        } catch (e2) {
          throw new Error('無效的服務帳戶憑證');
        }
      }
    } else {
      this.serviceAccount = serviceAccountJson;
    }

    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * 獲取訪問令牌（使用 JWT）
   */
  async getAccessToken() {
    // 檢查現有令牌是否仍然有效
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // 創建 JWT
    const now = Math.floor(Date.now() / 1000);
    const expiry = now + 3600; // 1小時後過期

    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };

    const claimSet = {
      iss: this.serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-vision',
      aud: 'https://oauth2.googleapis.com/token',
      exp: expiry,
      iat: now
    };

    // Base64URL 編碼
    const base64UrlEncode = (obj) => {
      return Buffer.from(JSON.stringify(obj))
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    };

    const encodedHeader = base64UrlEncode(header);
    const encodedClaimSet = base64UrlEncode(claimSet);
    const signatureInput = `${encodedHeader}.${encodedClaimSet}`;

    // 使用 Node.js crypto 簽名
    const crypto = await import('crypto');
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signatureInput);
    const signature = sign.sign(this.serviceAccount.private_key, 'base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    const jwt = `${signatureInput}.${signature}`;

    // 交換 JWT 以獲取訪問令牌
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`獲取訪問令牌失敗: ${data.error_description || data.error}`);
    }

    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in * 1000);

    return this.accessToken;
  }

  /**
   * 使用 Google Cloud Vision API 提取文字
   * @param {string} imageData - Base64 編碼的圖片數據（不含 data:image 前綴）
   * @returns {Promise<string>} 提取的文字
   */
  async extractTextVision(imageData) {
    try {
      // 移除 data URL 前綴（如果有）
      const base64Data = imageData.includes(',')
        ? imageData.split(',')[1]
        : imageData;

      console.log('獲取訪問令牌...');
      const accessToken = await this.getAccessToken();

      console.log('發送請求到 Google Vision API...');
      console.log('圖片數據長度:', base64Data.length);

      const response = await fetch('https://vision.googleapis.com/v1/images:annotate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          requests: [{
            image: {
              content: base64Data
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 1
              }
            ]
          }]
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', JSON.stringify(data).substring(0, 500));

      // 檢查是否有錯誤
      if (data.responses && data.responses[0] && data.responses[0].error) {
        const error = data.responses[0].error;
        throw new Error(`Google Vision API 錯誤 [${error.code}]: ${error.message}`);
      }

      // 檢查是否有識別到文字
      if (data.responses && data.responses[0] && data.responses[0].fullTextAnnotation) {
        const text = data.responses[0].fullTextAnnotation.text;
        console.log('✅ 識別到文字，長度:', text.length);
        return text;
      }

      // 沒有識別到文字
      console.log('沒有識別到文字');
      return '';

    } catch (error) {
      console.error('Vision API 錯誤:', error);
      throw error;
    }
  }

  /**
   * 批量處理多張圖片
   * @param {Array<string>} images - Base64 編碼的圖片數據陣列
   * @returns {Promise<string>} 合併的文字
   */
  async extractFromMultipleImages(images) {
    const results = [];

    for (let i = 0; i < images.length; i++) {
      console.log(`處理圖片 ${i + 1}/${images.length}...`);

      try {
        const text = await this.extractTextVision(images[i]);
        results.push(text || '[此圖片無法識別]');
      } catch (error) {
        console.error(`圖片 ${i + 1} 處理失敗:`, error);
        results.push(`[錯誤: ${error.message}]`);
      }

      // 添加延遲避免速率限制
      if (i < images.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results.join('\n\n');
  }
}
