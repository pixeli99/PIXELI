# PIXELI

一个人的知识库。论文阅读、随笔、片段。

站点：<https://pixeli99.github.io/PIXELI/>

## 首次启用

仓库 **Settings → Pages → Build and deployment**：

- Source 选 **GitHub Actions**

然后随便 push 一下触发 `.github/workflows/pages.yml`，几分钟后就上线了。

## 写一篇

笔记放 `_notes/`，论文笔记放 `_papers/`。文件名 `YYYY-MM-DD-slug.md`。

最小 front matter：

```yaml
---
title: 标题
date: 2026-05-20
tags: [扩散模型, 视频生成]   # 可选
math: true                  # 用到公式才打开（节省 KaTeX 资源）
---
```

文章里：

- 行内公式 `$x$`，块级公式 `$$ ... $$`
- 脚注 `这里有个脚注[^1]` ……尾部 `[^1]: 注解内容`
- 代码块用三反引号，自动高亮

## 本地预览

```sh
bundle install
bundle exec jekyll serve
```

打开 <http://127.0.0.1:4000/PIXELI/>。

> 需要 Ruby 3.1+。系统自带的 2.6 跑不动 `github-pages` 当前版本。

## 结构

```
_notes/      随笔
_papers/     论文阅读
_layouts/    布局
assets/      CSS、Favicon
index.md     首页（合并最近 12 条）
notes.md     /notes/
papers.md    /papers/
tags.md      /tags/
about.md     /about/
404.html
```
