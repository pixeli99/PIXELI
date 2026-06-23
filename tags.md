---
layout: default
title: 标签
permalink: /tags/
description: 按标签浏览全部论文笔记与随笔。
---

# 标签

{% assign published_papers = site.papers | where_exp: "p", "p.published != false" %}
{% assign all = site.notes | where_exp: "n", "n.published != false" | concat: published_papers %}
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

{% assign tag_freq_entries = "" | split: "" %}
{% for t in unique_tags %}
  {% assign count = 0 %}
  {% for item in all %}
    {% if item.tags contains t %}{% assign count = count | plus: 1 %}{% endif %}
  {% endfor %}
  {% capture freq_entry %}{{ count | prepend: "00000" | slice: -5, 5 }}|{{ t }}{% endcapture %}
  {% assign tag_freq_entries = tag_freq_entries | push: freq_entry %}
{% endfor %}
{% assign sorted_by_freq = tag_freq_entries | sort | reverse %}

<p class="tag-cloud">
{% for entry in sorted_by_freq %}
  {% assign parts = entry | split: "|" %}
  {% assign t = parts[1] %}
  {% assign count = parts[0] | plus: 0 %}
  <a href="#tag-{{ t | slugify: "none" }}" aria-label="{{ t }}，{{ count }} 篇">{{ t }}<sup aria-hidden="true">{{ count }}</sup></a>
{% endfor %}
</p>

{% for entry in sorted_by_freq %}
  {% assign parts = entry | split: "|" %}
  {% assign t = parts[1] %}
  <h2 id="tag-{{ t | slugify: "none" }}">{{ t }}</h2>
  <ul class="entry-list" role="list">
  {% assign matched = all | where_exp: "i", "i.tags contains t" | sort: "date" | reverse %}
  {% for item in matched %}
    {% if item.collection == "papers" %}
      {% assign item_exc = item.content | split: '一句话' | last | split: '<h2' | first | strip_html | strip %}
    {% else %}
      {% assign item_exc = item.excerpt | strip_html | strip %}
    {% endif %}
    <li{% if item_exc.size > 10 %} class="with-excerpt"{% endif %}>
      <div class="entry-head">
        <a href="{{ item.url | relative_url }}">{{ item.title }}</a>
        <span class="entry-tail">
          {% if item.collection == "papers" %}<span class="kind">论文</span>{% else %}<span class="kind">笔记</span>{% endif %}
          {% if item.collection == "papers" %}
            {% if item.authors %}<span class="entry-authors">{{ item.authors }}</span>{% endif %}
            {% unless item.venue contains 'arXiv' or item.venue contains '博客' or item.venue == nil or item.venue == '' %}
              <span class="entry-venue">{{ item.venue }}</span>
            {% endunless %}
          {% endif %}
          <time datetime="{{ item.date | date_to_xmlschema }}">{{ item.date | date: "%Y-%m-%d" }}</time>
        </span>
      </div>
      {% if item_exc.size > 10 %}<div class="entry-excerpt">{{ item_exc }}</div>{% endif %}
    </li>
  {% endfor %}
  </ul>
{% endfor %}

{% endif %}
