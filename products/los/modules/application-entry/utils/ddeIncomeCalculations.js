const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const SOURCES = [
  { inc: "incIncludeBasic", amt: "basicSalary", con: "basicSalaryConsideration" },
  { inc: "incIncludeAllowance", amt: "allowances", con: "fixedAllowanceConsideration" },
  { inc: "incIncludeBonus", amt: "bonusAmount", con: "bonusConsideration" },
  { inc: "incIncludeVariable", amt: "variableIncome", con: "variableConsideration" },
  { inc: "incIncludeIncentive", amt: "incentiveAmount", con: "incentiveConsideration" },
];

export const computeDdeIncomeTotals = (values) => {
  const otherInc = num(values.otherIncome);
  const gross =
    SOURCES.reduce((s, r) => s + (values[r.inc] ? num(values[r.amt]) : 0), 0) + otherInc;
  const net =
    SOURCES.reduce((s, r) => {
      if (!values[r.inc]) return s;
      const c = values[r.con] === "" || values[r.con] === undefined ? 100 : num(values[r.con]);
      return s + num(values[r.amt]) * (c / 100);
    }, 0) + otherInc;
  const gR = Math.round(gross * 100) / 100;
  const nR = Math.round(net * 100) / 100;
  return { grossMonthlyIncome: gR, netMonthlyIncome: nR, finalConsideredIncome: nR };
};

export const applyDdeIncomePatch = (values) => {
  if (values.customerType !== "Salaried") {
    return null;
  }
  return computeDdeIncomeTotals(values);
};
