/* Общие помощники: чтение контента из data.js, появление блоков при прокрутке. */
(function () {
  document.documentElement.classList.add('js');
  const P = window.PORTFOLIO;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function reveal(root = document) {
    const els = root.querySelectorAll('[data-r]:not(.in)');
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach(e => io.observe(e));
  }
  // типографика: короткие слова (до 3 букв) и числа не остаются в конце строки
  function typo(root) {
    const skip = /^(SCRIPT|STYLE|TEXTAREA|INPUT|CODE|PRE)$/;
    const w = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT, { acceptNode: n => (!n.parentElement || skip.test(n.parentElement.tagName) || n.parentElement.closest('#tune-root,[contenteditable]')) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const re = /(^|[\s\u00a0(«„"—–-])([A-Za-zА-Яа-яЁё]{1,3}|\d+[.,]?\d*|[№§])[ ]+(?=\S)/g;
    let n; while ((n = w.nextNode())) {
      let t = n.nodeValue, o = t;
      if (!/\S/.test(t)) continue;
      for (let k = 0; k < 2; k++) t = t.replace(re, '$1$2\u00a0');
      t = t.replace(/ (—|–)/g, '\u00a0$1');
      t = t.replace(/ ([·•|])/g, '\u00a0$1').replace(/(\d)-(?=[A-Za-zА-Яа-яЁё])/g, '$1-\u2060');
      if (t !== o) n.nodeValue = t;
    }
  }
  // адаптивные изображения: img/x.jpg -> img/x-<ширина>.webp
  const IW = window.IMGW || {};
  const vbase = p => p.replace(/\.jpg$/, '');
  const srcset = p => (IW[p] || []).map(w => `${vbase(p)}-${w}.webp ${w}w`).join(', ');
  const isrc = (p, want) => { const ws = IW[p]; if (!ws) return p; const w = ws.find(x => x >= want) || ws[ws.length - 1]; return `${vbase(p)}-${w}.webp`; };
  const imgAttrs = (p, sizes, want) => `src="${isrc(p, want || 1280)}" srcset="${srcset(p)}" sizes="${sizes}"`;
  window.SITE = {
    typo, srcset, isrc, imgAttrs,
    P, esc, reduce, reveal,
    project: slug => P.projects.find(p => p.slug === slug),
    param: n => new URLSearchParams(location.search).get(n),
    url: p => `project.html?p=${encodeURIComponent(p.slug)}`,
    next: p => P.projects[(P.projects.indexOf(p) + 1) % P.projects.length],
    fill: (sel, html) => { const el = document.querySelector(sel); if (el) el.innerHTML = html; return el; },
    year: new Date().getFullYear()
  };
})();
