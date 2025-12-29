import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src');
const EXCLUDE_DIRS = [
  path.join(SRC_DIR, 'i18n'),
];

function isExcluded(filePath) {
  const normalized = path.normalize(filePath);
  return EXCLUDE_DIRS.some((dir) => normalized.startsWith(path.normalize(dir + path.sep)));
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      files.push(...walk(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

function hasLetters(s) {
  return /[A-Za-zА-Яа-яЁё]/.test(s);
}

function checkFile(filePath) {
  if (!filePath.endsWith('.tsx')) return [];
  if (isExcluded(filePath)) return [];

  const rel = path.relative(ROOT, filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(rel, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  /** @type {Array<{type:string,snippet:string,pos:number,file:string}>} */
  const violations = [];

  const watchedAttrs = new Set(['aria-label', 'title', 'placeholder', 'alt']);

  /** @param {import('typescript').Node} node */
  function visit(node) {
    // 1) JSX text nodes (real JSX, not TypeScript generics)
    if (ts.isJsxText(node) && !node.containsOnlyWhiteSpaces) {
      const text = node.getText(sourceFile);
      if (hasLetters(text)) {
        violations.push({
          type: 'JSXText',
          snippet: text.replace(/\s+/g, ' ').trim().slice(0, 120),
          pos: node.getStart(sourceFile),
          file: rel,
        });
      }
    }

    // 2) JSX attributes: aria-label/title/placeholder/alt with string literals
    if (ts.isJsxAttribute(node)) {
      const name = node.name.getText(sourceFile);
      if (watchedAttrs.has(name) && node.initializer && ts.isStringLiteral(node.initializer)) {
        const value = node.initializer.text;
        if (hasLetters(value)) {
          violations.push({
            type: `Attr:${name}`,
            snippet: `${name}="${value.slice(0, 80)}"`,
            pos: node.getStart(sourceFile),
            file: rel,
          });
        }
      }
    }

    // 3) alert/confirm with string literal / no-substitution template literal
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const fn = node.expression.text;
      if ((fn === 'alert' || fn === 'confirm') && node.arguments.length > 0) {
        const arg0 = node.arguments[0];
        if (ts.isStringLiteral(arg0) || ts.isNoSubstitutionTemplateLiteral(arg0)) {
          const value = arg0.text;
          if (hasLetters(value)) {
            violations.push({
              type: `Dialog:${fn}`,
              snippet: `${fn}(${JSON.stringify(value.slice(0, 80))})`,
              pos: node.getStart(sourceFile),
              file: rel,
            });
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return violations;
}

function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error('i18n-check: src/ not found');
    process.exit(1);
  }

  const allFiles = walk(SRC_DIR).filter((f) => f.endsWith('.tsx'));
  const allViolations = [];

  for (const f of allFiles) {
    const v = checkFile(f);
    if (v.length) {
      const rel = path.relative(ROOT, f);
      const content = fs.readFileSync(f, 'utf8');
      const sf = ts.createSourceFile(rel, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      for (const one of v) {
        const lc = sf.getLineAndCharacterOfPosition(one.pos);
        allViolations.push({ ...one, line: lc.line + 1, col: lc.character + 1 });
      }
    }
  }

  if (allViolations.length === 0) {
    console.log('i18n-check: OK (no hardcoded UI strings found in .tsx)');
    return;
  }

  console.error('i18n-check: FAIL — hardcoded UI strings found (use t(\'...\') instead):\n');
  for (const v of allViolations) {
    console.error(`- ${v.file}:${v.line}:${v.col}  [${v.type}]  ${v.snippet}`);
  }
  console.error('\nSee I18N_RULES.md');
  process.exit(2);
}

main();


