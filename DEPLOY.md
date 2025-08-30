# 🚀 GitHub Pages 部署指南

## 📋 部署步驟

### 1. 創建GitHub帳號（如果還沒有的話）
- 前往 [GitHub.com](https://github.com)
- 點擊 "Sign up" 註冊新帳號
- 選擇免費方案

### 2. 創建新的Repository
- 登入GitHub後，點擊右上角 "+" 號
- 選擇 "New repository"
- Repository名稱：`green-pepper-pork`
- 設為 Public（公開）
- 不要勾選 "Add a README file"
- 點擊 "Create repository"

### 3. 上傳檔案到GitHub
```bash
# 在專案目錄中初始化Git
git init

# 添加所有檔案
git add .

# 提交第一個版本
git commit -m "Initial commit: 青椒香肉食譜網頁"

# 添加遠端倉庫
git remote add origin https://github.com/你的用戶名/倉庫名稱.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

### 4. 啟用GitHub Pages
- 前往你的Repository頁面
- 點擊 "Settings" 標籤
- 左側選單找到 "Pages"
- Source選擇 "Deploy from a branch"
- Branch選擇 "main"
- 點擊 "Save"

### 5. 等待部署完成
- GitHub會自動構建你的網站
- 通常需要1-5分鐘
- 部署完成後會顯示你的網站網址

## 🌐 網站網址格式
```
https://你的用戶名.github.io/green-pepper-pork/
```

## 📱 測試檢查清單
- [ ] 網頁正常載入
- [ ] 影片可以播放
- [ ] 滑動功能正常
- [ ] 響應式設計正常
- [ ] 主廚介紹顯示正確

## 🔧 更新網站
每次修改後，推送新版本：
```bash
git add .
git commit -m "更新描述"
git push
```

## 📞 遇到問題？
- 檢查GitHub Actions的部署狀態
- 確認檔案路徑正確
- 檢查瀏覽器控制台錯誤訊息

---

**祝您部署順利！** 🎉
