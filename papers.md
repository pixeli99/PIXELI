---
layout: default
title: 论文
permalink: /papers/
description: 论文阅读笔记，每篇含一句话概述、方法摘要、个人想法与引用。
---

# 论文

读过的论文。每篇含一句话概述、方法、想法、引用四个段落。

{% assign papers_sorted = site.papers | where_exp: "p", "p.published != false" | sort: "date" | reverse %}
{% assign prev_year = "" %}
{% for p in papers_sorted %}
  {% assign year = p.date | date: "%Y" %}
  {% if year != prev_year %}
    {% unless forloop.first %}</ul>{% endunless %}
    <h2 class="section-label">{{ year }}</h2>
    <ul class="entry-list">
    {% assign prev_year = year %}
  {% endif %}
  {% assign p_exc = p.content | split: '一句话' | last | split: '<h2' | first | strip_html | strip %}
  <li{% if p_exc.size > 10 %} class="with-excerpt"{% endif %}>
    <div class="entry-head">
      <a href="{{ p.url | relative_url }}">{{ p.title }}</a>
      <span class="entry-tail">
        {% if p.authors %}<span class="entry-authors">{{ p.authors }}</span>{% endif %}
        <time datetime="{{ p.date | date_to_xmlschema }}">{{ p.date | date: "%Y-%m-%d" }}</time>
      </span>
    </div>
    {% if p_exc.size > 10 %}<div class="entry-excerpt">{{ p_exc }}</div>{% endif %}
  </li>
{% endfor %}
{% if papers_sorted.size > 0 %}</ul>{% endif %}
