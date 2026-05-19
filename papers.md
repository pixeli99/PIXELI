---
layout: default
title: 论文
permalink: /papers/
---

# 论文

读过的论文，按时间倒序排列。每篇含一句话概述、方法、想法、引用四个段落。

<ul class="entry-list">
{% for p in site.papers reversed %}
  <li>
    <a href="{{ p.url | relative_url }}">{{ p.title }}</a>
    <time>{{ p.date | date: "%Y-%m-%d" }}</time>
  </li>
{% endfor %}
</ul>
