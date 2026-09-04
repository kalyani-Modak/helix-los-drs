export const normalizeLookupOption = (item) => ({
  code: item.szCondition ?? "",
  desc: item.szi18nDesc || item.szCondition || "",
});

export const mapProductRowsFromApi = (productData = []) =>
  productData.map((item, index) => ({
    key: item.szProductCode || `row-${index}`,
    szProductCode: item.szProductCode ?? "",
    szProductDescription: item.szProductDescription ?? "",
    szProductType: item.szProductType ?? "",
    szProductCategory: item.szProductCategory ?? "",
    inInterestDaysInYear: item.inInterestDaysInYear ?? null,
    flProvisionPercentage: item.flProvisionPercentage ?? null,
    flDefaultInterestRate: item.flDefaultInterestRate ?? null,
    mode: "",
  }));


export const mapPortfolioOptions = (payload = []) =>
  payload
    .filter((item) => item.szActive === "Y")
    .map((item) => ({
      value: item.szPortfolioCode,
      label: `${item.szPortfolioCode} - ${item.szPortfolioDescription}`,
    }));

export const normalizePortfolioPayload = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.responseJson)) return data.responseJson;
  return [];
};

export const buildSavePayload = ({
  portfolioCode,
  user,
  newRows = [],
  updatedRows = [],
  deletedRows = [],
}) => {
  const products = [
    ...newRows.map((r) => ({ ...r, szMode: "N" })),
    ...updatedRows.map((r) => ({ ...r, szMode: "E" })),
    ...deletedRows.map((r) => ({ ...r, szMode: "D" })),
  ].map((r) => ({
    szProductCode: r.szProductCode,
    szProductDescription: r.szProductDescription,
    szProductType: r.szProductType,
    szProductCategory: r.szProductCategory,
    flDefaultInterestRate: r.flDefaultInterestRate,
    inInterestDaysInYear: r.inInterestDaysInYear,
    flProvisionPercentage: r.flProvisionPercentage,
    szMode: r.szMode,
  }));

  return {
    szPortfolioCode: portfolioCode,
    szUser: user,
    products,
  };
};

export const findDuplicateProductCodes = (rows = []) => {
  const seen = new Set();
  const duplicates = new Set();

  rows.forEach((row) => {
    const code = (row.szProductCode || "").trim();
    if (!code) return;
    if (seen.has(code)) duplicates.add(code);
    seen.add(code);
  });

  return [...duplicates];
};
