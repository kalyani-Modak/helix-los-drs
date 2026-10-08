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
block = block.replace(/DDE_SALARIED_ONLY/g, '{ field: "customerType", equals: "SAL" }');
block = block.replace(/equals:\s*"Salaried"/g, 'equals: "SAL"');
block = block.replace(/equals:\s*"Self Employed Professional \(SEP\)"/g, 'equals: "SEP"');
block = block.replace(/equals:\s*"Self Employed Non-Professional \(SENP\)"/g, 'equals: "SENP"');
block = block.replace(/equals:\s*"Pensioner"/g, 'equals: "PENS"');
block = block.replace(/\/\/[^\n]*/g, "");
block = block.replace(/^\s*remarks,\s*$/gm, "");
block = block.trim();
if (!block.endsWith("]")) {
  const lastBracket = block.lastIndexOf("]");
  block = block.slice(0, lastBracket + 1);
}

// eslint-disable-next-line no-eval
const fields = eval(block);
const ddeLookupTypeByField = {
  customerType: "los.borrowercategory",
  title: "party.title",
  gender: "party.gender",
  maritalStatus: "party.maritalstatus",
  nationality: "party.nationality",
  religion: "party.religion",
  education: "party.education",
  residenceStatus: "party.residencestatus",
  currentDistrict: "party.address.district",
  permanentDistrict: "party.address.district",
  currentProvince: "party.address.state",
  permanentProvince: "party.address.state",
  pensionerType: "los.pensionertype",
  pensionCreditMode: "los.pensioncreditmode",
  borrowerBank1Name: "los.bankname",
  borrowerBank1AccountType: "los.bankaccounttype",
  repaymentMode: "los.repaymentmode",
  loanPurposePrimary: "los.loanpurpose",
  repaymentFrequency: "los.repaymentfrequency",
  rateType: "los.ratetype",
  repaymentScheduleType: "los.repaymentscheduletype",
};
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
  if (ddeLookupTypeByField[f.name]) o.optionsMaster = ddeLookupTypeByField[f.name];
  if (f.showIf) o.showIf = f.showIf;
  if (f.alsoShowIf) o.alsoShowIf = f.alsoShowIf;
  if (f.help) o.help = f.help;
  return o;
});

fs.writeFileSync(outPath, `export const DDE_FIELDS = ${JSON.stringify(cleaned, null, 2)};\n`);
console.log(`Wrote ${cleaned.length} fields to ${outPath}`);
