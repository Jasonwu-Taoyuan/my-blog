# My Personal Blog

一個功能完整的個人部落格網站,使用 Next.js 14+ App Router、TypeScript、Tailwind CSS 和 SQLite 建立。

## ✨ 功能特點

### 前台功能
- 🏠 **首頁**: Hero 區、最新文章展示、社群連結
- 📝 **文章系統**: 列表、詳細頁面、搜尋、標籤篩選、分頁
- 🖼️ **照片畫廊**: 支援 Lightbox 預覽
- 👤 **關於頁面**: 個人介紹、經歷、技能展示
- 🔍 **搜尋功能**: 標題和摘要搜尋
- 🏷️ **標籤系統**: 文章分類和篩選
- 📱 **響應式設計**: 完美支援手機和桌面

### 後台功能
- 🔐 **安全登入**: NextAuth 5 認證
- ✍️ **文章管理**: 新增、編輯、刪除、草稿功能
- 📸 **照片管理**: 上傳、刪除照片
- 📄 **About 編輯**: 更新個人資料
- 📊 **Dashboard**: 統計數據一目了然

### 技術特點
- ⚡ **Markdown 編輯器**: 支援 GFM、程式碼高亮
- 🖼️ **圖片上傳**: 本機或雲端儲存
- 🎨 **Tailwind CSS**: 現代化 UI 設計
- 🔒 **安全認證**: bcrypt 密碼加密
- 📖 **閱讀時間**: 自動計算
- 🔗 **SEO 友善**: Meta tags、Open Graph

## 🚀 快速開始

### 環境需求
- Node.js 18+
- npm 或 yarn

### 安裝步驟

1. **克隆專案並安裝依賴**
```bash
git clone <your-repo>
cd my-blog
npm install
```

2. **設定環境變數**
```bash
cp .env.example .env
```

編輯 `.env` 檔案:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-secure-password"
```

生成 NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

3. **初始化資料庫**
```bash
npx prisma migrate dev
npx prisma db seed
```

4. **啟動開發伺服器**
```bash
npm run dev
```

訪問 http://localhost:3000 查看網站
訪問 http://localhost:3000/admin/login 登入後台

## 📁 專案結構

```
my-blog/
├── app/                    # Next.js App Router 頁面
│   ├── (public)/          # 公開頁面
│   │   ├── page.tsx       # 首頁
│   │   ├── posts/         # 文章頁面
│   │   ├── photos/        # 照片頁面
│   │   └── about/         # 關於頁面
│   ├── admin/             # 後台管理
│   │   ├── page.tsx       # Dashboard
│   │   ├── posts/         # 文章管理
│   │   ├── photos/        # 照片管理
│   │   ├── about/         # About 編輯
│   │   └── login/         # 登入頁面
│   ├── api/               # API 路由
│   └── layout.tsx         # 根佈局
├── components/            # React 元件
│   ├── Header.tsx         # 導覽列
│   ├── Footer.tsx         # 頁尾
│   ├── post/              # 文章相關元件
│   ├── photo/             # 照片相關元件
│   └── admin/             # 後台元件
├── lib/                   # 工具函式
│   ├── prisma.ts          # Prisma 客戶端
│   └── utils.ts           # 通用工具
├── prisma/                # 資料庫
│   ├── schema.prisma      # 資料庫 schema
│   └── seed.ts            # 初始資料
├── public/                # 靜態檔案
│   └── uploads/           # 上傳的圖片
├── auth.ts                # NextAuth 配置
└── middleware.ts          # 路由中介軟體
```

## 📝 使用說明

### 新增文章

1. 登入後台: http://localhost:3000/admin/login
2. 點擊 "Manage Posts" → "New Post"
3. 填寫文章資訊:
   - 標題
   - Slug (自動生成,可修改)
   - 摘要
   - 內容 (支援 Markdown)
   - 封面圖片 (選填)
   - 標籤
   - 狀態 (draft/published)
4. 點擊 "Save Post"

### 上傳照片

1. 進入 "Manage Photos"
2. 點擊 "Upload Photo"
3. 選擇圖片並填寫資訊
4. 儲存

### 編輯 About 頁面

1. 進入 "Edit About"
2. 更新個人資訊、經歷、技能
3. 儲存變更

## 🎨 自訂設定

### 修改網站名稱和描述

編輯 `app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'Your Blog Name',
  description: 'Your blog description',
}
```

### 修改社群連結

編輯 `components/Header.tsx` 和 `components/Footer.tsx`

### 修改主題顏色

編輯 `app/globals.css` 中的 Tailwind 類別

## 🔧 API 路由

### 公開 API
- `GET /api/posts` - 獲取文章列表
- `GET /api/posts/:slug` - 獲取單篇文章
- `GET /api/photos` - 獲取照片列表
- `GET /api/about` - 獲取 About 資訊

### 後台 API (需認證)
- `POST /api/admin/posts` - 新增文章
- `PUT /api/admin/posts/:id` - 更新文章
- `DELETE /api/admin/posts/:id` - 刪除文章
- `POST /api/admin/upload` - 上傳圖片
- `POST /api/admin/photos` - 新增照片
- `DELETE /api/admin/photos/:id` - 刪除照片
- `PUT /api/admin/about` - 更新 About

## 🚀 部署

### Vercel (推薦)

1. 推送程式碼到 GitHub
2. 在 Vercel 中匯入專案
3. 設定環境變數
4. 部署!

**注意**: SQLite 不適合 Vercel。建議改用 PostgreSQL:

1. 修改 `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. 使用 Vercel Postgres 或其他 PostgreSQL 服務
3. 更新 `DATABASE_URL` 環境變數
4. 執行 migrations

## 📦 建立 Production Build

```bash
npm run build
npm start
```

## 🛠️ 開發工具

- `npm run dev` - 啟動開發伺服器
- `npm run build` - 建立 production build
- `npm run start` - 啟動 production 伺服器
- `npm run lint` - 執行 ESLint
- `npx prisma studio` - 開啟 Prisma Studio (資料庫 GUI)
- `npx prisma migrate dev` - 建立新的 migration
- `npm run db:seed` - 重新載入種子資料

## 🐛 疑難排解

### 資料庫問題
```bash
# 重置資料庫
rm prisma/dev.db
npx prisma migrate dev
npx prisma db seed
```

### 認證問題
- 確認 NEXTAUTH_SECRET 已設定
- 檢查 NEXTAUTH_URL 是否正確
- 清除瀏覽器 cookies

### 圖片上傳問題
- 確認 `public/uploads` 目錄存在且有寫入權限
- 檢查檔案大小限制

## 📝 待辦功能 (選配)

- [ ] RSS feed
- [ ] 全文搜尋 (SQLite FTS)
- [ ] 文章目錄 (TOC)
- [ ] 評論系統
- [ ] 多語系支援
- [ ] Google Analytics
- [ ] Newsletter 訂閱
- [ ] 暗色模式

## 📄 授權

MIT

## 🤝 貢獻

歡迎提交 Issues 和 Pull Requests!

## 📧 聯絡

如有問題,請聯絡: your-email@example.com
