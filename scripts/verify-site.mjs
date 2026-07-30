import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import {
  dirname,
  extname,
  join,
  normalize,
  resolve,
} from "node:path";

const projectRoot = resolve(".");
const ignoredDirectories = new Set([".git", "docs", "node_modules", "tests"]);
const failures = [];

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    if (ignoredDirectories.has(name)) return [];
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function displayPath(path) {
  return normalize(path).replaceAll("\\", "/");
}

function stripQueryAndHash(reference) {
  return reference.split(/[?#]/, 1)[0];
}

function resolvesLocally(reference, sourceFile) {
  let cleanReference;
  try {
    cleanReference = decodeURIComponent(stripQueryAndHash(reference));
  } catch {
    failures.push(`${displayPath(sourceFile)}: malformed URL encoding in ${reference}`);
    return true;
  }

  if (!cleanReference) return true;

  const target = cleanReference.startsWith("/")
    ? resolve(projectRoot, `.${cleanReference}`)
    : resolve(dirname(sourceFile), cleanReference);

  if (!target.startsWith(projectRoot)) return false;

  const candidates = [target];
  if (!extname(target)) candidates.push(join(target, "index.html"));
  return candidates.some(existsSync);
}

const htmlFiles = walk(projectRoot).filter((path) => path.endsWith(".html"));
const requiredTokens = [
  ["title", /<title>[^<]+<\/title>/i],
  ["description metadata", /<meta\s+[^>]*name=["']description["'][^>]*content=["'][^"']+["'][^>]*>/i],
  ["one H1", /<h1(?:\s[^>]*)?>/gi],
  ["site header", /<site-header(?:\s[^>]*)?>/i],
  ["site footer", /<site-footer(?:\s[^>]*)?>/i],
];

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const relativeFile = displayPath(file.slice(projectRoot.length + 1));

  for (const [label, pattern] of requiredTokens) {
    if (label === "one H1") {
      const count = html.match(pattern)?.length ?? 0;
      if (count !== 1) failures.push(`${relativeFile}: expected one H1, found ${count}`);
    } else if (!pattern.test(html)) {
      failures.push(`${relativeFile}: missing ${label}`);
    }
  }

  if (/drneha\.in/i.test(html)) {
    failures.push(`${relativeFile}: forbidden drneha.in reference`);
  }

  for (const match of html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
    const reference = match[1].trim();
    if (
      !reference ||
      reference.startsWith("#") ||
      /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(reference)
    ) {
      continue;
    }
    if (!resolvesLocally(reference, file)) {
      failures.push(`${relativeFile}: broken local reference ${reference}`);
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Verified ${htmlFiles.length} HTML files with metadata, shared shell, and local references.`);
