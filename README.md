# Notebook App

一个全栈笔记本应用，支持笔记的创建、编辑、保存和删除，采用暗黑主题界面。

## 技术栈

**前端：** React 18 + TypeScript + Vite
**后端：** Python FastAPI + Uvicorn + SQLAlchemy + SQLite

## 项目结构

```
notebook-app/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       └── index.css
└── backend/
    ├── main.py
    └── requirements.txt
```

## 快速开始

### 启动后端

```bash
cd notebook-app/backend
pip install -r requirements.txt
uvicorn main:app --reload
```

后端运行在 `http://localhost:8000`，API 文档访问 `http://localhost:8000/docs`。

### 启动前端

```bash
cd notebook-app/frontend
npm install
npm run dev
```

前端运行在 `http://localhost:5173`。

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/notes` | 获取所有笔记 |
| GET | `/notes/{id}` | 获取单个笔记 |
| POST | `/notes` | 创建笔记 |
| PUT | `/notes/{id}` | 更新笔记 |
| DELETE | `/notes/{id}` | 删除笔记 |

## 功能特性

- 笔记的增删改查
- 侧边栏笔记列表导航
- 标题和内容编辑器
- GitHub Dark 风格暗黑主题
- 响应式布局

## 说明

- 后端使用 SQLite 数据库存储，数据持久化保存
- 数据库文件 `notes.db` 自动创建在 backend 目录下
- 前后端通过 REST API 通信，可独立部署
