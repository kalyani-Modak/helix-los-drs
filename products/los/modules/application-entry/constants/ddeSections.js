/** Section display order and i18n keys (AFL Detailed Data Entry). */
export const DDE_SECTION_CONFIG = [
  {
    key: "personal",
    sectionFilter: "Personal Details",
    titleKey: "label.dde.section.personal",
  },
  {
    key: "currentAddress",
    sectionFilter: "Current Address",
    titleKey: "label.dde.section.currentAddress",
    
  },
  {
    key: "permanentAddress",
    sectionFilter: "Permanent Address",
    titleKey: "label.dde.section.permanentAddress",
   
  },
  {
    key: "contact",
    sectionFilter: "Contact & Correspondence",
    titleKey: "label.dde.section.contact",
   
  },
  {
    key: "employment",
    sectionFilter: "Employment & Income",
    titleKey: "label.dde.section.employment",
    
  },
  {
    key: "income",
    sectionFilter: "Income Details",
    titleKey: "label.dde.section.income",
    
  },
  {
    key: "sep",
    sectionFilter: "Self-Employed Professional",
    titleKey: "label.dde.section.sep",
    
  },
  {
    key: "senp",
    sectionFilter: "Self-Employed Business",
    titleKey: "label.dde.section.senp",
    
  },
  {
    key: "pensioner",
    sectionFilter: "Pensioner Income",
    titleKey: "label.dde.section.pensioner",
    
  },
  {
    key: "perfios",
    custom: "perfios",
    titleKey: "label.dde.section.perfios",
    
  },
  {
    key: "bank",
    sectionFilter: "Bank Details",
    titleKey: "label.dde.section.bank",
   
  },
  {
    key: "tax",
    sectionFilter: "Tax Details",
    titleKey: "label.dde.section.tax",
   
  },
  {
    key: "loan",
    sectionFilter: "Loan Details",
    titleKey: "label.dde.section.loan",
    
  },
];

export const DDE_SALARIED = "SAL";
export const DDE_SEP = "SEP";
export const DDE_SENP = "SENP";
export const DDE_PENSIONER = "PENS";

const DDE_CUSTOMER_TYPE_ALIASES = {
  Salaried: DDE_SALARIED,
  SALARIED: DDE_SALARIED,
  "Self Employed Professional (SEP)": DDE_SEP,
  SELF_EMPLOYED_PROFESSIONAL: DDE_SEP,
  "Self Employed Non-Professional (SENP)": DDE_SENP,
  SELF_EMPLOYED_NON_PROFESSIONAL: DDE_SENP,
  Pensioner: DDE_PENSIONER,
  PENSIONER: DDE_PENSIONER,
};

export const normalizeDdeCustomerType = (value) =>
  DDE_CUSTOMER_TYPE_ALIASES[value] || value || "";
