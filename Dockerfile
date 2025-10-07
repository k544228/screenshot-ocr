# 使用 Node.js 18 官方映像
FROM node:18-alpine

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴（只安裝生產環境依賴）
RUN npm ci --only=production

# 複製所有文件到容器
COPY . .

# 暴露端口 (Cloud Run 會自動設置 PORT 環境變量)
ENV PORT=8080
EXPOSE 8080

# 創建簡單的 Express 服務器來處理請求
RUN npm install express

# 啟動應用
CMD ["node", "server.js"]
