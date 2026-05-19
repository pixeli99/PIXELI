# PIXELI

一个人的知识库。论文阅读、随笔、片段。

站点：<https://pixeli99.github.io/PIXELI/>

## 写一篇

笔记放 `_notes/`，论文笔记放 `_papers/`。文件名 `YYYY-MM-DD-slug.md`，头部至少要有：

```yaml
---
title: 标题
date: 2026-05-20
---
```

## 本地预览

```sh
bundle install
bundle exec jekyll serve
```

打开 <http://127.0.0.1:4000/PIXELI/>。

## 部署

推到 `main` 触发 `.github/workflows/pages.yml`，构建后部署到 GitHub Pages。

首次启用：仓库 *Settings* → *Pages* → *Build and deployment source* 选 **GitHub Actions**。
