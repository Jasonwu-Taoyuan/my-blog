# 設定指南

## 📋 前置需求檢查清單

在開始之前,請確認:
- ✅ 已安裝 Node.js 18 或以上版本
- ✅ 已安裝 npm 或 yarn
- ✅ 有基本的命令列操作能力

## 🎯 完整設定步驟

### 步驟 1: 安裝依賴

在您的專案目錄中執行:

```bash
npm install
```

這會安裝所有需要的套件,包括:
- Next.js 16
- React 19
- Prisma (ORM)
- NextAuth (認證)
- Tailwind CSS (樣式)
- 以及其他依賴

### 步驟 2: 設定環境變數

1. 複製環境變數範例檔案:
```bash
cp .env.example .env
```

2. 編輯 `.env` 檔案:
```env
# 資料庫位置
DATABASE_URL="file:./dev.db"

# NextAuth 設定
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="請用下面的指令生成"

# 管理員帳號 (用於初始化)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="請設定一個安全的密碼"
```

3. 生成 `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

將生成的字串貼到 `.env` 的 `NEXTAUTH_SECRET` 中。

### 步驟 3: 初始化資料庫

1. 建立資料庫並執行 migrations:
```bash
npx prisma migrate dev --name init
```

2. 載入初始資料:
```bash
npm run db:seed
```

這會建立:
- 一個管理員帳號 (使用您在 .env 設定的 EMAIL 和 PASSWORD)
- 一篇範例文章
- 預設的 About 頁面內容

### 步驟 4: 啟動開發伺服器

```bash
npm run dev
```

伺服器會在 http://localhost:3000 啟動。

### 步驟 5: 第一次登入

1. 訪問 http://localhost:3000/admin/login
2. 使用您在 `.env` 設定的管理員帳號登入:
   - Email: 您設定的 ADMIN_EMAIL
   - Password: 您設定的 ADMIN_PASSWORD

登入成功後,您就可以開始管理您的部落格了!

## 🎨 基本使用

### 新增第一篇文章

1. 登入後台
2. 點擊 "Manage Posts"
3. 點擊 "New Post" 按鈕
4. 填寫文章資訊:
   - 標題: 文章標題
   - Slug: URL 路徑 (會自動從標題生成)
   - 摘要: 在列表頁顯示的簡短描述
   - 內容: 使用 Markdown 格式撰寫
   - 標籤: 用逗號分隔多個標籤
   - 狀態: 選擇 "published" 發布或 "draft" 儲存草稿
5. 點擊 "Save Post"

### 上傳封面圖片

在編輯文章時:
1. 點擊 "Upload Cover Image" 按鈕
2. 選擇圖片檔案
3. 圖片會自動上傳並設定為封面

### 在內容中插入圖片

在 Markdown 內容中使用:
```markdown
![圖片描述](圖片URL)
```

### 上傳照片到相簿

1. 點擊 "Manage Photos"
2. 點擊 "Upload Photo"
3. 選擇圖片並填寫資訊
4. 儲存

### 編輯個人資料

1. 點擊 "Edit About"
2. 更新您的:
   - 姓名
   - 標題 (例如: "Full Stack Developer")
   - 個人簡介 (支援 Markdown)
   - 社群連結
   - 工作經歷
   - 技能標籤
3. 儲存變更

## 🔧 常見問題

### Q: 如何修改網站標題?
A: 編輯 `app/layout.tsx` 中的 metadata。

### Q: 如何變更主題顏色?
A: 編輯 `app/globals.css` 和各元件中的 Tailwind 類別。

### Q: 如何新增社群連結?
A: 編輯 `components/Header.tsx` 和 `components/Footer.tsx`。

### Q: 忘記管理員密碼怎麼辦?
A: 修改 `.env` 中的 `ADMIN_PASSWORD`,然後重新執行 `npm run db:seed`。

### Q: 如何備份資料?
A: 複製 `prisma/dev.db` 檔案。

### Q: 資料庫結構修改後怎麼辦?
A: 執行 `npx prisma migrate dev --name your_change_name`。

## 📊 查看資料庫

使用 Prisma Studio 圖形化介面:
```bash
npx prisma studio
```

會在瀏覽器開啟,可以直接查看和編輯資料。

## 🚀 準備部署

### 本機測試 Production Build

```bash
npm run build
npm start
```

### 部署到 Vercel

1. 將程式碼推送到 GitHub
2. 在 Vercel 匯入專案
3. 設定環境變數 (與 .env 相同)
4. 部署

**重要**: SQLite 不適合雲端部署,建議改用 PostgreSQL。

## 🛠️ 開發工具指令

```bash
npm run dev          # 開發模式
npm run build        # 建立 production
npm start            # 執行 production
npm run lint         # 程式碼檢查
npm run db:seed      # 重新載入資料
npx prisma studio    # 開啟資料庫 GUI
npx prisma migrate   # 資料庫遷移
```

## 📝 下一步

- 自訂網站外觀和內容
- 新增更多文章
- 上傳照片
- 設定您的社群連結
- 準備部署到正式環境

需要更多協助?請查看 README.md 或提交 Issue!
