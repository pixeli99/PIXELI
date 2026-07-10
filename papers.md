---
layout: default
title: 论文
permalink: /papers/
description: 论文阅读笔记，每篇含一句话概述、方法摘要、个人想法与引用。
---

# 论文

读过的论文，{{ site.papers | where_exp: "p", "p.published != false" | size }} 篇。每篇含一句话概述、方法、想法、引用四个段落。

{% assign papers_sorted = site.papers | where_exp: "p", "p.published != false" | sort: "date" | reverse %}
{% assign papers_by_year = papers_sorted | group_by_exp: "p", "p.date | date: '%Y'" %}
{% comment %}Build tag frequency list for the filter bar (tags with ≥5 papers){% endcomment %}
{% assign _all_tags = "" | split: "" %}
{% for p in papers_sorted %}{% for t in p.tags %}{% assign _all_tags = _all_tags | push: t %}{% endfor %}{% endfor %}
{% assign _uniq_tags = _all_tags | uniq %}
{% assign _freq_rows = "" | split: "" %}
{% for t in _uniq_tags %}{% assign _cnt = 0 %}{% for v in _all_tags %}{% if v == t %}{% assign _cnt = _cnt | plus: 1 %}{% endif %}{% endfor %}{% if _cnt >= 5 %}{% capture _row %}{{ _cnt | prepend: "00000" | slice: -5, 5 }}|{{ t }}{% endcapture %}{% assign _freq_rows = _freq_rows | push: _row %}{% endif %}{% endfor %}
{% assign _freq_rows = _freq_rows | sort | reverse %}

<nav class="year-nav" aria-label="按年份跳转">
{% for group in papers_by_year %}<a href="#y-{{ group.name }}" aria-label="{{ group.name }} 年，{{ group.items.size }} 篇">{{ group.name }}<sup aria-hidden="true">{{ group.items.size }}</sup></a>{% unless forloop.last %}<span aria-hidden="true"> · </span>{% endunless %}{% endfor %}
</nav>

<div class="papers-filter" role="group" aria-label="按标签过滤">
  <button class="pf-btn pf-active" data-tag="">全部</button>
  {% for row in _freq_rows %}{% assign _parts = row | split: "|" %}<button class="pf-btn" data-tag="{{ _parts[1] }}">{{ _parts[1] }}</button>{% endfor %}
</div>

{% for group in papers_by_year %}
  <h2 class="section-label" id="y-{{ group.name }}">{{ group.name }}</h2>
  <ul class="entry-list" role="list">
  {% for p in group.items %}
    {% assign p_exc = p.description | default: '' %}
    <li{% if p_exc.size > 10 %} class="with-excerpt"{% endif %} data-tags="{{ p.tags | join: ',' }}">
      <div class="entry-head">
        <a href="{{ p.url | relative_url }}">{{ p.title }}</a>
        <span class="entry-tail">
          {% if p.authors %}<span class="entry-authors" title="{{ p.authors }}">{{ p.authors }}</span>{% endif %}
          {% unless p.venue contains 'arXiv' or p.venue contains '博客' or p.venue == nil or p.venue == '' %}
            <span class="entry-venue" title="{{ p.venue }}">{{ p.venue }}</span>
          {% endunless %}
          <time datetime="{{ p.date | date_to_xmlschema }}">{{ p.date | date: "%Y-%m-%d" }}</time>
        </span>
      </div>
      {% if p_exc.size > 10 %}<div class="entry-excerpt">{{ p_exc }}</div>{% endif %}
    </li>
  {% endfor %}
  </ul>
{% endfor %}

<script>
(function () {
  var btns = document.querySelectorAll('.pf-btn');
  function applyFilter(tag) {
    document.querySelectorAll('.entry-list').forEach(function (ul) {
      var visible = 0;
      ul.querySelectorAll('li[data-tags]').forEach(function (li) {
        var match = !tag || li.getAttribute('data-tags').split(',').indexOf(tag) >= 0;
        li.hidden = !match;
        if (match) visible++;
      });
      var h = ul.previousElementSibling;
      if (h && h.classList.contains('section-label')) {
        h.hidden = visible === 0;
        ul.hidden = visible === 0;
      }
    });
  }
  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      btns.forEach(function (b) { b.classList.remove('pf-active'); });
      btn.classList.add('pf-active');
      applyFilter(btn.getAttribute('data-tag') || '');
    });
  });
})();
</script>
