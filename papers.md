---
layout: default
title: 论文
permalink: /papers/
---

# 论文

读过的论文。每篇含一句话概述、方法、想法、引用四个段落。

<ul class="entry-list">
{% for p in site.papers reversed %}
  {% assign p_exc = p.content | split: '一句话' | last | split: '<h2' | first | strip_html | strip %}
  <li{% if p_exc.size > 10 %} class="with-excerpt"{% endif %}>
    <div class="entry-head">
      <a href="{{ p.url | relative_url }}">{{ p.title }}</a>
      <time>{{ p.date | date: "%Y-%m-%d" }}</time>
    </div>
    {% if p_exc.size > 10 %}<div class="entry-excerpt">{{ p_exc }}</div>{% endif %}
  </li>
{% endfor %}
</ul>
