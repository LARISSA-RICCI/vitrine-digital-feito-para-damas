(function () {
  'use strict';
  const WA = '5517992849596';
  const groups = [
    { id:'massagens', title:'Massagens & bem-estar', hint:'6 cuidados · relaxar e renovar', icon:'i-leaf', items:[
      ['Massagem relaxante','Movimentos suaves e ritmados que favorecem o relaxamento e ajudam a aliviar a sensação de tensão muscular e as tensões do dia a dia.'],
      ['Massagem com pedras quentes','Associa manobras de massagem ao calor confortável das pedras, proporcionando uma experiência acolhedora.'],
      ['Drenagem linfática','Manobras leves e ritmadas que podem auxiliar em situações específicas de inchaço, conforme avaliação.'],
      ['Massagem modeladora','Manobras mais intensas com finalidade estética; não equivalem à redução de gordura corporal.'],
      ['Liberação miofascial','Pressão e mobilização de tecidos para reduzir sensações de rigidez e dor, favorecendo a mobilidade.'],
      ['Massagem para tensões craniomandibulares','Cuidado voltado a desconfortos musculares da face e mandíbula, sujeito à avaliação de profissional habilitado.']
    ] },
    { id:'facial', title:'Estética facial', hint:'4 cuidados · a sua beleza natural', icon:'i-face', items:[
      ['Limpeza de pele','Remoção de impurezas para uma sensação de pele limpa, renovada e bem cuidada.'],
      ['Cuidados para manchas e melasma','Protocolos cosméticos individualizados, considerando as características e necessidades da pele.'],
      ['Cuidados antienvelhecimento','Procedimentos estéticos voltados à hidratação, à aparência e ao cuidado facial.'],
      ['Dermaplaning','Esfoliação superficial feita com técnica específica para suavizar a textura e o aspecto da pele.']
    ], note:'Equipamentos ou técnicas específicas requerem avaliação e profissional habilitado.' },
    { id:'maos', title:'Mãos, pés & beleza', hint:'5 cuidados · detalhes especiais', icon:'i-flower', items:[
      ['Manicure','Cuidado e embelezamento das unhas das mãos, com acabamento delicado.'],
      ['Pedicure','Cuidado estético dos pés e das unhas, unindo conforto e acabamento bem-feito.'],
      ['Spa dos pés','Ritual com higienização, esfoliação e hidratação, conforme o serviço contratado.'],
      ['Esmaltação em gel','Esmaltação com acabamento brilhante e duração prolongada, para unhas sempre bem cuidadas.'],
      ['Banho de gel','Camada de gel que protege e reforça as unhas naturais, com acabamento uniforme.'],
      ['Alongamento de unhas','Extensão das unhas no formato e comprimento de sua preferência, conforme avaliação.'],
      ['Podologia','Cuidados específicos para os pés, mediante avaliação e disponibilidade de profissional habilitado.'],
      ['Cuidados com sobrancelhas','Valorização e manutenção da aparência das sobrancelhas, conforme técnica disponível.']
    ] },
    { id:'cabelos', title:'Beleza capilar', hint:'6 cuidados · valorize seus fios', icon:'i-hair', items:[
      ['Tintura e coloração','Mudança, cobertura ou realce da cor, após análise das condições dos fios.'],
      ['Alisamento','Alteração do alinhamento e da textura capilar, sujeita a avaliação e testes quando indicados.'],
      ['Definição de cachos','Finalização e técnicas de cuidado que valorizam a forma natural dos cachos.'],
      ['Corte de cabelo','Cortes adaptados ao seu estilo, preferência e características dos fios.'],
      ['Tratamentos capilares','Cuidados voltados à maciez, à hidratação e à aparência saudável dos cabelos.'],
      ['Botox capilar','Tratamento cosmético de disciplina e alinhamento dos fios, conforme produto e técnica utilizados.']
    ] }
  ];
  function svg(symbol, small) {
    const ns = 'http://www.w3.org/2000/svg';
    const s = document.createElementNS(ns, 'svg');
    s.setAttribute('class', 'ico' + (small ? ' sm' : ''));
    s.setAttribute('aria-hidden','true');
    const u = document.createElementNS(ns, 'use');
    u.setAttribute('href','#'+symbol);
    s.appendChild(u);
    return s;
  }
  function waFor(service) {
    return 'https://wa.me/'+WA+'?text='+encodeURIComponent('Olá! Conheci o catálogo do Feito para Damas e gostaria de saber mais sobre '+service+'.');
  }
  const root = document.getElementById('service-list');
  groups.forEach((group, index) => {
    const d = document.createElement('details');
    d.className = 'service-group scrollreveal';
    d.id = group.id;
    const sum = document.createElement('summary');
    sum.appendChild(Object.assign(document.createElement('span'),{className:'category-icon'}));
    sum.firstChild.appendChild(svg(group.icon));
    const title = Object.assign(document.createElement('span'),{className:'category-title'});
    const strong = document.createElement('strong'); strong.textContent = group.title;
    const hint = document.createElement('small'); hint.textContent = group.hint.replace(/^\d+/, group.items.length);
    title.append(strong,hint); sum.appendChild(title);
    const chev = Object.assign(document.createElement('span'),{className:'chev'});chev.appendChild(svg('i-chevron',true));sum.appendChild(chev);
    d.appendChild(sum);
    const body = Object.assign(document.createElement('div'),{className:'group-body'});
    group.items.forEach(([name,desc]) => {
      const item = Object.assign(document.createElement('div'),{className:'service-item'});
      const heading = Object.assign(document.createElement('div'),{className:'service-name'});
      const star = Object.assign(document.createElement('span'),{className:'spark'});star.textContent='✦';
      heading.appendChild(star);heading.appendChild(document.createTextNode(name));
      const p = Object.assign(document.createElement('p'),{className:'service-desc'});p.textContent=desc;
      const a = Object.assign(document.createElement('a'),{className:'service-link'});
      a.href=waFor(name);a.target='_blank';a.rel='noopener noreferrer';
      a.textContent='Consultar esse serviço ';a.appendChild(svg('i-open',true));
      item.append(heading,p,a);body.appendChild(item);
    });
    if (group.note) { const note = Object.assign(document.createElement('p'),{className:'category-note'});note.textContent=group.note;body.appendChild(note); }
    d.appendChild(body);root.appendChild(d);
  });
  // Cards surgem suavemente ao entrar na tela; conteúdo permanece visível em navegadores antigos.
  const revealables = Array.from(document.querySelectorAll('.scrollreveal'));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => { entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);} }); },{threshold:.08,rootMargin:'0px 0px 35px 0px'});
    revealables.forEach(el=>observer.observe(el));
  } else { revealables.forEach(el=>el.classList.add('visible')); }

  // ===== Melhorias de experiência =====
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Acordeão: abre uma categoria por vez e leva a categoria para a posição certa na tela
  const groupEls = Array.from(root.querySelectorAll('details'));
  groupEls.forEach(d => d.addEventListener('toggle', () => {
    if (!d.open) return;
    groupEls.forEach(o => { if (o !== d) o.open = false; });
    requestAnimationFrame(() => {
      const r = d.getBoundingClientRect();
      if (r.top < 8 || r.top > window.innerHeight * .55) d.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }));
  // Link direto para uma categoria (ex.: #facial abre Estética facial)
  function openFromHash() {
    const t = location.hash && document.getElementById(location.hash.slice(1));
    if (t && t.tagName === 'DETAILS') t.open = true;
  }
  openFromHash(); window.addEventListener('hashchange', openFromHash);

  // "Aberto agora" calculado pelo horário de Brasília
  const SCHEDULE = { 2:[9,19], 3:[9,19], 4:[9,19], 5:[9,19], 6:[9,17] }; // terça a sábado
  const DAYNAMES = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
  function renderStatus() {
    const box = document.getElementById('open-status'), txt = document.getElementById('open-status-text');
    if (!box || !txt) return;
    let parts;
    try { parts = new Intl.DateTimeFormat('en-US', { timeZone:'America/Sao_Paulo', weekday:'short', hour:'numeric', minute:'numeric', hour12:false }).formatToParts(new Date()); } catch (e) { return; }
    const get = t => (parts.find(x => x.type === t) || {}).value;
    const day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(get('weekday'));
    const now = (parseInt(get('hour'),10) % 24) + parseInt(get('minute'),10) / 60;
    if (day < 0) return;
    const today = SCHEDULE[day];
    let open = false, msg;
    if (today && now >= today[0] && now < today[1]) { open = true; msg = 'Aberto agora · até ' + today[1] + 'h'; }
    else if (today && now < today[0]) { msg = 'Fechado · abrimos hoje às ' + today[0] + 'h'; }
    else {
      for (let i = 1; i <= 7; i++) {
        const d = (day + i) % 7;
        if (SCHEDULE[d]) { msg = 'Fechado · abrimos ' + (i === 1 ? 'amanhã' : DAYNAMES[d]) + ' às ' + SCHEDULE[d][0] + 'h'; break; }
      }
    }
    txt.textContent = msg; box.classList.toggle('closed', !open); box.hidden = false;
  }
  renderStatus(); setInterval(renderStatus, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) renderStatus(); });

  // Copiar endereço
  const copyBtn = document.getElementById('copy-address');
  if (copyBtn) copyBtn.addEventListener('click', async () => {
    const address = 'Rua Lucas Evangelista, 920, Centro, Bebedouro – SP';
    let ok = false;
    try { await navigator.clipboard.writeText(address); ok = true; }
    catch (e) {
      const ta = document.createElement('textarea'); ta.value = address; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand('copy'); } catch (e2) {}
      ta.remove();
    }
    const label = document.getElementById('copy-label'), live = document.getElementById('copy-live');
    label.textContent = ok ? 'Endereço copiado ✓' : 'Copie manualmente';
    if (live) live.textContent = ok ? 'Endereço copiado' : '';
    setTimeout(() => { label.textContent = 'Copiar endereço'; }, 2200);
  });

  // Botão flutuante "Agendar agora" só aparece quando o botão principal saiu da tela
  const mainCta = document.querySelector('.main-cta');
  if (mainCta && 'IntersectionObserver' in window) {
    new IntersectionObserver(es => es.forEach(e => document.body.classList.toggle('cta-visible', e.isIntersecting))).observe(mainCta);
  }
  // Galeria: toque abre a foto ampliada, com atalho para o serviço
  function goTo(id) {
    const t = document.getElementById(id); if (!t) return;
    if (t.tagName === 'DETAILS') t.open = true;
    requestAnimationFrame(() => {
      t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: id === 'spa-pes' ? 'center' : 'start' });
      if (id === 'spa-pes') { t.classList.remove('flash'); void t.offsetWidth; t.classList.add('flash'); setTimeout(() => t.classList.remove('flash'), 2600); }
    });
  }
  const lb = document.getElementById('lightbox');
  if (lb) {
    const lbImg = lb.querySelector('img'), lbTitle = lb.querySelector('.lb-title'), lbSub = lb.querySelector('.lb-sub'), lbGo = document.getElementById('lb-go'), lbClose = lb.querySelector('.lb-close');
    let lbTarget = '', lastFocus = null;
    const closeLb = () => { lb.hidden = true; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus({ preventScroll: true }); };
    document.querySelectorAll('.photo-link[data-title]').forEach(btn => btn.addEventListener('click', () => {
      const img = btn.querySelector('img'); if (!img) return;
      lastFocus = btn; lbImg.src = img.src; lbImg.alt = img.alt;
      lbTitle.textContent = btn.dataset.title; lbSub.textContent = btn.dataset.sub;
      lbTarget = btn.dataset.go; lbGo.textContent = btn.dataset.cta + ' →';
      lb.hidden = false; document.body.style.overflow = 'hidden'; lbClose.focus({ preventScroll: true });
    }));
    lbClose.addEventListener('click', closeLb);
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); closeLb(); return; }
      if (e.key !== 'Tab') return;
      const focusable = Array.from(lb.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]'));
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (!lb.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    lbGo.addEventListener('click', e => { e.preventDefault(); const id = lbTarget; closeLb(); setTimeout(() => goTo(id), 60); });
  }
  const navAnchors=Array.from(document.querySelectorAll('[data-section]'));
  const sections=['inicio','servicos','localizacao'];
  let raf=false;
  function update() {
    const y = window.scrollY || document.documentElement.scrollTop;
    document.body.classList.toggle('scrolled',y>290);
    let current='inicio';
    for (const id of sections){const el=document.getElementById(id);if(el && el.getBoundingClientRect().top < window.innerHeight*.37)current=id;}
    navAnchors.forEach(a=>{const active=a.dataset.section===current;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
    raf=false;
  }
  window.addEventListener('scroll',()=>{if(!raf){window.requestAnimationFrame(update);raf=true;}},{passive:true});update();
})();
