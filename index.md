---
layout: default
---

<div class="intro">
  <p>这里记一些读到的、想到的、写到的。</p>
  <p>——论文、随笔、片段。</p>
</div>

<div class="section-label">最近</div>
{% assign published_papers = site.papers | where_exp: "p", "p.published != false" %}
{% assign all = site.notes | concat: published_papers | sort: "date" | reverse %}
<ul class="entry-list">
{% for item in all %}{% if forloop.index <= 12 %}
  <li>
    <a href="{{ item.url | relative_url }}">{{ item.title }}</a>
    <span class="entry-tail">
      {% if item.collection == "papers" %}<span class="kind">论文</span>{% else %}<span class="kind">笔记</span>{% endif %}
      <time>{{ item.date | date: "%Y-%m-%d" }}</time>
    </span>
  </li>
{% endif %}{% endfor %}
</ul>

<p class="more">
  全部 <a href="{{ '/notes/' | relative_url }}">笔记</a>
  ／ <a href="{{ '/papers/' | relative_url }}">论文</a>
  ／按 <a href="{{ '/tags/' | relative_url }}">标签</a>看
</p>
