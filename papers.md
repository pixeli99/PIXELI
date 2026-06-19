---
layout: default
title: 论文
permalink: /papers/
description: 论文阅读笔记，每篇含一句话概述、方法摘要、个人想法与引用。
---

# 论文

读过的论文，{{ site.papers | where_exp: "p", "p.published != false" | size }} 篇。每篇含一句话概述、方法、想法、引用四个段落。

{% assign papers_sorted = site.papers | where_exp: "p", "p.published != false" | sort: "date" | reverse %}
{% assign papers_by_year = papers_sorted | group_by_exp: "p", "p.date | date: '%Y'" %}

<nav class="year-nav" aria-label="按年份跳转">
{% for group in papers_by_year %}<a href="#y-{{ group.name }}">{{ group.name }}<sup>{{ group.items.size }}</sup></a>{% unless forloop.last %} · {% endunless %}{% endfor %}
</nav>

{% for group in papers_by_year %}
  <h2 class="section-label" id="y-{{ group.name }}">{{ group.name }}</h2>
  <ul class="entry-list" role="list">
  {% for p in group.items %}
    {% assign p_exc = p.content | split: '一句话' | last | split: '<h2' | first | strip_html | strip %}
    <li{% if p_exc.size > 10 %} class="with-excerpt"{% endif %}>
      <div class="entry-head">
        <a href="{{ p.url | relative_url }}">{{ p.title }}</a>
        <span class="entry-tail">
          {% if p.authors %}<span class="entry-authors">{{ p.authors }}</span>{% endif %}
          {% unless p.venue contains 'arXiv' or p.venue contains '博客' or p.venue == nil or p.venue == '' %}
            <span class="entry-venue">{{ p.venue }}</span>
          {% endunless %}
          <time datetime="{{ p.date | date_to_xmlschema }}">{{ p.date | date: "%Y-%m-%d" }}</time>
        </span>
      </div>
      {% if p_exc.size > 10 %}<div class="entry-excerpt">{{ p_exc }}</div>{% endif %}
    </li>
  {% endfor %}
  </ul>
{% endfor %}
