const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const scriptPath = path.join(root, 'js/main.js');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const source = fs.readFileSync(scriptPath, 'utf8');

function startSite(t, options = {}) {
  const dom = new JSDOM(html, {
    url: 'https://example.org/' + (options.hash || ''),
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });
  t.after(() => dom.window.close());
  const { window } = dom;
  const { document } = window;
  const scheduled = [];
  const observers = [];
  const scrolls = [];
  const intervals = [];
  window.matchMedia = () => ({ matches: Boolean(options.reduceMotion) });
  window.requestAnimationFrame = callback => { callback(); return 1; };
  window.setTimeout = callback => { scheduled.push(callback); return scheduled.length; };
  window.setInterval = callback => { intervals.push(callback); return intervals.length; };
  window.Element.prototype.scrollIntoView = function (settings) {
    scrolls.push({ id: this.id, settings });
  };
  window.Date = class extends window.Date {
    constructor(...args) { super(...(args.length ? args : [options.now || '2026-11-17T15:00:00Z'])); }
  };
  if (options.observers) {
    window.IntersectionObserver = class {
      constructor(callback) { this.callback = callback; this.elements = []; observers.push(this); }
      observe(element) { this.elements.push(element); }
      unobserve(element) { this.elements = this.elements.filter(item => item !== element); }
    };
  }
  if (options.clipboard) {
    Object.defineProperty(window.navigator, 'clipboard', { value: options.clipboard });
  }
  if (options.execCommand) document.execCommand = options.execCommand;
  if (options.configure) options.configure(window);
  vm.runInContext(source, dom.getInternalVMContext(), { filename: scriptPath });
  return { window, document, scheduled, observers, scrolls, intervals };
}

test('renderiza as quatro categorias e os 24 servicos com consultas individuais', t => {
  const { document } = startSite(t);
  assert.equal(document.querySelectorAll('#service-list details').length, 4);
  assert.equal(document.querySelectorAll('.service-item').length, 24);
  assert.match(document.querySelector('#maos small').textContent, /^8 cuidados/);
  const links = [...document.querySelectorAll('.service-link')];
  assert.equal(links.length, 24);
  for (const link of links) {
    const url = new URL(link.href);
    assert.equal(url.hostname, 'wa.me');
    assert.equal(url.pathname, '/5517992849596');
    assert.match(url.searchParams.get('text'), /gostaria de saber mais sobre/);
    assert.equal(link.rel, 'noopener noreferrer');
  }
  assert.ok(document.querySelector('.category-note'));
  assert.ok(document.querySelector('.scrollreveal.visible'));
});

test('divulga perfumes arabes e direciona a consulta ao WhatsApp oficial', t => {
  const { document } = startSite(t);
  const card = document.getElementById('perfumaria');
  assert.equal(card.getAttribute('aria-labelledby'), 'perfumes-title');
  assert.equal(card.querySelector('h3').textContent, 'Perfumes árabes');
  assert.match(card.querySelector('p').textContent, /solicite o catálogo/);
  const link = card.querySelector('a');
  const url = new URL(link.href);
  assert.equal(url.hostname, 'wa.me');
  assert.equal(url.pathname, '/5517992849596');
  assert.equal(url.searchParams.get('text'), 'Olá! Vim pela Vitrine Digital e gostaria de consultar o catálogo e a disponibilidade dos perfumes árabes.');
  assert.equal(link.target, '_blank');
  assert.equal(link.rel, 'noopener noreferrer');
});

test('abre categoria pelo hash e fecha as outras ao expandir uma categoria', t => {
  const { window, document, scrolls } = startSite(t, { hash: '#facial', reduceMotion: true });
  assert.equal(document.getElementById('facial').open, true);
  const hands = document.getElementById('maos');
  hands.getBoundingClientRect = () => ({ top: 900 });
  hands.open = true;
  hands.dispatchEvent(new window.Event('toggle'));
  assert.equal(document.getElementById('facial').open, false);
  assert.equal(scrolls.at(-1).settings.behavior, 'auto');
  hands.open = false;
  hands.dispatchEvent(new window.Event('toggle'));
  window.location.hash = '#cabelos';
  window.dispatchEvent(new window.Event('hashchange'));
  assert.equal(document.getElementById('cabelos').open, true);
});

test('mostra abertura e proximo atendimento no horario de Brasilia', t => {
  const cases = [
    ['2026-11-17T15:00:00Z', 'Aberto agora · até 19h', false],
    ['2026-11-17T11:00:00Z', 'Fechado · abrimos hoje às 9h', true],
    ['2026-11-20T23:00:00Z', 'Fechado · abrimos amanhã às 9h', true],
    ['2026-11-21T21:00:00Z', 'Fechado · abrimos terça-feira às 9h', true],
  ];
  for (const [now, expected, closed] of cases) {
    const { document, intervals, window } = startSite(t, { now });
    assert.equal(document.getElementById('open-status-text').textContent, expected);
    assert.equal(document.getElementById('open-status').classList.contains('closed'), closed);
    assert.equal(document.getElementById('open-status').hidden, false);
    intervals[0]();
    document.dispatchEvent(new window.Event('visibilitychange'));
  }
});

test('mantem a pagina utilizavel quando o status nao pode ser calculado', t => {
  const { document } = startSite(t, {
    configure(window) {
      window.Intl.DateTimeFormat = function () { throw new Error('Fuso indisponivel'); };
    },
  });
  assert.equal(document.querySelectorAll('.service-item').length, 24);
});

test('abre fotos, prende o foco na galeria e devolve o foco ao fechar', t => {
  const { document, window, scheduled, scrolls } = startSite(t);
  const modal = document.getElementById('lightbox');
  const close = modal.querySelector('.lb-close');
  const go = document.getElementById('lb-go');
  const buttons = [...document.querySelectorAll('.photo-link[data-title]')];
  const key = (value, shiftKey = false) => {
    const event = new window.KeyboardEvent('keydown', { key: value, shiftKey, cancelable: true });
    document.dispatchEvent(event);
    return event;
  };
  for (const button of buttons) {
    button.click();
    assert.equal(modal.hidden, false);
    assert.equal(modal.querySelector('img').src, button.querySelector('img').src);
    assert.equal(modal.querySelector('.lb-title').textContent, button.dataset.title);
    assert.equal(document.activeElement, close);
    go.focus();
    assert.equal(key('Tab').defaultPrevented, true);
    assert.equal(document.activeElement, close);
    key('Tab', true);
    assert.equal(document.activeElement, go);
    button.focus();
    key('Tab');
    assert.equal(document.activeElement, close);
    key('Enter');
    key('Tab');
    key('Escape');
    assert.equal(modal.hidden, true);
    assert.equal(document.activeElement, button);
    key('Escape');
    button.click();
    go.click();
    while (scheduled.length) scheduled.shift()();
    assert.equal(scrolls.at(-1).id, button.dataset.go);
    assert.equal(scrolls.at(-1).settings.behavior, 'smooth');
  }
  buttons[0].click();
  close.click();
  assert.equal(modal.hidden, true);
  buttons[0].click();
  modal.click();
  assert.equal(modal.hidden, true);
  assert.equal(document.body.style.overflow, '');
});

test('copia o endereco e informa sucesso para a cliente', async t => {
  let copied;
  const { document, scheduled } = startSite(t, {
    clipboard: { writeText: async text => { copied = text; } },
  });
  document.getElementById('copy-address').click();
  await new Promise(setImmediate);
  assert.match(copied, /Rua Lucas Evangelista, 920/);
  assert.equal(document.getElementById('copy-label').textContent, 'Endereço copiado ✓');
  assert.equal(document.getElementById('copy-live').textContent, 'Endereço copiado');
  scheduled.shift()();
  assert.equal(document.getElementById('copy-label').textContent, 'Copiar endereço');
});

test('usa copia alternativa ou orienta copia manual quando a API falha', async t => {
  for (const succeeds of [true, false]) {
    const { document } = startSite(t, {
      clipboard: { writeText: async () => { throw new Error('Permissao negada'); } },
      execCommand: () => {
        if (!succeeds) throw new Error('Copia indisponivel');
        return true;
      },
    });
    document.getElementById('copy-address').click();
    await new Promise(setImmediate);
    assert.equal(document.getElementById('copy-label').textContent,
      succeeds ? 'Endereço copiado ✓' : 'Copie manualmente');
    assert.equal(document.querySelector('textarea'), null);
  }
});

test('observadores revelam conteudo e controlam o botao flutuante', t => {
  const { observers, document, window } = startSite(t, { observers: true });
  const first = observers[0].elements[0];
  observers[0].callback([{ target: first, isIntersecting: false }]);
  observers[0].callback([{ target: first, isIntersecting: true }]);
  assert.equal(first.classList.contains('visible'), true);
  assert.equal(observers[0].elements.includes(first), false);
  observers[1].callback([{ isIntersecting: true }]);
  assert.equal(document.body.classList.contains('cta-visible'), true);
  observers[1].callback([{ isIntersecting: false }]);
  assert.equal(document.body.classList.contains('cta-visible'), false);
  Object.defineProperty(window, 'scrollY', { value: 400 });
  document.getElementById('localizacao').getBoundingClientRect = () => ({ top: 10 });
  window.dispatchEvent(new window.Event('scroll'));
  assert.equal(document.body.classList.contains('scrolled'), true);
  assert.equal(document.querySelector('[data-section="localizacao"]').getAttribute('aria-current'), 'location');
});
