#!/bin/bash

# GitHub 設定腳本
# 使用方式：在 Git Bash 中執行此腳本

echo "🚀 GitHub 倉庫設定腳本"
echo "======================================"
echo ""

# 檢查是否在正確的目錄
if [ ! -f "package.json" ]; then
    echo "❌ 錯誤：請在專案根目錄執行此腳本"
    exit 1
fi

# 提示用戶輸入 GitHub 用戶名
echo "請輸入你的 GitHub 用戶名："
read GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ 錯誤：用戶名不能為空"
    exit 1
fi

echo ""
echo "📦 設定資訊："
echo "  GitHub 用戶名: $GITHUB_USERNAME"
echo "  倉庫名稱: perplexity-translator"
echo ""

# 確認
echo "是否繼續？(y/n)"
read CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "❌ 已取消"
    exit 0
fi

echo ""
echo "⚙️ 設定遠端倉庫..."

# 添加遠端倉庫
git remote add origin "https://github.com/$GITHUB_USERNAME/perplexity-translator.git"

if [ $? -eq 0 ]; then
    echo "✓ 遠端倉庫已添加"
else
    echo "⚠️ 遠端倉庫可能已存在，嘗試更新..."
    git remote set-url origin "https://github.com/$GITHUB_USERNAME/perplexity-translator.git"
fi

echo ""
echo "📤 推送到 GitHub..."

# 重命名分支為 main
git branch -M main

# 推送
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    echo "🌐 倉庫網址："
    echo "   https://github.com/$GITHUB_USERNAME/perplexity-translator"
    echo ""
    echo "📋 下一步："
    echo "   1. 訪問倉庫網址確認代碼已上傳"
    echo "   2. 執行 'vercel --prod' 部署到 Vercel"
    echo "   3. 設定 iOS 捷徑"
    echo ""
else
    echo ""
    echo "❌ 推送失敗！"
    echo ""
    echo "可能的原因："
    echo "  1. 倉庫尚未在 GitHub 上創建"
    echo "  2. 用戶名輸入錯誤"
    echo "  3. 沒有推送權限"
    echo ""
    echo "請手動創建倉庫："
    echo "  1. 訪問 https://github.com/new"
    echo "  2. 倉庫名稱：perplexity-translator"
    echo "  3. 選擇 Public"
    echo "  4. 不要勾選任何初始化選項"
    echo "  5. 創建後再次執行此腳本"
    echo ""
fi
