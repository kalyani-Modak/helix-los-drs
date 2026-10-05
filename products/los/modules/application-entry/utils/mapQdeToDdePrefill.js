/** Maps QDE form/API shape into Detailed Data Entry borrower fields. */
export const mapQdeToDdePrefill = (qde = {}) => {
  const profile = qde.profile || qde.borrowerCategory || "";
  const customerTypeMap = {
    Salaried: "Salaried",
    SALARIED: "Salaried",
    SEP: "Self Employed Professional (SEP)",
    SENP: "Self Employed Non-Professional (SENP)",
    Pensioner: "Pensioner",
  };

  return {
    customerType: customerTypeMap[profile] || profile || "Salaried",
    firstName: qde.firstName || "",
    middleName: qde.middleName || "",
    lastName: qde.lastName || "",
    aadhaar: qde.aadhaar || "",
    pan: qde.pan || "",
    dob: qde.dob || "",
    gender: qde.gender || "",
    mobile: qde.mobile || "",
    email: qde.email || "",
    currentAddressLine1: qde.addr1 || "",
    currentAddressLine2: qde.addr2 || "",
    currentCity: qde.city || "",
    currentDistrict: qde.district || "",
    currentProvince: qde.state || "",
    currentPostalCode: qde.pincode != null ? String(qde.pincode) : "",
    currentCountry: qde.country || "India",
    loanAmount: qde.loanAmount || "",
    tenureMonths: qde.tenure || qde.tenureMonths || "",
    taxPayerTin: qde.pan || "",
  };
};

export const mapQdePartiesToDde = (parties = [], kind = "co") =>
  parties.map((p) => ({
    id: p.id || `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    relationship: p.relationship || "",
    type: kind === "co" ? "Earning" : undefined,
    title: "",
    firstName: p.firstName || "",
    middleName: p.middleName || "",
    lastName: p.lastName || "",
    aadhaar: p.aadhaar || "",
    pan: p.pan || "",
    mobile: p.mobile || "",
    email: p.email || "",
    currentAddressLine1: p.addr1 || "",
    currentCity: p.city || "",
    currentDistrict: p.district || "",
    currentProvince: p.state || "",
    currentPostalCode: p.pincode != null ? String(p.pincode) : "",
    currentCountry: p.country || "India",
  }));
