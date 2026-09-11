#!/usr/bin/env node
import path from 'node:path';
import {
  finishPolicyCheck,
  isWithin,
  lineNumberAt,
  lineTextAt,
  loadConfig,
  parseArgs,
  readTextFiles
} from './lib.mjs';

const args = parseArgs();
const root = path.resolve(args.root || '.');
const config = await loadConfig(root);
const files = await readTextFiles(root, { ignore: config.ignore });
const findings = [];
const tablerImportRegex = /(?:from\s+|import\s*\()(["'])(@tabler\/icons-[^"']+)\1/g;
const emojiButtonRegex = /<(?:button|a)\b[^>]*>[\s\S]{0,160}?(?:[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}])[\s\S]{0,160}?<\/(?:button|a)>/gu;
const textIconRegex = /<(?:button|a)\b[^>]*(?:aria-label|title)=["'][^"']+["'][^>]*>\s*(?:×|✕|✖|＋|−|→|←|⋮|⋯|⌕|⚙)\s*<\/(?:button|a)>/gu;

for (const { relPath, text } of files) {
  for (const match of text.matchAll(tablerImportRegex)) {
    if (isWithin(relPath, config.iconRegistryPaths)) continue;
    findings.push({
      kind: 'direct-tabler-import',
      file: relPath,
      line: lineNumberAt(text, match.index ?? 0),
      value: match[2],
      excerpt: lineTextAt(text, match.index ?? 0)
    });
  }
  for (const [regex, kind] of [[emojiButtonRegex, 'emoji-interface-icon'], [textIconRegex, 'text-interface-icon']]) {
    for (const match of text.matchAll(regex)) {
      findings.push({
        kind,
        file: relPath,
        line: lineNumberAt(text, match.index ?? 0),
        value: match[0].replace(/\s+/g, ' ').slice(0, 160),
        excerpt: lineTextAt(text, match.index ?? 0)
      });
    }
  }
}

await finishPolicyCheck({
  title: 'Icon-boundary check',
  heuristic: true,
  root,
  summary: {
    violations: findings.length,
    registryPaths: config.iconRegistryPaths
  },
  findings,
  limitations: [
    'Emoji and text-icon detection is conservative and cannot identify all visual icon misuse.',
    'A clean import graph does not prove semantic icon consistency or accessibility.'
  ]
}, args);
