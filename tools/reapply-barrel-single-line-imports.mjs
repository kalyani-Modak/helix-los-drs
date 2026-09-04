/**
 * Re-apply barrel imports for @collection-common/components and
 * @collection-common/AgGrid-Framework, each on a single line.
 * Safe: only collapses blocks that end with } from "@collection-common/..."
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve("products/collection/modules");

function walk(dir, acc = []) {
	for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
		const p = path.join(dir, ent.name);
		if (ent.isDirectory()) walk(p, acc);
		else if (/\.(jsx|js)$/.test(ent.name)) acc.push(p);
	}
	return acc;
}

function consumeImport(lines, start) {
	let i = start;
	let acc = lines[i];
	while (i < lines.length - 1 && !/from\s+["'][^"']+["']\s*;?\s*$/.test(lines[i])) {
		i++;
		acc += "\n" + lines[i];
	}
	return { text: acc, nextIdx: i + 1 };
}

function parseComponentsImport(block) {
	if (!block.includes("@collection-common/components/")) return null;
	const names = new Set();
	const def = block.match(/^import\s+(\w+)\s+from/m);
	if (def) {
		names.add(def[1]);
		return names;
	}
	const named = block.match(/^import\s*\{([\s\S]*?)\}\s*from/m);
	if (named) {
		for (const part of named[1].split(",")) {
			const t = part.trim().split(/\s+/)[0];
			if (t) names.add(t);
		}
		return names;
	}
	return null;
}

function parseAgGridImport(block) {
	if (!block.includes("@collection-common/AgGrid-Framework/")) return null;
	const names = new Set();
	const def = block.match(/^import\s+(\w+)\s+from/m);
	if (def) {
		names.add(def[1]);
		return names;
	}
	const named = block.match(/^import\s*\{([\s\S]*?)\}\s*from/m);
	if (named) {
		for (const part of named[1].split(",")) {
			const t = part.trim().split(/\s+/)[0];
			if (t) names.add(t);
		}
		return names;
	}
	return null;
}

/** First line index after the leading import / comment / blank preamble (original lines). */
function leadImportBlockEndLineIndex(lines) {
	let i = 0;
	while (i < lines.length) {
		if (/^\s*import\s/.test(lines[i])) {
			const { nextIdx } = consumeImport(lines, i);
			i = nextIdx;
			continue;
		}
		const t = lines[i].trim();
		if (t === "" || t.startsWith("//") || t.startsWith("/*")) {
			i++;
			continue;
		}
		break;
	}
	return i;
}

function mergeBarrelImports(content) {
	const lines = content.split("\n");
	const comp = new Set();
	const ag = new Set();

	let i = 0;
	while (i < lines.length) {
		if (/^\s*import\s/.test(lines[i])) {
			const { text, nextIdx } = consumeImport(lines, i);
			if (text.includes("@collection-common/components/")) {
				const n = parseComponentsImport(text);
				if (n) for (const x of n) comp.add(x);
			} else if (text.includes("@collection-common/AgGrid-Framework/")) {
				const n = parseAgGridImport(text);
				if (n) for (const x of n) ag.add(x);
			}
			i = nextIdx;
			continue;
		}
		i++;
	}

	if (comp.size === 0 && ag.size === 0) return content;

	const insertLine = leadImportBlockEndLineIndex(lines);
	const parts = [];
	if (comp.size) {
		const sorted = [...comp].sort();
		parts.push(`import { ${sorted.join(", ")} } from "@collection-common/components";`);
	}
	if (ag.size) {
		const sorted = [...ag].sort();
		parts.push(`import { ${sorted.join(", ")} } from "@collection-common/AgGrid-Framework";`);
	}
	const injection = parts.join("\n");

	const out = [];
	i = 0;
	while (i < lines.length) {
		if (i === insertLine) out.push(injection);
		if (/^\s*import\s/.test(lines[i])) {
			const { text, nextIdx } = consumeImport(lines, i);
			if (
				text.includes("@collection-common/components/") ||
				text.includes("@collection-common/AgGrid-Framework/")
			) {
				i = nextIdx;
				continue;
			}
			for (let k = i; k < nextIdx; k++) out.push(lines[k]);
			i = nextIdx;
			continue;
		}
		out.push(lines[i]);
		i++;
	}
	if (insertLine >= lines.length) out.push(injection);
	return out.join("\n").replace(/\n{3,}/g, "\n\n");
}

/** Only rewrite import blocks that close with @collection-common barrel paths. */
function collapseExistingBarrelBlocksToOneLine(content) {
	const lines = content.split("\n");
	const out = [];
	let i = 0;
	while (i < lines.length) {
		const line = lines[i];
		if (/^\s*import\s*\{/.test(line) && !line.includes("from ")) {
			const block = [line];
			let j = i + 1;
			let foundClose = false;
			while (j < lines.length) {
				const L = lines[j];
				block.push(L);
				if (/^\s*\}\s*from\s*["']@collection-common\/(components|AgGrid-Framework)["']\s*;?\s*$/.test(L)) {
					foundClose = true;
					break;
				}
				if (/^\s*import\s/.test(L)) break;
				j++;
			}
			const text = block.join("\n");
			if (
				foundClose &&
				/from\s*["']@collection-common\/(components|AgGrid-Framework)["']/.test(text)
			) {
				const m = text.match(
					/import\s*\{\s*([\s\S]*?)\s*\}\s*from\s*(["'])@collection-common\/(components|AgGrid-Framework)\2\s*;?/,
				);
				if (m) {
					const inner = m[1];
					const quote = m[2];
					const sub = m[3];
					const parts = inner
						.split(",")
						.map((s) => s.replace(/\s+/g, " ").trim())
						.filter(Boolean);
					out.push(`import { ${parts.join(", ")} } from ${quote}@collection-common/${sub}${quote};`);
					i = j + 1;
					continue;
				}
			}
		}
		if (/^\s*import\s*\{[^}]+\}\s*from\s*["']@collection-common\/(components|AgGrid-Framework)["']/.test(line)) {
			const m = line.match(
				/import\s*\{\s*(.+?)\s*\}\s*from\s*(["'])@collection-common\/(components|AgGrid-Framework)\2\s*;?\s*$/,
			);
			if (m) {
				const parts = m[1]
					.split(",")
					.map((s) => s.replace(/\s+/g, " ").trim())
					.filter(Boolean);
				out.push(`import { ${parts.join(", ")} } from ${m[2]}@collection-common/${m[3]}${m[2]};`);
				i++;
				continue;
			}
		}
		out.push(line);
		i++;
	}
	return out.join("\n");
}

function transform(content) {
	let next = content;
	if (next.includes("@collection-common/components/") || next.includes("@collection-common/AgGrid-Framework/")) {
		next = mergeBarrelImports(next);
	}
	next = collapseExistingBarrelBlocksToOneLine(next);
	return next;
}

let n = 0;
for (const file of walk(ROOT)) {
	const before = fs.readFileSync(file, "utf8");
	const after = transform(before);
	if (after !== before) {
		fs.writeFileSync(file, after, "utf8");
		n++;
	}
}
console.log(`Updated ${n} files`);
