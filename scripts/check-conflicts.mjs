import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const skipDirs = new Set(['.git', 'node_modules', 'dist', 'coverage']);
const conflictRegex = /^(<<<<<<<|=======|>>>>>>>) /m;

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue;
      yield* walk(full);
      continue;
    }
    yield full;
  }
}

const conflicted = [];
for await (const file of walk(root)) {
  const content = await readFile(file, 'utf8').catch(() => null);
  if (content && conflictRegex.test(content)) {
    conflicted.push(path.relative(root, file));
  }
}

if (conflicted.length > 0) {
  console.error('Merge conflict markers found in:');
  for (const file of conflicted) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log('No merge conflict markers found.');
