---
layout: default
---

<h1 class="sr-only">{{ site.title }}</h1>
<div class="intro">
  <p>这里记一些读到的、想到的、写到的。</p>
  <p>——论文、随笔、片段。</p>
</div>

<h2 class="section-label">最近</h2>
{% assign published_papers = site.papers | where_exp: "p", "p.published != false" %}
{% assign all = site.notes | where_exp: "n", "n.published != false" | concat: published_papers | sort: "date" | reverse %}
<ul class="entry-list" role="list">
{% for item in all limit: 12 %}
  {%- if item.collection == "papers" -%}
    {%- assign exc = item.description | default: '' -%}
    {%- if exc.size < 10 -%}
      {%- assign _bt = item.content | strip_html | normalize_whitespace -%}
      {%- assign _ba = _bt | split: "一句话 " | last -%}
      {%- assign exc = _ba | split: " 方法 " | first | strip | truncate: 200, "" -%}
    {%- endif -%}
  {%- else -%}
    {%- assign exc = item.excerpt | strip_html | strip -%}
  {%- endif -%}
  <li{% if exc.size > 10 %} class="with-excerpt"{% endif %}>
    <div class="entry-head">
      <a href="{{ item.url | relative_url }}"{% if item.collection == 'papers' %} lang="en"{% endif %}>{{ item.title }}</a>
      <span class="entry-tail">
        {% if item.collection == "papers" %}<span class="kind">论文</span>{% else %}<span class="kind">笔记</span>{% endif %}
        {% if item.collection == "papers" and item.authors %}<span class="entry-authors" title="{{ item.authors }}">{{ item.authors }}</span>{% endif %}
        {% if item.collection == "papers" %}{% unless item.venue contains 'arXiv' or item.venue contains '博客' or item.venue == nil or item.venue == '' %}<span class="entry-venue" lang="en" title="{{ item.venue }}">{{ item.venue }}</span>{% endunless %}{% endif %}
        {% if item.collection == "notes" and item.tags.size > 0 %}{% for t in item.tags limit: 2 %}{% assign _tenc = t | url_encode %}<a href="{{ '/tags/' | relative_url }}#tag-{{ t | replace: ' ', '-' }}" class="entry-tag"{% unless _tenc contains '%' %} lang="en"{% endunless %}>{{ t }}</a>{% endfor %}{% endif %}
        <time datetime="{{ item.date | date_to_xmlschema }}">{{ item.date | date: "%Y-%m-%d" }}</time>
      </span>
    </div>
    {% if exc.size > 10 %}<div class="entry-excerpt">{{ exc }}</div>{% endif %}
  </li>
{% endfor %}
</ul>

{% assign _notes_count = all.size | minus: published_papers.size %}
<p class="more">
  全部 <a href="{{ '/notes/' | relative_url }}">{{ _notes_count }} 篇笔记</a>
  ／ <a href="{{ '/papers/' | relative_url }}">{{ published_papers.size }} 篇论文</a>
  ／按 <a href="{{ '/tags/' | relative_url }}">标签</a>看
</p>
