---
layout: default
title: 论文
permalink: /papers/
---

# 论文

读过的论文。每篇含一句话概述、方法、想法、引用四个段落。

{% assign papers_sorted = site.papers | sort: "date" | reverse %}
{% assign prev_year = "" %}
{% for p in papers_sorted %}
  {% assign year = p.date | date: "%Y" %}
  {% if year != prev_year %}
    {% unless forloop.first %}</ul>{% endunless %}
    <div class="section-label">{{ year }}</div>
    <ul class="entry-list">
    {% assign prev_year = year %}
  {% endif %}
  {% assign p_exc = p.content | split: '一句话' | last | split: '<h2' | first | strip_html | strip %}
  <li{% if p_exc.size > 10 %} class="with-excerpt"{% endif %}>
    <div class="entry-head">
      <a href="{{ p.url | relative_url }}">{{ p.title }}</a>
      <time>{{ p.date | date: "%Y-%m-%d" }}</time>
    </div>
    {% if p_exc.size > 10 %}<div class="entry-excerpt">{{ p_exc }}</div>{% endif %}
  </li>
{% endfor %}
{% if papers_sorted.size > 0 %}</ul>{% endif %}
