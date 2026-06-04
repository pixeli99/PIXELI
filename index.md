---
layout: default
---

<div class="intro">
  <p>这里记一些读到的、想到的、写到的。</p>
  <p>——论文、随笔、片段。</p>
</div>

<h2 class="section-label">最近</h2>
{% assign published_papers = site.papers | where_exp: "p", "p.published != false" %}
{% assign all = site.notes | concat: published_papers | sort: "date" | reverse %}
<ul class="entry-list">
{% for item in all %}{% if forloop.index <= 12 %}
  {% if item.collection == "papers" %}
    {% assign exc = item.content | split: '一句话' | last | split: '<h2' | first | strip_html | strip %}
  {% else %}
    {% assign exc = item.excerpt | strip_html | strip %}
  {% endif %}
  <li{% if exc.size > 10 %} class="with-excerpt"{% endif %}>
    <div class="entry-head">
      <a href="{{ item.url | relative_url }}">{{ item.title }}</a>
      <span class="entry-tail">
        {% if item.collection == "papers" %}<span class="kind">论文</span>{% else %}<span class="kind">笔记</span>{% endif %}
        <time datetime="{{ item.date | date_to_xmlschema }}">{{ item.date | date: "%Y-%m-%d" }}</time>
      </span>
    </div>
    {% if exc.size > 10 %}<div class="entry-excerpt">{{ exc }}</div>{% endif %}
  </li>
{% endif %}{% endfor %}
</ul>

<p class="more">
  全部 <a href="{{ '/notes/' | relative_url }}">笔记</a>
  ／ <a href="{{ '/papers/' | relative_url }}">论文</a>
  ／按 <a href="{{ '/tags/' | relative_url }}">标签</a>看
</p>
