import dayjs from "dayjs";

export const emptyFormDraft = () => ({
  szCurrencyCode: "",
  szCurrencyName: "",
  szSymbol: "",
  szAbbreviation: "",
  szCountry: "",
  dtApplyRate: null,
  bdRate: null,
  chConvOper: "",
  bdBuyingRate: null,
  bdSellingRate: null,
});

export const extractFetchWrapper = (data) => {
  const wrapper = data?.responseJson || {};
  return {
    currencyList: wrapper.lstCurrencyDTO || [],
    convOperators: wrapper.lstConversionOperators || [],
  };
};

export const mapGridRowsFromApi = (currencyList) => {
  if (!currencyList || !Array.isArray(currencyList)) return [];
  return currencyList.map((row) => ({
    ...row,
    dtApplyRate: row.dtApplyRate ? new Date(row.dtApplyRate) : null,
    mode: "E", // Existing record
  }));
};

export const rowToFormDraft = (row) => ({
  szCurrencyCode: row.szCurrencyCode || "",
  szCurrencyName: row.szCurrencyName || "",
  szSymbol: row.szSymbol || "",
  szAbbreviation: row.szAbbreviation || "",
  szCountry: row.szCountry || "",
  dtApplyRate: row.dtApplyRate ? dayjs(row.dtApplyRate) : null,
  bdRate: row.bdRate,
  chConvOper: row.chConvOper || "",
  bdBuyingRate: row.bdBuyingRate,
  bdSellingRate: row.bdSellingRate,
});

export const buildSaveDto = (formDraft, szMode, userCode) => {
  const baseDto = {
    szCurrencyCode: formDraft.szCurrencyCode,
    szCurrencyName: formDraft.szCurrencyName,
    szSymbol: formDraft.szSymbol,
    szAbbreviation: formDraft.szAbbreviation,
    szCountry: formDraft.szCountry,
    dtApplyRate: formDraft.dtApplyRate
      ? dayjs(formDraft.dtApplyRate).format("YYYY-MM-DD")
      : null,
    bdRate: formDraft.bdRate == null ? null : Number(formDraft.bdRate),
    chConvOper: formDraft.chConvOper,
    bdBuyingRate: formDraft.bdBuyingRate == null ? null : Number(formDraft.bdBuyingRate),
    bdSellingRate: formDraft.bdSellingRate == null ? null : Number(formDraft.bdSellingRate),
    szMode: szMode,
  };

  if (szMode === "N") {
    return {
      ...baseDto,
      szCreatedBy: userCode,
    };
  } else {
    return {
      ...baseDto,
      szModifiedBy: userCode,
    };
  }
};

export const convOperatorsToDropdownOptions = (convOperators) => {
  if (!convOperators || !Array.isArray(convOperators)) return [];
  return convOperators.map((op) => ({
    value: op.szCondition,
    label: op.szDesc,
  }));
};

export const convOperatorDescMap = (convOperators) => {
  const map = {};
  if (!convOperators || !Array.isArray(convOperators)) return map;
  convOperators.forEach((op) => {
    map[op.szCondition] = op.szDesc;
  });
  return map;
};

export const getModifiedBy = () => {
  try {
    return sessionStorage.getItem("SEC_USERNAME") || "SYSTEM";
  } catch {
    return "SYSTEM";
  }
};