---
layout: default
---

<div class="intro">
  <p>这里记一些读到的、想到的、写到的。</p>
  <p>——论文、随笔、片段。</p>
</div>

<div class="section-label">近期笔记</div>
<ul class="entry-list">
{% for n in site.notes reversed %}{% if forloop.index <= 5 %}
  <li>
    <a href="{{ n.url | relative_url }}">{{ n.title }}</a>
    <time>{{ n.date | date: "%Y-%m-%d" }}</time>
  </li>
{% endif %}{% endfor %}
</ul>

<div class="section-label">近期论文</div>
<ul class="entry-list">
{% for p in site.papers reversed %}{% if forloop.index <= 5 %}
  <li>
    <a href="{{ p.url | relative_url }}">{{ p.title }}</a>
    <time>{{ p.date | date: "%Y-%m-%d" }}</time>
  </li>
{% endif %}{% endfor %}
</ul>
