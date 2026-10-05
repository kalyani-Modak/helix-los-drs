import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stageFormsPath = path.resolve(
  __dirname,
  "../../../../../../AFL_LOS/src/lib/stage-forms.ts"
);
const outPath = path.resolve(__dirname, "../constants/ddeFieldMetadata.js");

let t = fs.readFileSync(stageFormsPath, "utf8");
const start = t.indexOf('"data-entry": [');
const end = t.indexOf('"data-val": [');
if (start < 0 || end < 0) {
  console.error("Could not find data-entry block");
  process.exit(1);
}
let block = t.slice(start, end);
block = block.replace('"data-entry": [', "[");
block = block.replace(/DDE_SALARIED_ONLY/g, '{ field: "customerType", equals: "Salaried" }');
block = block.replace(/options: PIN_DISTRICT_OPTIONS/g, "options: []");
block = block.replace(/options: DDE_EMPLOYER_OPTIONS/g, "options: []");
block = block.replace(
  /options: DDE_REPAYMENT_MODE_OPTIONS/g,
  'options: ["SI","CEFTS","Cash deposits","Cheque"]'
);
block = block.replace(/\/\/[^\n]*/g, "");
block = block.replace(/^\s*remarks,\s*$/gm, "");
block = block.trim();
if (!block.endsWith("]")) {
  const lastBracket = block.lastIndexOf("]");
  block = block.slice(0, lastBracket + 1);
}

// eslint-disable-next-line no-eval
const fields = eval(block);
const cleaned = fields.map((f) => {
  const o = { name: f.name, type: f.type, label: f.label };
  if (f.section) o.section = f.section;
  if (f.required) o.required = true;
  if (f.maxLength) o.maxLength = f.maxLength;
  if (f.min != null) o.min = f.min;
  if (f.max != null) o.max = f.max;
  if (f.pattern) o.pattern = f.pattern;
  if (f.placeholder) o.placeholder = f.placeholder;
  if (f.disabled) o.disabled = true;
  if (f.fullWidth) o.fullWidth = true;
  if (f.options?.length) o.options = f.options;
  if (f.optionsMaster) o.optionsMaster = f.optionsMaster;
  if (f.optionsMasterParentField) o.optionsMasterParentField = f.optionsMasterParentField;
  if (f.showIf) o.showIf = f.showIf;
  if (f.alsoShowIf) o.alsoShowIf = f.alsoShowIf;
  if (f.help) o.help = f.help;
  return o;
});

fs.writeFileSync(outPath, `export const DDE_FIELDS = ${JSON.stringify(cleaned, null, 2)};\n`);
console.log(`Wrote ${cleaned.length} fields to ${outPath}`);
