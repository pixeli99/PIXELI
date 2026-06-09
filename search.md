---
layout: default
title: 搜索
permalink: /search/
description: 全文搜索全站论文笔记与随笔。
---

<style>
#q {
  width: 100%;
  padding: 0.55em 0.75em;
  font-family: var(--font-serif);
  font-size: 1.05rem;
  color: var(--text);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 3px;
  margin-bottom: 1.6rem;
  -webkit-appearance: none;
}
#q:focus {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
  border-color: transparent;
}
mark {
  background: rgba(138, 51, 36, 0.14);
  color: inherit;
  border-radius: 2px;
  padding: 0 0.08em;
  font-style: normal;
}
@media (prefers-color-scheme: dark) {
  mark { background: rgba(217, 119, 87, 0.24); }
}
</style>

<label for="q" class="sr-only">搜索</label>
<input type="search" id="q" placeholder="搜论文、笔记…" autocomplete="off" disabled>
<ul id="results" class="entry-list"></ul>
<p id="hint" class="muted" style="font-size:0.9rem;font-family:var(--font-sans)">加载中…</p>

<script>
(function () {
  var q = document.getElementById('q');
  var out = document.getElementById('results');
  var hint = document.getElementById('hint');
  var docs = [];

  fetch('{{ "/search.json" | relative_url }}')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      docs = data;
      q.disabled = false;
      hint.textContent = '输入关键词搜索全站';
      q.focus();
    })
    .catch(function () { hint.textContent = '索引加载失败'; });

  function score(doc, terms) {
    var s = 0;
    var title = doc.title.toLowerCase();
    var text  = (doc.text  || '').toLowerCase();
    var tags  = (doc.tags  || []).join(' ').toLowerCase();
    terms.forEach(function (t) {
      if (title.indexOf(t) >= 0) s += 10;
      if (tags.indexOf(t)  >= 0) s += 3;
      if (text.indexOf(t)  >= 0) s += 1;
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

  function render(results, terms) {
    if (!results.length) {
      out.innerHTML = '';
      hint.textContent = '没有找到匹配内容';
      return;
    }
    hint.textContent = '';
    out.innerHTML = results.map(function (d) {
      var kind = d.collection === 'papers' ? '论文' : '笔记';
      var tail = '<span class="entry-tail"><span class="kind">' + kind + '</span>' +
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
    if (!val) { out.innerHTML = ''; hint.textContent = '输入关键词搜索全站'; return; }
    var terms = val.split(/\s+/);
    var hits = docs
      .map(function (d) { return { d: d, s: score(d, terms) }; })
      .filter(function (x) { return x.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 12)
      .map(function (x) { return x.d; });
    render(hits, terms);
  }
})();
</script>
