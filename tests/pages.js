// Checks every page's Discord component embed and favicon tags, and the root icon files.
// Run with: node tests/pages.js
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const check = (name, ok) => { ok ? pass++ : fail++; console.log((ok ? 'ok   - ' : 'FAIL - ') + name); };

const pages = ['index.html', '404.html', 'about.html', 'changelog.html', 'legal.html']
    .concat(fs.readdirSync(path.join(ROOT, 'legal')).filter(f => f.endsWith('.html')).map(f => 'legal/' + f));
const ALLOWED = new Set([1, 2, 9, 10, 11, 12, 14, 17]);
const BUTTON_KEYS = new Set(['id', 'type', 'url', 'style', 'label', 'emoji', 'disabled']);

function walk(c, st) {
    st.count++;
    check_type(c, st);
    (c.components || []).forEach(x => { if (x.type === 17) st.nested = true; walk(x, st); });
    if (c.accessory) walk(c.accessory, st);
}
function check_type(c, st) {
    if (!ALLOWED.has(c.type)) st.badType = true;
    if (c.type === 2) {
        if (c.style !== 5 || !/^https?:\/\//.test(c.url || '') || Object.keys(c).some(k => !BUTTON_KEYS.has(k))) st.badButton = true;
    }
    if (typeof c.content === 'string' && /\$1/.test(c.content)) st.dollar = true;
}

for (const p of pages) {
    const html = fs.readFileSync(path.join(ROOT, p), 'utf8');
    const head = html.slice(html.indexOf('<head'), html.indexOf('</head>'));
    check(p + ': favicon tags', ['href="/favicon.ico" sizes="48x48"', 'sizes="512x512"', 'rel="apple-touch-icon" href="/apple-touch-icon.png"', 'rel="manifest" href="/site.webmanifest"'].every(t => head.includes(t)));
    const m = head.match(/<script id="discord:component-embed" type="application\/json">(.*?)<\/script>/s);
    if (p === '404.html') { check(p + ': no Discord embed', !m); continue; }
    if (!m) { check(p + ': Discord embed present (or left out as a comment when too big)', /discord:component-embed left out/.test(head)); continue; }
    check(p + ': under 3,000 bytes', Buffer.byteLength(m[1]) <= 3000);
    let j = null;
    try { j = JSON.parse(m[1]); } catch (e) { /* reported below */ }
    check(p + ': valid JSON', !!j);
    if (!j) continue;
    const root = j.component;
    const st = { count: 0, nested: false, badType: false, badButton: false, dollar: false };
    walk(root, st);
    check(p + ': one root Container (17), no nested Containers', root.type === 17 && !st.nested);
    check(p + ': only allowed component types, <=40 components', !st.badType && st.count <= 40);
    check(p + ': link buttons are style 5 with only allowed keys and http(s) URLs', !st.badButton);
    check(p + ': no literal "$1" from bad escaping', !st.dollar);
    check(p + ': "</script>" cannot close the tag early', !/<\/script/i.test(m[1]));
}
for (const f of ['favicon.ico', 'apple-touch-icon.png', 'site.webmanifest', 'assets/icon-192.png', 'assets/icon.png', 'assets/icon-maskable-512.png']) {
    check(f + ' exists', fs.existsSync(path.join(ROOT, f)));
}
const man = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.webmanifest'), 'utf8'));
check('manifest: name, short_name, start_url "/", display "browser"', man.name && man.short_name && man.start_url === '/' && man.display === 'browser');
check('manifest: 192, 512 and maskable 512 icons', ['192x192', '512x512'].every(s => man.icons.some(i => i.sizes === s)) && man.icons.some(i => i.purpose === 'maskable'));
// escaping sanity: the same rule the pages were generated with
const esc = s => s.replace(/([\*_~`|\[\]])/g, '\$1').replace(/^([#>-])/gm, '\$1');
check('escaping keeps the character and never prints "$1"', esc('a_b*c#') === 'a\_b\*c#' && esc('# h') === '\# h');
console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
