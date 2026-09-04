
/**
 * Parse numeric expressions like:
 *   [1..30], >60, <=90, or exact numbers
 */
export const parseNumericExpr = (val) => {
  if (!val) return null;

  // range [x..y]
  const rangeMatch = val.match(/(\d+)\.\.(\d+)/);
  if (rangeMatch) {
    return {
      type: "range",
      min: parseInt(rangeMatch[1], 10),
      max: parseInt(rangeMatch[2], 10),
    };
  }

  // comparator >, <, >=, <=
  const compMatch = val.match(/(<=|>=|<|>)(\d+)/);
  if (compMatch) {
    return {
      type: "comparator",
      op: compMatch[1],
      value: parseInt(compMatch[2], 10),
    };
  }

  // exact number
  if (!isNaN(val)) {
    return { type: "exact", value: parseInt(val, 10) };
  }

  return null;
};

/**
 * Detect if numeric expressions overlap/conflict
 */
export const hasNumericConflict = (expressions) => {
  for (let i = 0; i < expressions.length; i++) {
    for (let j = i + 1; j < expressions.length; j++) {
      const a = expressions[i],
        b = expressions[j];
      if (!a || !b) continue;

      if (a.type === "range" && b.type === "range") {
        if (a.min <= b.max && b.min <= a.max) return true;
      }
      if (a.type === "comparator" && b.type === "range") {
        if (a.op === ">" && a.value < b.max) return true;
        if (a.op === "<" && a.value > b.min) return true;
      }
      if (a.type === "exact" && b.type === "range") {
        if (a.value >= b.min && a.value <= b.max) return true;
      }
      if (a.type === "exact" && b.type === "exact") {
        if (a.value === b.value) return true;
      }
    }
  }
  return false;
};

/**
 * Build payload for DMN API
 */
export const buildDMNPayload = ({
  ruleName,
  ruleDesc,
  moduleName,
  dmnType,
  entityName,
  hitPolicy,
  activeInputColumns,
  activeOutputColumns,
  rows,
}) => {
  const rules = rows.map((row, index) => {
    const inputs = {};
    const outputs = {};

    activeInputColumns.forEach((attr) => {
      inputs[attr.name] = row[attr.name] ?? "";
    });

    activeOutputColumns.forEach((attr) => {
      outputs[attr.name] = row[attr.name] ?? "";
    });
    console.log("Row:", row.mode);
    return {
      ruleNumber: row.ruleNumber ?? index + 1,
      inputs,
      outputs,
    };
  });

  

  return {
    ruleInfo:{
      ruleName,
      ruleDesc,
      moduleName,
      dmnType,
      entityName,
      hitPolicy, 
      inputs: activeInputColumns,
      outputs: activeOutputColumns,
    },
    dmnInfo:{
      rules
    }
    
    
  };
};