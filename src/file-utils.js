// Small, cross-platform filesystem helpers plus managed "ignore block"
// handling. The ignore block is delimited by sentinel markers so it can be
// added, updated, and removed idempotently without disturbing the rest of the
// user's .gitignore / .git/info/exclude file.
import fs from 'node:fs';
import path from 'node:path';

export const IGNORE_BLOCK_START = '# >>> universal-refactor-skill >>>';
export const IGNORE_BLOCK_END = '# <<< universal-refactor-skill <<<';

/** True if a file or directory exists at the given path. */
export function pathExists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

/** Recursively create a directory (no error if it already exists). */
export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

/** Read a UTF-8 file, returning null instead of throwing when it is missing. */
export function readFileSafe(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return null;
  }
}

/** Write a UTF-8 file, creating any missing parent directories first. */
export function writeFileEnsured(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

/** Copy a bundled template file to a destination, creating parents as needed. */
export function copyTemplate(srcPath, destPath) {
  const content = fs.readFileSync(srcPath, 'utf8');
  writeFileEnsured(destPath, content);
}

/** Remove a file if it exists. Returns true when something was removed. */
export function removeFileIfExists(p) {
  if (pathExists(p)) {
    fs.rmSync(p, { force: true });
    return true;
  }
  return false;
}

/**
 * Remove `startDir` and walk upward toward (but never past) `stopDir`, deleting
 * directories only while they are empty. Stops at the first non-empty directory
 * so unrelated user files are never touched.
 */
export function pruneEmptyDirs(startDir, stopDir) {
  let current = path.resolve(startDir);
  const stop = path.resolve(stopDir);
  while (current !== stop && current.startsWith(stop)) {
    if (!pathExists(current)) {
      current = path.dirname(current);
      continue;
    }
    let entries;
    try {
      entries = fs.readdirSync(current);
    } catch {
      break;
    }
    if (entries.length > 0) break;
    try {
      fs.rmdirSync(current);
    } catch {
      break;
    }
    current = path.dirname(current);
  }
}

function buildBlock(entries, comment) {
  const lines = [IGNORE_BLOCK_START];
  if (comment) lines.push(`# ${comment}`);
  for (const e of entries) lines.push(e);
  lines.push(IGNORE_BLOCK_END);
  return lines.join('\n');
}

function findBlock(content) {
  const start = content.indexOf(IGNORE_BLOCK_START);
  if (start === -1) return null;
  const endMarker = content.indexOf(IGNORE_BLOCK_END, start);
  if (endMarker === -1) return null;
  return { start, end: endMarker + IGNORE_BLOCK_END.length };
}

/**
 * Insert or update the managed ignore block in `filePath`. Existing user
 * content is preserved; running this repeatedly is a no-op once the block
 * matches. Returns an object describing the action taken.
 */
export function upsertIgnoreBlock(filePath, entries, comment) {
  const block = buildBlock(entries, comment);
  const existing = readFileSafe(filePath);

  if (existing == null) {
    writeFileEnsured(filePath, block + '\n');
    return { action: 'created' };
  }

  const found = findBlock(existing);
  if (found) {
    const next = existing.slice(0, found.start) + block + existing.slice(found.end);
    if (next === existing) return { action: 'unchanged' };
    writeFileEnsured(filePath, next);
    return { action: 'updated' };
  }

  const separator = existing.length === 0 || existing.endsWith('\n') ? '' : '\n';
  const next = existing + separator + '\n' + block + '\n';
  writeFileEnsured(filePath, next);
  return { action: 'appended' };
}

/**
 * Remove the managed ignore block from `filePath` if present, leaving the rest
 * of the file intact. Returns an object describing the action taken.
 */
export function removeIgnoreBlock(filePath) {
  const existing = readFileSafe(filePath);
  if (existing == null) return { action: 'absent' };

  const found = findBlock(existing);
  if (!found) return { action: 'absent' };

  const before = existing.slice(0, found.start).replace(/\n+$/, '\n');
  const after = existing.slice(found.end).replace(/^\n+/, '');
  let next = (before === '\n' ? '' : before) + after;
  if (next.trim() === '') next = '';
  writeFileEnsured(filePath, next);
  return { action: 'removed' };
}
