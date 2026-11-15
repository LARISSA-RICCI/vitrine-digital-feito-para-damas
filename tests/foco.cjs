const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
// Executa o manipulador real da galeria com objetos de foco controlados.
const source = fs.readFileSync(path.join(__dirname, '../js/main.js'), 'utf8');
const start = source.indexOf("document.addEventListener('keydown',");
const end = source.indexOf('\n    });', start) + '\n    });'.length;
assert.ok(start >= 0 && end > start);
const document = { activeElement: null, addEventListener: (_, fn) => document.handler = fn };
const first = { focus: () => document.activeElement = first };
const last = { focus: () => document.activeElement = last };
let closed = false;
const lb = { hidden: false, querySelectorAll: () => [first, last], contains: el => el === first || el === last };
vm.runInNewContext(source.slice(start, end), { document, lb, closeLb: () => closed = true });
function press(key, shiftKey = false) {
  const event = { key, shiftKey, prevented: false, preventDefault() { this.prevented = true; } };
  document.handler(event); return event;
}
document.activeElement = last;
assert.equal(press('Tab').prevented, true); assert.equal(document.activeElement, first);
assert.equal(press('Tab', true).prevented, true); assert.equal(document.activeElement, last);
document.activeElement = {};
press('Tab'); assert.equal(document.activeElement, first);
press('Escape'); assert.equal(closed, true);
lb.hidden = true; closed = false;
press('Escape'); assert.equal(closed, false);
console.log('OK: Tab, Shift+Tab, foco externo, Escape e dialogo fechado.');
