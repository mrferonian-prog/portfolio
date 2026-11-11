(function () {
  const { P, esc, reveal, url, project, param, next, fill } = window.SITE;
  const AR = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M1 11 11 1M3 1h8v8"/></svg>';
  const pad = n => String(n).padStart(2, '0');

  // фон: свечения без вертикальных линий
  const atmo = document.createElement('div'); atmo.className = 'atmo'; atmo.setAttribute('aria-hidden', 'true');
  document.body.prepend(atmo);
  const top = document.querySelector('.top'); const sc = () => top.classList.toggle('solid', scrollY > 30); addEventListener('scroll', sc, { passive: true }); sc();
  requestAnimationFrame(() => document.documentElement.classList.add('loaded'));

  fill('#contacts', P.contacts.map((c, i) => `<a href="${c.href}" data-r style="--d:${i * .08}s" ${c.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}><span class="small">${esc(c.label)}</span><b>${esc(c.value)}</b></a>`).join(''));
  // плавающая кнопка «Наверх»: видна ниже первого экрана
  const up = document.createElement('a'); up.className = 'pill totop'; up.href = '#top'; up.innerHTML = 'Наверх <span aria-hidden="true">↑</span>';
  up.addEventListener('click', e => { e.preventDefault(); scrollTo({ top: 0, behavior: SITE.reduce ? 'auto' : 'smooth' }); });
  document.body.appendChild(up);
  const upChk = () => up.classList.toggle('show', scrollY > innerHeight * 0.85); addEventListener('scroll', upChk, { passive: true }); addEventListener('resize', upChk); upChk();

  const work = (p, i, big) => `<a class="work" href="${url(p)}" data-r style="--d:${(i % 3) * .1}s"><div class="cut"><img ${SITE.imgAttrs(p.card || p.images[0], big ? '(max-width:1000px) 92vw, 62vw' : '(max-width:700px) 92vw, 46vw')} alt="${esc(p.title)}" loading="lazy" decoding="async" width="1600" height="1200"></div>
    <div class="tx"><div class="row"><h3>${esc(p.title)}</h3><span class="small">${p.year}</span></div><span class="tag">${esc(p.type)}</span><p>${esc(p.short)}</p></div></a>`;
  const page = document.body.dataset.page;
  if (page === 'home') {
    fill('#hello', esc(P.hello));
    fill('#works', P.projects.slice(0, 4).map((p, i) => work(p, i, i === 0)).join(''));
    fill('#exp', P.experience.map((e, i) => `<div class="xrow" data-r style="--d:${i * .08}s"><div class="when"><span class="yr">${esc(e.big || e.years.split(' — ')[0])}</span><span class="small">${esc(e.years)}</span></div><h3>${esc(e.place)}</h3><div class="role"><span class="tag wrap">${esc(e.role)}</span></div><p>${esc(e.text)}</p></div>`).join(''));
    fill('#skills', P.skills.map((s, i) => `<div class="skill cut${i === 0 ? ' wide' : ''}" data-r style="--d:${i * .1}s"><h3 class="small">${esc(s.group)}</h3><ul class="slist"${i === 0 ? ` style="--rows:${Math.ceil(s.items.length / 2)}"` : ''}>${s.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join(''));
  }
  if (page === 'projects') {
    const types = ['Все', ...new Set(P.projects.map(p => p.type))];
    const grid = document.getElementById('all');
    const draw = t => { const l = P.projects.filter(p => t === 'Все' || p.type === t); grid.innerHTML = l.length ? l.map((p, i) => work(p, i, true)).join('') : '<p class="small">Здесь пока пусто.</p>'; reveal(grid); };
    fill('#filters', types.map((t, i) => `<button class="tag" type="button" aria-pressed="${i === 0}">${esc(t)}</button>`).join(''));
    document.getElementById('filters').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; document.querySelectorAll('#filters button').forEach(x => x.setAttribute('aria-pressed', x === b)); draw(b.textContent); });
    draw('Все');
  }
  if (page === 'project') {
    const p = project(param('p')) || P.projects[0], n = next(p), k = P.projects.indexOf(p);
    document.title = `${p.title} — ${P.name}`;
    fill('#project', `<section class="p-hero"><div class="bgimg tone"><img ${SITE.imgAttrs(p.images[0], '100vw', 1920)} alt="${esc(p.title)}" fetchpriority="high" width="1600" height="1200"></div>
      <div class="in"><h1 class="sr-only">${esc(p.title)}</h1><div class="p-body"><p class="lead">${esc(p.short)}</p><div>${p.text.map(t => `<p>${esc(t)}</p>`).join('')}</div></div>
      <div class="figs p-figs">${p.facts.map(f => `<div><b>${esc(f[1])}</b><span class="small">${esc(f[0])}</span></div>`).join('')}</div></div></section>
      <section><div class="head"><h2 class="h">Галерея <em>проекта</em></h2><span class="small">${p.images.length} изображений</span></div>
      <div class="gal">${p.images.map((s, j) => `<button class="cut" type="button" data-i="${j}" data-r aria-label="Открыть изображение ${j + 1}"><img ${SITE.imgAttrs(s, '(max-width:900px) 92vw, 60vw')} alt="${esc(p.title)}, изображение ${j + 1}" loading="lazy" decoding="async" width="1600" height="1200"></button>`).join('')}</div>
      <a class="next" href="${url(n)}" data-r><span><span class="small">Следующий проект</span><b>${esc(n.title)}</b></span><span class="btn" style="padding:0 10px"><span>${AR}</span></span></a></section>
      <div class="lb" role="dialog" aria-modal="true" aria-label="Просмотр изображений"><div class="lbimg"><img alt=""></div><div class="lb-bar"><button class="pill" type="button" data-d="-1">Назад</button><button class="pill" type="button" data-d="1">Далее</button><button class="pill" type="button" data-close>Закрыть</button></div></div>`);
    const lb = document.querySelector('.lb'), im = lb.querySelector('img'); let cur = 0, op;
    const show = j => { cur = (j + p.images.length) % p.images.length; im.src = SITE.isrc(p.images[cur], 2560); im.alt = `${p.title}, изображение ${cur + 1}`; };
    const close = () => { lb.classList.remove('open'); op && op.focus(); };
    document.querySelector('.gal').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; op = b; show(+b.dataset.i); lb.classList.add('open'); lb.querySelector('[data-close]').focus(); });
    lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('[data-close]')) close(); const d = e.target.closest('[data-d]'); if (d) show(cur + +d.dataset.d); });
    addEventListener('keydown', e => { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(cur + 1); if (e.key === 'ArrowLeft') show(cur - 1); });
  }
  reveal();
  SITE.typo(document.body); setTimeout(() => SITE.typo(document.body), 600);
})();
