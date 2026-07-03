# PIXELI

一个人的知识库。论文阅读、随笔、片段。

站点：<https://pixeli99.github.io/PIXELI/>

> 键盘快捷键：在任何页面按 `/` 跳转搜索框。

## 首次启用

仓库 **Settings → Pages → Build and deployment**：

- Source 选 **GitHub Actions**

然后随便 push 一下触发 `.github/workflows/pages.yml`，几分钟后就上线了。

## 写一篇

文件名格式：`YYYY-MM-DD-slug.md`

**随笔** → `_notes/`

```yaml
---
title: 标题
date: 2026-05-20
tags: [扩散模型, 视频生成]   # 可选
excerpt: 一句话摘要          # 可选，用于列表预览和 SEO description
math: true                  # 有公式才加（节省 KaTeX 资源）
published: false            # 可选，草稿不发布时加
---
```

**论文笔记** → `_papers/`（可直接复制 `_papers/2026-05-20-template.md`）

```yaml
---
title: 论文标题
date: 2026-05-20
authors: 作者 et al. (机构)
venue: arXiv preprint          # 或 NeurIPS 2025 等
link: https://arxiv.org/abs/XXXX.XXXXX
tags: [MoE, Scaling]
math: true                  # 有公式才加
published: false            # 可选，草稿不发布时加
---
```

论文笔记推荐四段：`## 一句话` / `## 方法` / `## 想法` / `## 引用`。

bibtex 里含 `{{...}}` 大括号保护的 title，必须用 `{% raw %}...{% endraw %}` 包住，否则 Jekyll 把 `{{` 当 Liquid 变量报错：

````markdown
{% raw %}
```bibtex
@article{...,
  title = {{GShard}: ...},
}
```
{% endraw %}
````

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
_notes/           随笔
_papers/          论文阅读
_layouts/         布局
assets/           CSS、Favicon
index.md          首页（合并最近 12 条）
notes.md          /notes/
papers.md         /papers/
tags.md           /tags/
search.md         /search/（前端全文搜索）
world-models.html /world-models/（World Model 领域全景表）
about.md          /about/
404.html
```
