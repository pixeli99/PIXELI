---
layout: default
title: 笔记
permalink: /notes/
---

# 笔记

随手记下的东西，按时间倒序排列。

<ul class="entry-list">
{% for n in site.notes reversed %}
  <li>
    <a href="{{ n.url | relative_url }}">{{ n.title }}</a>
    <time>{{ n.date | date: "%Y-%m-%d" }}</time>
  </li>
{% endfor %}
</ul>
