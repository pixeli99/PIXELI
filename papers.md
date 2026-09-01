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
{% comment %}Build tag frequency list for the filter bar (tags with ≥3 papers){% endcomment %}
{% assign _all_tags = "" | split: "" %}
{% for p in papers_sorted %}{% for t in p.tags %}{% assign _all_tags = _all_tags | push: t %}{% endfor %}{% endfor %}
{% assign _uniq_tags = _all_tags | uniq %}
{% assign _freq_rows = "" | split: "" %}
{% for t in _uniq_tags %}{% assign _cnt = 0 %}{% for v in _all_tags %}{% if v == t %}{% assign _cnt = _cnt | plus: 1 %}{% endif %}{% endfor %}{% if _cnt >= 3 %}{% capture _row %}{{ _cnt | prepend: "00000" | slice: -5, 5 }}|{{ t }}{% endcapture %}{% assign _freq_rows = _freq_rows | push: _row %}{% endif %}{% endfor %}
{% assign _freq_rows = _freq_rows | sort | reverse %}

<nav class="year-nav" aria-label="按年份跳转">
{% for group in papers_by_year %}<a href="#y-{{ group.name }}" aria-label="{{ group.name }} 年，{{ group.items.size }} 篇">{{ group.name }}<sup aria-hidden="true">{{ group.items.size }}</sup></a>{% unless forloop.last %}<span aria-hidden="true"> · </span>{% endunless %}{% endfor %}
</nav>

<div class="papers-filter" role="group" aria-label="按标签过滤">
  <button class="pf-btn pf-active" data-tag="" aria-pressed="true" aria-label="全部，{{ papers_sorted.size }} 篇">全部<sup aria-hidden="true">{{ papers_sorted.size }}</sup></button>
  {% for row in _freq_rows %}{% assign _parts = row | split: "|" %}{% assign _n = _parts[0] | plus: 0 %}<button class="pf-btn" data-tag="{{ _parts[1] }}" aria-pressed="false"><span lang="en">{{ _parts[1] }}</span><sup aria-hidden="true">{{ _n }}</sup><span class="sr-only">，{{ _n }} 篇</span></button>{% endfor %}
</div>
<p class="sr-only" id="pf-status" role="status" aria-live="polite" aria-atomic="true"></p>

{% for group in papers_by_year %}
  <h2 class="section-label" id="y-{{ group.name }}">{{ group.name }}</h2>
  <ul class="entry-list" role="list">
  {% for p in group.items %}
    {%- assign p_exc = p.description | default: '' -%}
    {%- if p_exc.size < 10 -%}
      {%- assign _bt = p.content | strip_html | normalize_whitespace -%}
      {%- assign _ba = _bt | split: "一句话 " | last -%}
      {%- assign p_exc = _ba | split: " 方法 " | first | strip | truncate: 200, "" -%}
    {%- endif -%}
    <li{% if p_exc.size > 10 %} class="with-excerpt"{% endif %} data-tags="{{ p.tags | join: ',' }}">
      <div class="entry-head">
        <a href="{{ p.url | relative_url }}" lang="en">{{ p.title }}</a>
        <span class="entry-tail">
          {% if p.authors %}{% assign _aenc = p.authors | url_encode %}<span class="entry-authors"{% unless _aenc contains '%E' %} lang="en"{% endunless %} title="{{ p.authors }}">{{ p.authors }}</span>{% endif %}
          {% unless p.venue contains 'arXiv' or p.venue contains '博客' or p.venue == nil or p.venue == '' %}
            <span class="entry-venue" lang="en" title="{{ p.venue }}">{{ p.venue }}</span>
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
    var total = 0;
    document.querySelectorAll('.entry-list').forEach(function (ul) {
      var visible = 0;
      var lastVisible = null;
      ul.querySelectorAll('li.pf-last').forEach(function (li) { li.classList.remove('pf-last'); });
      ul.querySelectorAll('li[data-tags]').forEach(function (li) {
        var match = !tag || li.getAttribute('data-tags').split(',').indexOf(tag) >= 0;
        li.hidden = !match;
        if (match) { visible++; total++; lastVisible = li; }
      });
      if (lastVisible) lastVisible.classList.add('pf-last');
      var h = ul.previousElementSibling;
      if (h && h.classList.contains('section-label')) {
        h.hidden = visible === 0;
        ul.hidden = visible === 0;
      }
    });
    document.querySelectorAll('.year-nav a[href^="#"]').forEach(function (a) {
      var href = a.getAttribute('href');
      var target = document.getElementById(href.slice(1));
      var empty = target && target.hidden;
      if (empty) {
        a.setAttribute('aria-disabled', 'true');
        a.tabIndex = -1;
      } else {
        a.removeAttribute('aria-disabled');
        a.removeAttribute('tabindex');
      }
      var sup = a.querySelector('sup');
      if (sup && target) {
        var ul = target.nextElementSibling;
        var cnt = ul ? ul.querySelectorAll('li[data-tags]:not([hidden])').length : 0;
        sup.textContent = cnt;
        a.setAttribute('aria-label', href.slice(3) + ' 年，' + cnt + ' 篇');
      }
    });
    var statusEl = document.getElementById('pf-status');
    if (statusEl) {
      statusEl.textContent = tag ? tag + '：' + total + ' 篇' : '全部：' + total + ' 篇';
    }
  }
  function setActive(tag) {
    var anyActive = false;
    btns.forEach(function (b) {
      var active = b.getAttribute('data-tag') === tag;
      b.classList.toggle('pf-active', active);
      b.setAttribute('aria-pressed', active ? 'true' : 'false');
      b.tabIndex = active ? 0 : -1;
      if (active) anyActive = true;
    });
    // 若 URL ?tag= 的值不在过滤栏（篇数<3），保证至少第一个按钮可获焦
    if (!anyActive && btns.length) btns[0].tabIndex = 0;
    applyFilter(tag);
    var newUrl = tag
      ? (location.pathname + '?tag=' + encodeURIComponent(tag))
      : location.pathname;
    history.replaceState(null, '', newUrl);
    document.title = tag
      ? (tag + ' · 论文 · {{ site.title }}')
      : '论文 · {{ site.title }}';
  }
  // 初始化 roving tabindex：仅活跃按钮（"全部"）在 Tab 顺序里，其余退出
  btns.forEach(function (b) {
    b.tabIndex = b.classList.contains('pf-active') ? 0 : -1;
  });
  // 方向键在过滤栏内移动焦点，不触发激活
  var pfEl = document.querySelector('.papers-filter');
  if (pfEl) {
    pfEl.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') return;
      var arr = Array.from(btns);
      var idx = arr.indexOf(document.activeElement);
      if (idx < 0) return;
      e.preventDefault();
      var next;
      if (e.key === 'Home') { next = 0; }
      else if (e.key === 'End') { next = arr.length - 1; }
      else { next = e.key === 'ArrowLeft' ? (idx - 1 + arr.length) % arr.length : (idx + 1) % arr.length; }
      arr[idx].tabIndex = -1;
      arr[next].tabIndex = 0;
      arr[next].focus();
    });
    // 焦点离开过滤栏时，将 tabIndex 重置到当前激活按钮：
    // 下次 Tab 回到过滤栏时焦点落在已激活项，符合 ARIA radio group 模式。
    // relatedTarget 为 null（焦点移向不可聚焦元素）时同样视为"已离开"并重置。
    pfEl.addEventListener('focusout', function (e) {
      if (pfEl.contains(e.relatedTarget)) return;
      var arr = Array.from(btns);
      arr.forEach(function (b) { b.tabIndex = -1; });
      var ab = pfEl.querySelector('.pf-btn.pf-active');
      (ab || arr[0]).tabIndex = 0;
    });
  }
  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setActive(btn.getAttribute('data-tag') || '');
      // 移动端过滤栏横向滚动时，确保激活按钮完整可见（不被 mask 渐出截断）
      if (pfEl && pfEl.scrollWidth > pfEl.clientWidth) {
        var ab = pfEl.querySelector('.pf-btn.pf-active');
        if (ab) ab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
      }
    });
  });
  var initialTag = new URLSearchParams(location.search).get('tag') || '';
  // 校验 tag 参数：若不存在于任何论文的 data-tags，回退到"全部"并清理 URL
  if (initialTag) {
    var tagKnown = Array.from(document.querySelectorAll('li[data-tags]')).some(function (li) {
      return li.getAttribute('data-tags').split(',').indexOf(initialTag) >= 0;
    });
    if (!tagKnown) { initialTag = ''; history.replaceState(null, '', location.pathname); }
  }
  if (initialTag) {
    setActive(initialTag);
    var activeBtn = document.querySelector('.pf-btn.pf-active');
    if (activeBtn) activeBtn.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' });
  }
})();

(function () {
  var pf = document.querySelector('.papers-filter');
  if (!pf) return;
  function checkEnd() {
    pf.classList.toggle('pf-scrolled-end', pf.scrollLeft + pf.clientWidth >= pf.scrollWidth - 2);
    pf.classList.toggle('pf-scrolled-start', pf.scrollLeft > 2);
  }
  pf.addEventListener('scroll', checkEnd, { passive: true });
  window.addEventListener('resize', checkEnd, { passive: true });
  checkEnd();
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(checkEnd); }
})();

(function () {
  var yn = document.querySelector('.year-nav');
  if (!yn) return;
  function checkEnd() {
    yn.classList.toggle('yn-scrolled-end', yn.scrollLeft + yn.clientWidth >= yn.scrollWidth - 2);
    yn.classList.toggle('yn-scrolled-start', yn.scrollLeft > 2);
  }
  yn.addEventListener('scroll', checkEnd, { passive: true });
  window.addEventListener('resize', checkEnd, { passive: true });
  checkEnd();
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(checkEnd); }
})();
</script>
