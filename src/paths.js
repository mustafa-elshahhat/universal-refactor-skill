// Path helpers for resolving the package's bundled templates and the install
// target. Kept tiny and dependency-free so it works identically on Windows,
// macOS, and Linux.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// This file lives in <package>/src/paths.js, so the package root is one level up.
const here = path.dirname(fileURLToPath(import.meta.url));

/** Absolute path to the installed package root (contains package.json). */
export const PACKAGE_ROOT = path.resolve(here, '..');

/** Absolute path to the bundled templates directory. */
export const TEMPLATES_DIR = path.join(PACKAGE_ROOT, 'templates');

/** Build an absolute path inside the bundled templates directory. */
export function templatePath(...segments) {
  return path.join(TEMPLATES_DIR, ...segments);
}

/** Resolve the target project directory (defaults to the current directory). */
export function resolveTarget(target) {
  return path.resolve(target || process.cwd());
}
