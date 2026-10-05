const CURRENT_TO_PERMANENT = [
  ["currentAddressLine1", "permanentAddressLine1"],
  ["currentAddressLine2", "permanentAddressLine2"],
  ["currentCity", "permanentCity"],
  ["currentDistrict", "permanentDistrict"],
  ["currentProvince", "permanentProvince"],
  ["currentPostalCode", "permanentPostalCode"],
  ["currentCountry", "permanentCountry"],
];

export const syncPermanentFromCurrent = (form) => {
  if (!form.sameAsCurrent) {
    return null;
  }
  const patch = {};
  CURRENT_TO_PERMANENT.forEach(([from, to]) => {
    patch[to] = form[from] ?? "";
  });
  return patch;
};
