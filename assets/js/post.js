document.querySelectorAll('.post-body table').forEach(function(table) {
  var wrap = document.createElement('div');
  wrap.className = 'table-scroll';
  table.parentNode.insertBefore(wrap, table);
  wrap.appendChild(table);
});

function addTableScrollHints() {
  document.querySelectorAll('.post-body .table-scroll').forEach(function(wrap) {
    if (wrap.scrollWidth > wrap.clientWidth + 1) {
      var next = wrap.nextElementSibling;
      if (next && next.classList.contains('scroll-hint')) return;
      var hint = document.createElement('p');
      hint.className = 'scroll-hint';
      hint.textContent = '← 可左右滑动查看完整表格 →';
      wrap.insertAdjacentElement('afterend', hint);
    }
  });
}

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(addTableScrollHints);
} else {
  addTableScrollHints();
}

document.querySelectorAll('.post-body h2[id], .post-body h3[id]').forEach(function(h) {
  var a = document.createElement('a');
  a.href = '#' + h.id;
  a.className = 'heading-anchor';
  a.setAttribute('aria-hidden', 'true');
  a.setAttribute('tabindex', '-1');
  a.textContent = '§';
  h.appendChild(a);
});
document.querySelectorAll('.post-body pre').forEach(function(pre) {
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
