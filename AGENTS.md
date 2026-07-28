# Repository Guidelines

## Project Structure & Module Organization
This repository is a Nuxt 2 storefront (`auction-pcsc`) with SSR enabled.

- `pages/`: route-driven views
- `components/`: reusable Vue components
- `layouts/`: app shell layouts
- `api/`: request helpers
- `plugins/`: app plugins and client-only integrations
- `store/`: Vuex modules
- `assets/css/`: page/module styles
- `static/`: static files served from `/`
- `env.js` + `nuxt.config.js`: environment mapping, proxy, i18n, runtime config

## Build, Test, and Development Commands
- `npm install`: install dependencies
- `npm run php:dev`: run local dev server with PHP dev environment
- `npm run php:prod`: production build
- `npm run php:ps`: start built server

## Coding Style & Naming Conventions
- Follow `.editorconfig`: 2 spaces, UTF-8, LF, trim trailing whitespace.
- Vue SFCs follow existing repo conventions.
- Put shared styles in `assets/css/`; page-specific styles under matching subfolders.

## SVN 提交规范
**提交前必须设置编码**：`export LANG=zh_CN.UTF-8`，否则中文注释会乱码。

提交注释格式（中文前缀）：
```
修改：xx问题
新增：xx功能
删除：xx逻辑、删除xx文件
更新：xx功能
优化：xx功能逻辑
```
保持提交聚焦、原子化；避免混淆重构与行为变更。

## Pull Request Guidelines
- PRs should include: purpose, key changes, verification steps, related issue/task ID, and screenshots for UI changes.
- Call out config/env changes explicitly (especially `env.js`, `nuxt.config.js`, proxy/i18n settings).
