import { useCallback, useMemo, useState } from "react";
import {
  BORROWER_TYPE_NON_INDIVIDUAL,
  DEFAULT_PORTFOLIO,
  VERIFICATION_STATUS,
} from "../constants/qdeOptions";

const emptyParty = () => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  firstName: "",
  lastName: "",
  mobile: "",
  pan: "",
});

export const INITIAL_FORM = {
  // Business unit
  applicationType: "",
  portfolio: DEFAULT_PORTFOLIO,
  borrowerType: "Individual",
  customerType: "New",
  customerId: "",

  // KYC — individual
  pan: "",
  panStatus: VERIFICATION_STATUS.PENDING,
  aadhaar: "",
  aadhaarOtp: "",
  aadhaarOtpSent: false,
  aadhaarStatus: VERIFICATION_STATUS.PENDING,
  panAadhaarLinked: VERIFICATION_STATUS.PENDING,
  ckycNumber: "",
  ckycOtp: "",
  ckycOtpSent: false,
  ckycStatus: VERIFICATION_STATUS.PENDING,
  digiRef: "",
  digiStatus: VERIFICATION_STATUS.PENDING,

  // Applicant
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  dob: "",
  profile: "",
  fatherName: "",
  motherName: "",
  mobile: "",
  mobileVerified: false,
  email: "",
  emailVerified: false,
  staff: false,
  preApproved: false,

  // Entity (non-individual)
  entityName: "",
  entityType: "",
  doi: "",
  gstRegistered: "N",
  msmeRegistered: "N",
  urn: "",
  urnStatus: VERIFICATION_STATUS.PENDING,
  bizPanStatus: VERIFICATION_STATUS.PENDING,
  gstin: "",
  gstinStatus: VERIFICATION_STATUS.PENDING,
  cin: "",
  shopAct: "",
  shopActStatus: VERIFICATION_STATUS.PENDING,

  // Authorised signatory
  asFirstName: "",
  asMiddleName: "",
  asLastName: "",
  asDob: "",
  asDesignation: "",
  asMobile: "",
  asMobileVerified: false,
  asEmail: "",
  asEmailVerified: false,
  asAadhaar: "",
  asAadhaarOtp: "",
  asAadhaarStatus: VERIFICATION_STATUS.PENDING,
  asPan: "",
  asPanStatus: VERIFICATION_STATUS.PENDING,
  asPanAadhaarLinked: VERIFICATION_STATUS.PENDING,

  // Address
  addressType: "",
  addr1: "",
  addr2: "",
  addr3: "",
  landmark: "",
  pincode: "",
  city: "",
  district: "",
  state: "",
  country: "India",

  // Related parties
  coApplicants: [],
  guarantors: [],

  // Loan
  loanType: "Term Loan",
  product: "",
  scheme: "",
  loanAmount: "",
  tenure: "",
  rate: "",

  // Sourcing
  channel: "",
  sourcingBranch: "",
  servicingBranch: "",
  channelName: "",
  channelCode: "",
  dsaMobile: "",
  dsaEmail: "",
  rmName: "",
  rmCode: "",

  // Meta
  applicationNo: "",
  ocrDocType: "Application Form",
};

const isVerified = (status) => status === VERIFICATION_STATUS.VERIFIED;
const toNumberOrNull = (value) => (value === "" || value == null ? null : Number(value));
const yn = (value) => (value === true ? "Y" : value === false ? "N" : value || "N");

/**
 * Owns the entire quick data entry form: field state, related-party lists,
 * the backend `QdeApplicationRequest` mapping and rehydration from a GET.
 */
export const useQuickDataEntryForm = () => {
  const [form, setForm] = useState(INITIAL_FORM);

  const setField = useCallback((name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setFields = useCallback((patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetForm = useCallback(() => setForm(INITIAL_FORM), []);

  const isNonIndividual = form.borrowerType === BORROWER_TYPE_NON_INDIVIDUAL;

  const addCoApplicant = useCallback(() => {
    setForm((prev) => ({ ...prev, coApplicants: [...prev.coApplicants, emptyParty()] }));
  }, []);

  const removeCoApplicant = useCallback((id) => {
    setForm((prev) => ({ ...prev, coApplicants: prev.coApplicants.filter((c) => c.id !== id) }));
  }, []);

  const updateCoApplicant = useCallback((id, field, value) => {
    setForm((prev) => ({
      ...prev,
      coApplicants: prev.coApplicants.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    }));
  }, []);

  const addGuarantor = useCallback(() => {
    setForm((prev) => ({ ...prev, guarantors: [...prev.guarantors, emptyParty()] }));
  }, []);

  const removeGuarantor = useCallback((id) => {
    setForm((prev) => ({ ...prev, guarantors: prev.guarantors.filter((g) => g.id !== id) }));
  }, []);

  const updateGuarantor = useCallback((id, field, value) => {
    setForm((prev) => ({
      ...prev,
      guarantors: prev.guarantors.map((g) => (g.id === id ? { ...g, [field]: value } : g)),
    }));
  }, []);

  /** Maps form state onto the backend `QdeApplicationRequest` shape. */
  const buildPayload = useCallback(() => {
    const f = form;

    return {
      applicationType: f.applicationType || null,
      portfolio: f.portfolio || null,
      borrowerType: f.borrowerType || null,
      customerType: f.customerType || null,
      customerId: f.customerId || null,

      entityName: f.entityName || null,
      entityType: f.entityType || null,
      dateOfIncorporation: f.doi || null,
      gstRegistered: yn(f.gstRegistered),
      msmeRegistered: yn(f.msmeRegistered),

      urn: f.urn || null,
      gstin: f.gstin || null,
      cin: f.cin || null,
      shopAct: f.shopAct || null,
      digiRef: f.digiRef || null,
      digiStatus: f.digiStatus || null,
      panStatus: f.panStatus || null,
      aadhaarStatus: f.aadhaarStatus || null,
      panAadhaarLinkedStatus: f.panAadhaarLinked || null,
      ckycStatus: f.ckycStatus || null,
      staff: f.staff,
      preApproved: f.preApproved,
      borrowerCategory: f.profile || null,
      loanType: f.loanType || null,
      servicingBranch: f.servicingBranch || null,

      kyc: {
        panNumber: f.pan || null,
        aadhaarNumber: f.aadhaar || null,
        ckycNumber: f.ckycNumber || null,
        panVerified: isVerified(f.panStatus),
        aadhaarVerified: isVerified(f.aadhaarStatus),
        panAadhaarLinked: isVerified(f.panAadhaarLinked),
        digilockerVerified: isVerified(f.digiStatus),
        mobileVerified: f.mobileVerified,
      },

      applicant: {
        firstName: f.firstName || null,
        middleName: f.middleName || null,
        lastName: f.lastName || null,
        dateOfBirth: f.dob || null,
        gender: f.gender || null,
        fatherName: f.fatherName || null,
        motherName: f.motherName || null,
        mobileNumber: f.mobile || null,
        email: f.email || null,
        customerType: f.customerType || null,
        existingCustomerId: f.customerId || null,
        category: f.profile || null,
      },

      address: {
        current: {
          addressType: f.addressType || null,
          addressLine1: f.addr1 || null,
          addressLine2: f.addr2 || null,
          landmark: f.landmark || null,
          pincode: f.pincode || null,
          city: f.city || null,
          district: f.district || null,
          state: f.state || null,
          country: f.country || null,
        },
      },

      loan: {
        productName: f.product || null,
        schemeCode: f.scheme || null,
        requestedAmount: toNumberOrNull(f.loanAmount),
        tenureMonths: toNumberOrNull(f.tenure),
        interestRate: toNumberOrNull(f.rate),
        loanPurpose: f.loanType || null,
      },

      sourcing: {
        sourcingChannel: f.channel || null,
        branchName: f.sourcingBranch || null,
        dsaName: f.channel === "DSA" ? f.channelName : undefined,
        dsaCode: f.channel === "DSA" ? f.channelCode : undefined,
        salesOfficerName: f.channel === "RM" ? f.rmName : undefined,
        salesOfficerCode: f.channel === "RM" ? f.rmCode : undefined,
      },

      coApplicants: f.coApplicants.map((c) => ({
        firstName: c.firstName || null,
        lastName: c.lastName || null,
        mobileNumber: c.mobile || null,
        panNumber: c.pan || null,
      })),

      guarantors: f.guarantors.map((g) => ({
        firstName: g.firstName || null,
        lastName: g.lastName || null,
        mobileNumber: g.mobile || null,
        panNumber: g.pan || null,
      })),

      additionalDetails: {
        addr3: f.addr3 || null,
        asFirstName: f.asFirstName || null,
        asMiddleName: f.asMiddleName || null,
        asLastName: f.asLastName || null,
        asDob: f.asDob || null,
        asDesignation: f.asDesignation || null,
        asMobile: f.asMobile || null,
        asEmail: f.asEmail || null,
        asAadhaar: f.asAadhaar || null,
        asPan: f.asPan || null,
        asAadhaarStatus: f.asAadhaarStatus || null,
        asPanStatus: f.asPanStatus || null,
        asPanAadhaarLinkedStatus: f.asPanAadhaarLinked || null,
        asMobileVerified: f.asMobileVerified,
        asEmailVerified: f.asEmailVerified,
        emailVerified: f.emailVerified,
        urnStatus: f.urnStatus || null,
        bizPanStatus: f.bizPanStatus || null,
        gstinStatus: f.gstinStatus || null,
        shopActStatus: f.shopActStatus || null,
        channelName: f.channelName || null,
        channelCode: f.channelCode || null,
        dsaMobile: f.dsaMobile || null,
        dsaEmail: f.dsaEmail || null,
        rmName: f.rmName || null,
        rmCode: f.rmCode || null,
        ocrDocType: f.ocrDocType || null,
      },
    };
  }, [form]);

  /** Loads a `QdeApplicationRequest`-shaped GET response back into form state. */
  const hydrateFromResponse = useCallback((response) => {
    if (!response || typeof response !== "object") return;

    const kyc = response.kyc || {};
    const applicant = response.applicant || {};
    const current = response.address?.current || {};
    const loan = response.loan || {};
    const sourcing = response.sourcing || {};
    const extra = response.additionalDetails || {};

    const withIds = (list) =>
      (Array.isArray(list) ? list : []).map((p) => ({
        ...emptyParty(),
        firstName: p.firstName || "",
        lastName: p.lastName || "",
        mobile: p.mobileNumber || p.mobile || "",
        pan: p.panNumber || p.pan || "",
      }));

    setForm((prev) => ({
      ...prev,
      applicationNo: response.applicationNumber || response.applicationNo || prev.applicationNo,

      applicationType: response.applicationType || "",
      portfolio: response.portfolio || DEFAULT_PORTFOLIO,
      borrowerType: response.borrowerType || prev.borrowerType,
      customerType: response.customerType || applicant.customerType || prev.customerType,
      customerId: response.customerId || applicant.existingCustomerId || "",

      pan: kyc.panNumber || "",
      panStatus: response.panStatus || prev.panStatus,
      aadhaar: kyc.aadhaarNumber || "",
      aadhaarStatus: response.aadhaarStatus || prev.aadhaarStatus,
      panAadhaarLinked: response.panAadhaarLinkedStatus || prev.panAadhaarLinked,
      ckycNumber: kyc.ckycNumber || "",
      ckycStatus: response.ckycStatus || prev.ckycStatus,
      digiRef: response.digiRef || "",
      digiStatus: response.digiStatus || prev.digiStatus,

      firstName: applicant.firstName || "",
      middleName: applicant.middleName || "",
      lastName: applicant.lastName || "",
      gender: applicant.gender || "",
      dob: applicant.dateOfBirth || "",
      profile: response.borrowerCategory || applicant.category || "",
      fatherName: applicant.fatherName || "",
      motherName: applicant.motherName || "",
      mobile: applicant.mobileNumber || "",
      mobileVerified: Boolean(kyc.mobileVerified),
      email: applicant.email || "",
      emailVerified: Boolean(extra.emailVerified),
      staff: Boolean(response.staff),
      preApproved: Boolean(response.preApproved),

      entityName: response.entityName || "",
      entityType: response.entityType || "",
      doi: response.dateOfIncorporation || "",
      gstRegistered: yn(response.gstRegistered),
      msmeRegistered: yn(response.msmeRegistered),
      urn: response.urn || "",
      urnStatus: extra.urnStatus || prev.urnStatus,
      bizPanStatus: extra.bizPanStatus || prev.bizPanStatus,
      gstin: response.gstin || "",
      gstinStatus: extra.gstinStatus || prev.gstinStatus,
      cin: response.cin || "",
      shopAct: response.shopAct || "",
      shopActStatus: extra.shopActStatus || prev.shopActStatus,

      asFirstName: extra.asFirstName || "",
      asMiddleName: extra.asMiddleName || "",
      asLastName: extra.asLastName || "",
      asDob: extra.asDob || "",
      asDesignation: extra.asDesignation || "",
      asMobile: extra.asMobile || "",
      asMobileVerified: Boolean(extra.asMobileVerified),
      asEmail: extra.asEmail || "",
      asEmailVerified: Boolean(extra.asEmailVerified),
      asAadhaar: extra.asAadhaar || "",
      asAadhaarStatus: extra.asAadhaarStatus || prev.asAadhaarStatus,
      asPan: extra.asPan || "",
      asPanStatus: extra.asPanStatus || prev.asPanStatus,
      asPanAadhaarLinked: extra.asPanAadhaarLinkedStatus || prev.asPanAadhaarLinked,

      addressType: current.addressType || "",
      addr1: current.addressLine1 || "",
      addr2: current.addressLine2 || "",
      addr3: extra.addr3 || "",
      landmark: current.landmark || "",
      pincode: current.pincode || "",
      city: current.city || "",
      district: current.district || "",
      state: current.state || "",
      country: current.country || prev.country,

      coApplicants: withIds(response.coApplicants),
      guarantors: withIds(response.guarantors),

      loanType: response.loanType || loan.loanPurpose || prev.loanType,
      product: loan.productName || "",
      scheme: loan.schemeCode || "",
      loanAmount: loan.requestedAmount != null ? String(loan.requestedAmount) : "",
      tenure: loan.tenureMonths != null ? String(loan.tenureMonths) : "",
      rate: loan.interestRate != null ? String(loan.interestRate) : "",

      channel: sourcing.sourcingChannel || "",
      sourcingBranch: sourcing.branchName || "",
      servicingBranch: response.servicingBranch || "",
      channelName: sourcing.dsaName || extra.channelName || "",
      channelCode: sourcing.dsaCode || extra.channelCode || "",
      dsaMobile: extra.dsaMobile || "",
      dsaEmail: extra.dsaEmail || "",
      rmName: sourcing.salesOfficerName || extra.rmName || "",
      rmCode: sourcing.salesOfficerCode || extra.rmCode || "",

      ocrDocType: extra.ocrDocType || prev.ocrDocType,
    }));
  }, []);

  return useMemo(
    () => ({
      form,
      isNonIndividual,
      setField,
      setFields,
      resetForm,
      buildPayload,
      hydrateFromResponse,
      addCoApplicant,
      removeCoApplicant,
      updateCoApplicant,
      addGuarantor,
      removeGuarantor,
      updateGuarantor,
    }),
    [
      form,
      isNonIndividual,
      setField,
      setFields,
      resetForm,
      buildPayload,
      hydrateFromResponse,
      addCoApplicant,
      removeCoApplicant,
      updateCoApplicant,
      addGuarantor,
      removeGuarantor,
      updateGuarantor,
    ]
  );
};

export default useQuickDataEntryForm;
