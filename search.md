---
layout: default
title: 搜索
permalink: /search/
description: 全文搜索全站论文笔记与随笔。
---

# 搜索

<noscript><p class="muted search-hint">搜索需要 JavaScript，当前浏览器已禁用。请通过<a href="{{ '/tags/' | relative_url }}">标签</a>或<a href="{{ '/papers/' | relative_url }}">论文列表</a>浏览。</p></noscript>
<label for="q" class="sr-only">搜索</label>
<input type="search" id="q" placeholder="搜论文、笔记…" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" disabled>
<ul id="results" class="entry-list" role="list"></ul>
<p id="hint" class="muted" role="status" aria-live="polite" aria-atomic="true">加载中…</p>

<script>
(function () {
  var q = document.getElementById('q');
  var out = document.getElementById('results');
  var hint = document.getElementById('hint');
  var docs = [];

  var initialQ = new URLSearchParams(location.search).get('q') || '';
  if (initialQ) { q.value = initialQ; }

  fetch('{{ "/search.json" | relative_url }}')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      docs = data;
      q.disabled = false;
      if (initialQ) { doSearch(); } else { hint.textContent = '输入关键词搜索全站'; q.focus(); }
    })
    .catch(function () { hint.textContent = '索引加载失败'; });

  function score(doc, terms) {
    var s = 0;
    var title   = doc.title.toLowerCase();
    var text    = (doc.text    || '').toLowerCase();
    var tags    = (doc.tags    || []).join(' ').toLowerCase();
    var authors = (doc.authors || '').toLowerCase();
    var venue   = (doc.venue   || '').toLowerCase();
    terms.forEach(function (t) {
      if (title.indexOf(t)   >= 0) s += 10;
      if (authors.indexOf(t) >= 0) s += 4;
      if (tags.indexOf(t)    >= 0) s += 4;
      if (venue.indexOf(t)   >= 0) s += 3;
      if (text.indexOf(t)    >= 0) s += 1;
    });
    return s;
  }

  function esc(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function highlight(escaped, terms) {
    var s = escaped;
    terms.forEach(function (t) {
      if (!t) return;
      var re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      s = s.replace(re, '<mark>$1</mark>');
    });
    return s;
  }

  function snippet(text, terms, maxLen) {
    if (!text) return '';
    maxLen = maxLen || 160;
    var lower = text.toLowerCase();
    var best = -1;
    terms.forEach(function (t) {
      if (!t) return;
      var idx = lower.indexOf(t);
      if (idx >= 0 && (best < 0 || idx < best)) best = idx;
    });
    if (best < 0) return text.slice(0, maxLen);
    var start = Math.max(0, best - 60);
    var end = Math.min(text.length, start + maxLen);
    return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
  }

  function render(results, total, terms) {
    if (!results.length) {
      out.innerHTML = '';
      hint.textContent = '没有找到匹配内容';
      return;
    }
    hint.textContent = total > results.length
      ? '显示前 ' + results.length + ' 条（共 ' + total + ' 条）'
      : '找到 ' + results.length + ' 条结果';
    out.innerHTML = results.map(function (d) {
      var kind = d.collection === 'papers' ? '论文' : '笔记';
      var authStr = (d.authors && d.collection === 'papers')
        ? '<span class="entry-authors">' + highlight(esc(d.authors), terms) + '</span>' : '';
      var v = d.venue || '';
      var venueStr = (d.collection === 'papers' && v && v.indexOf('arXiv') < 0 && v.indexOf('博客') < 0)
        ? '<span class="entry-venue">' + highlight(esc(v), terms) + '</span>' : '';
      var tail = '<span class="entry-tail"><span class="kind">' + kind + '</span>' + authStr + venueStr +
                 (d.date ? '<time datetime="' + esc(d.date) + '">' + esc(d.date) + '</time>' : '') + '</span>';
      var head = '<div class="entry-head"><a href="' + esc(d.url) + '">' + highlight(esc(d.title), terms) + '</a>' + tail + '</div>';
      var excText = d.excerpt || '';
      var excLower = excText.toLowerCase();
      var matchInExc = terms.some(function (t) { return t && excLower.indexOf(t) >= 0; });
      var displayExc = matchInExc ? excText : snippet(d.text || '', terms, 160);
      var exc = displayExc ? '<div class="entry-excerpt">' + highlight(esc(displayExc), terms) + '</div>' : '';
      return '<li' + (exc ? ' class="with-excerpt"' : '') + '>' + head + exc + '</li>';
    }).join('');
  }

  var composing = false;
  q.addEventListener('compositionstart', function () { composing = true; });
  q.addEventListener('compositionend',   function () { composing = false; doSearch(); });
  q.addEventListener('input', function () { if (!composing) doSearch(); });

  function doSearch() {
    var val = q.value.trim().toLowerCase();
    var raw = q.value.trim();
    var newUrl = raw ? (location.pathname + '?q=' + encodeURIComponent(raw)) : location.pathname;
    history.replaceState(null, '', newUrl);
    if (!val) { out.innerHTML = ''; hint.textContent = '输入关键词搜索全站'; return; }
    var terms = val.split(/\s+/);
    var scored = docs
      .map(function (d) { return { d: d, s: score(d, terms) }; })
      .filter(function (x) { return x.s > 0; })
      .sort(function (a, b) { return b.s - a.s; });
    var total = scored.length;
    var hits = scored.slice(0, 20).map(function (x) { return x.d; });
    render(hits, total, terms);
  }
})();
</script>
