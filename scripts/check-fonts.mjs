// Verify every font url() in the published stylesheets resolves to a
// file that ships in the npm package, with the exact filename case.
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, normalize, basename } from 'node:path';

const STYLESHEETS = ['open-sans.css', 'css/OpenSansHebrew.css'];

const packed = new Set(
  JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json'], { encoding: 'utf8' }))[0]
    .files.map((f) => f.path),
);

const existsExactCase = (path) => readdirSync(dirname(path) || '.').includes(basename(path));

const errors = [];
for (const sheet of STYLESHEETS) {
  if (!packed.has(sheet)) errors.push(`${sheet}: not in npm package`);
  const css = readFileSync(sheet, 'utf8');
  for (const [, raw] of css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) {
    const ref = raw.replace(/[?#].*$/, '');
    if (/^([a-z]+:)?\/\//i.test(ref) || ref.startsWith('/')) {
      errors.push(`${sheet}: ${raw} is not relative to the package`);
      continue;
    }
    const path = normalize(join(dirname(sheet), ref));
    let found = false;
    try { found = existsExactCase(path); } catch { /* missing directory */ }
    if (!found) errors.push(`${sheet}: ${raw} -> ${path} does not exist`);
    else if (!packed.has(path)) errors.push(`${sheet}: ${path} not in npm package`);
  }
}

if (errors.length) {
  console.error([...new Set(errors)].join('\n'));
  console.error(`\n${new Set(errors).size} problem(s)`);
  process.exit(1);
}
console.log(`ok: every font url() in ${STYLESHEETS.join(', ')} ships in the package`);
