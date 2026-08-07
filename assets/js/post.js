document.querySelectorAll('.post-body table').forEach(function(table) {
  var wrap = document.createElement('div');
  wrap.className = 'table-scroll';
  table.parentNode.insertBefore(wrap, table);
  wrap.appendChild(table);
});

function addTableScrollHints() {
  document.querySelectorAll('.post-body .table-scroll').forEach(function(wrap) {
    var overflowing = wrap.scrollWidth > wrap.clientWidth + 1;
    var next = wrap.nextElementSibling;
    var hintEl = (next && next.classList.contains('scroll-hint')) ? next : null;
    if (overflowing && !hintEl) {
      var hint = document.createElement('p');
      hint.className = 'scroll-hint';
      hint.setAttribute('aria-hidden', 'true');
      hint.textContent = '← 可左右滑动查看完整表格 →';
      wrap.insertAdjacentElement('afterend', hint);
    } else if (!overflowing && hintEl) {
      hintEl.remove();
    }
    // keyboard-accessible scroll: tabindex only when content actually overflows
    if (overflowing) {
      wrap.setAttribute('tabindex', '0');
    } else {
      wrap.removeAttribute('tabindex');
    }
  });
}

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(addTableScrollHints);
} else {
  addTableScrollHints();
}

// recheck overflow on viewport resize so hint/tabindex stay in sync
var _rstTimer;
window.addEventListener('resize', function() {
  clearTimeout(_rstTimer);
  _rstTimer = setTimeout(addTableScrollHints, 200);
}, { passive: true });

document.querySelectorAll('.post-body h2[id], .post-body h3[id]').forEach(function(h) {
  var heading = h.textContent.trim();
  var a = document.createElement('a');
  a.href = '#' + h.id;
  a.className = 'heading-anchor';
  a.setAttribute('aria-label', '链接至：' + heading);
  a.innerHTML = '<span aria-hidden="true">§</span>';
  h.appendChild(a);
  if (navigator.clipboard) {
    a.addEventListener('click', function() {
      var url = location.origin + location.pathname + '#' + h.id;
      navigator.clipboard.writeText(url).then(function() {
        var sp = a.querySelector('[aria-hidden="true"]');
        sp.textContent = '✓';
        a.setAttribute('aria-label', '已复制链接');
        setTimeout(function() {
          sp.textContent = '§';
          a.setAttribute('aria-label', '链接至：' + heading);
        }, 1200);
      }).catch(function() {});
    });
  }
});
document.querySelectorAll('.post-body pre').forEach(function(pre) {
  var langEl = pre.closest('[class*="language-"]');
  if (langEl) {
    var m = langEl.className.match(/\blanguage-(\S+)\b/);
    if (m && m[1] !== 'plaintext') pre.setAttribute('data-lang', m[1]);
  }
  if (!navigator.clipboard) return;
  var btn = document.createElement('button');
  btn.className = 'copy-btn';
  btn.setAttribute('aria-label', '复制代码');
  btn.textContent = '复制';
  pre.appendChild(btn);
  btn.addEventListener('click', function() {
    var code = pre.querySelector('code');
    var text = (code ? code : pre).innerText;
    navigator.clipboard.writeText(text).then(function() {
      btn.textContent = '已复制';
      btn.setAttribute('aria-label', '已复制');
      setTimeout(function() {
        btn.textContent = '复制';
        btn.setAttribute('aria-label', '复制代码');
      }, 2000);
    }).catch(function() {
      btn.textContent = '失败';
      btn.setAttribute('aria-label', '复制失败');
      setTimeout(function() {
        btn.textContent = '复制';
        btn.setAttribute('aria-label', '复制代码');
      }, 1500);
    });
  });
});

// [ / ] keyboard shortcuts: navigate to prev / next post in the same collection
(function() {
  var prevA = document.querySelector('.post-nav-prev a');
  var nextA = document.querySelector('.post-nav-next a');
  if (!prevA && !nextA) return;
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
    var t = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (t === 'input' || t === 'textarea' || document.activeElement.isContentEditable) return;
    if (e.key === '[' && prevA) { e.preventDefault(); location.href = prevA.href; }
    if (e.key === ']' && nextA) { e.preventDefault(); location.href = nextA.href; }
  });
})();

// Collapse the BibTeX citation block into a <details> disclosure widget
document.querySelectorAll('.post-body h2').forEach(function(h) {
  if (h.textContent.replace(/§/g, '').trim() !== '引用') return;
  var next = h.nextElementSibling;
  if (!next || !next.classList.contains('language-bibtex')) return;
  var details = document.createElement('details');
  details.className = 'bibtex-details';
  var summary = document.createElement('summary');
  summary.textContent = 'BibTeX';
  details.appendChild(summary);
  next.parentNode.insertBefore(details, next);
  details.appendChild(next);
});

// If URL hash targets the 引用 heading, auto-open its BibTeX details widget
(function() {
  if (!location.hash) return;
  var el = document.getElementById(location.hash.slice(1));
  if (!el) return;
  var next = el.nextElementSibling;
  if (next && next.classList.contains('bibtex-details')) next.open = true;
})();

// Chrome does not expand closed <details> when printing; expand them all before
// printing and restore their state afterward so the BibTeX citation appears in print.
(function() {
  window.addEventListener('beforeprint', function() {
    document.querySelectorAll('details').forEach(function(d) {
      d._printWasOpen = d.open;
      d.open = true;
    });
  });
  window.addEventListener('afterprint', function() {
    document.querySelectorAll('details').forEach(function(d) {
      d.open = d._printWasOpen;
    });
  });
})();
