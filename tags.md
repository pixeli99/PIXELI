---
layout: default
title: 标签
permalink: /tags/
---

# 标签

{% assign all = site.notes | concat: site.papers %}
{% assign tags = "" | split: "" %}
{% for item in all %}
  {% for t in item.tags %}
    {% assign tags = tags | push: t %}
  {% endfor %}
{% endfor %}
{% assign unique_tags = tags | uniq | sort %}

{% if unique_tags.size == 0 %}
<p class="muted">还没有标签。在文章 front matter 里加 <code>tags: [扩散模型, 视频生成]</code> 就会出现在这里。</p>
{% else %}

<p class="tag-cloud">
{% for t in unique_tags %}
  {% assign count = 0 %}
  {% for item in all %}
    {% if item.tags contains t %}{% assign count = count | plus: 1 %}{% endif %}
  {% endfor %}
  <a href="#tag-{{ t | slugify }}">{{ t }}<sup>{{ count }}</sup></a>
{% endfor %}
</p>

{% for t in unique_tags %}
  <h2 id="tag-{{ t | slugify }}">{{ t }}</h2>
  <ul class="entry-list">
  {% assign matched = all | where_exp: "i", "i.tags contains t" | sort: "date" | reverse %}
  {% for item in matched %}
    <li>
      <a href="{{ item.url | relative_url }}">{{ item.title }}</a>
      <time>{{ item.date | date: "%Y-%m-%d" }}</time>
    </li>
  {% endfor %}
  </ul>
{% endfor %}

{% endif %}
