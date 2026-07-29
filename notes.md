---
layout: default
title: 笔记
permalink: /notes/
description: 随手记下的随笔与综述，按时间倒序排列。
---

# 笔记

随手记下的东西，按时间倒序排列。

<ul class="entry-list" role="list">
{% assign published_notes = site.notes | where_exp: "n", "n.published != false" | sort: "date" | reverse %}
{% for n in published_notes %}
  {% assign n_exc = n.excerpt | strip_html | strip %}
  <li{% if n_exc.size > 10 %} class="with-excerpt"{% endif %}>
    <div class="entry-head">
      <a href="{{ n.url | relative_url }}">{{ n.title }}</a>
      <span class="entry-tail">
        <span class="kind">笔记</span>
        {% if n.tags and n.tags.size > 0 %}{% for t in n.tags limit: 2 %}<a href="{{ '/tags/' | relative_url }}#tag-{{ t | replace: ' ', '-' }}" class="entry-tag">{{ t }}</a>{% endfor %}{% endif %}
        <time datetime="{{ n.date | date_to_xmlschema }}">{{ n.date | date: "%Y-%m-%d" }}</time>
      </span>
    </div>
    {% if n_exc.size > 10 %}<div class="entry-excerpt">{{ n_exc }}</div>{% endif %}
  </li>
{% endfor %}
</ul>
