---
layout: default
title: 笔记
permalink: /notes/
---

# 笔记

随手记下的东西，按时间倒序排列。

<ul class="entry-list">
{% assign published_notes = site.notes | where_exp: "n", "n.published != false" %}
{% for n in published_notes %}
  {% assign n_exc = n.excerpt | strip_html | strip %}
  <li{% if n_exc.size > 10 %} class="with-excerpt"{% endif %}>
    <div class="entry-head">
      <a href="{{ n.url | relative_url }}">{{ n.title }}</a>
      <time>{{ n.date | date: "%Y-%m-%d" }}</time>
    </div>
    {% if n_exc.size > 10 %}<div class="entry-excerpt">{{ n_exc }}</div>{% endif %}
  </li>
{% endfor %}
</ul>
