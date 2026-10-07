import { DDE_INCOME_SOURCES } from "../constants/ddeIncomeSources";

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const calculateDdeIncomeAverage = (source, values) =>
  Math.round(
    (source.months.reduce((sum, monthField) => sum + num(values[monthField]), 0) / 3) * 100
  ) / 100;

export const computeDdeIncomeTotals = (values) => {
  const gross =
    DDE_INCOME_SOURCES.reduce(
      (sum, source) =>
        sum +
        (!source.include || values[source.include]
          ? calculateDdeIncomeAverage(source, values)
          : 0),
      0
    );
  const net =
    DDE_INCOME_SOURCES.reduce((sum, source) => {
      if (source.include && !values[source.include]) return sum;
      return sum + calculateDdeIncomeAverage(source, values);
    }, 0);
  const gR = Math.round(gross * 100) / 100;
  const nR = Math.round(net * 100) / 100;
  return { grossMonthlyIncome: gR, netMonthlyIncome: nR, finalConsideredIncome: nR };
};

export const getDdeIncomeAveragePatch = (fieldName, fieldValue, values) => {
  const source = DDE_INCOME_SOURCES.find((item) => item.months.includes(fieldName));
  if (!source) return null;

  const nextValues = { ...values, [fieldName]: fieldValue };
  const average = calculateDdeIncomeAverage(source, nextValues);
  return { [source.amount]: String(average) };
};

export const applyDdeIncomePatch = (values) => {
  if (values.customerType !== "Salaried") {
    return null;
  }
  return computeDdeIncomeTotals(values);
};
