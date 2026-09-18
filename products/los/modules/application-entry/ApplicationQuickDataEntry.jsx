import { useCallback, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import { HAxiosService, HBox, HBreadCrumb, HButtonBar, HPaper, TitleBar, useToast } from "@helix/component-library";
import { LosQdeAPI } from "./apiEndpoints";
import { unwrapApiResponse } from "./unwrapApiResponse";
import { VERIFICATION_STATUS } from "./constants/qdeOptions";

import OtpVerifyDialog from "./components/OtpVerifyDialog";
import SearchApplicationDialog from "./components/SearchApplicationDialog";
import BusinessUnitSection from "./sections/BusinessUnitSection";
import OcrUploadSection from "./sections/OcrUploadSection";
import KycCheckSection from "./sections/KycCheckSection";
import ApplicantDetailsSection from "./sections/ApplicantDetailsSection";
import AuthSignatorySection from "./sections/AuthSignatorySection";
import AuthSignatoryKycSection from "./sections/AuthSignatoryKycSection";
import AddressDetailsSection from "./sections/AddressDetailsSection";
import CoApplicantSection from "./sections/CoApplicantSection";
import GuarantorSection from "./sections/GuarantorSection";
import LoanDetailsSection from "./sections/LoanDetailsSection";
import SourcingDetailsSection from "./sections/SourcingDetailsSection";

const { VERIFIED, FAILED } = VERIFICATION_STATUS;
const isPassed = (data) => data?.verified !== false && data?.matched !== false;
const isVerified = (status) => status === VERIFICATION_STATUS.VERIFIED;
const toNumberOrNull = (value) => value === "" || value == null ? null : Number(value);
const yn = (value) =>
  value === true
    ? "Y"
    : value === false
      ? "N"
      : value || "N";

const ORG_ID = "001";
const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const AADHAAR_PATTERN = /^[0-9]{12}$/;
const CIN_PATTERN = /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;
const SHOP_ACT_PATTERN = /^[A-Z0-9][A-Z0-9\s/-]{0,29}$/i;

const unwrapQdePayload = (response) => {
  const unwrapped = unwrapApiResponse(response);
  return (
    unwrapped?.responseJson
    || unwrapped?.data
    || unwrapped
    || response?.responseJson
    || response?.data?.responseJson
    || response?.data?.data
    || {}
  );
};

const validateKycFields = (obj, isNonInd, translate) => {
  const errors = {};
  const message = (id, fallback) => translate(id, fallback);

  if (!obj.pan?.trim() || !PAN_PATTERN.test(obj.pan.trim().toUpperCase())) {
    errors.pan = message("label.qde.validation.panInvalid", "Please enter a valid PAN number.");
  }

  if (!isNonInd && (!obj.aadhaar?.trim() || !AADHAAR_PATTERN.test(obj.aadhaar.trim()))) {
    errors.aadhaar = message("label.qde.validation.aadhaarInvalid", "Please enter a valid 12-digit Aadhaar number.");
  }

  if (isNonInd && (!obj.shopAct?.trim() || !SHOP_ACT_PATTERN.test(obj.shopAct.trim()))) {
    errors.shopAct = message("label.qde.validation.shopActInvalid", "Please enter a valid Shop Act number.");
  }

  if (isNonInd && (!obj.cin?.trim() || !CIN_PATTERN.test(obj.cin.trim().toUpperCase()))) {
    errors.cin = message("label.qde.validation.cinInvalid", "Please enter a valid CIN.");
  }

  return errors;
};

const emptyParty = () => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  borrowerType: "Individual",
  customerType: "New",
  firstName: "",
  lastName: "",
  mobile: "",
  pan: "",
});

const validatePartyFields = (obj, isNonInd, translate) => {
  const errors = {};
  const message = (id, fallback) => translate(id, fallback);

  if (isNonInd) {
    if (!obj.entityName?.trim()) errors.entityName = message("label.qde.validation.entityNameRequired", "Entity name is mandatory.");
    if (!obj.entityType?.trim()) errors.entityType = message("label.qde.validation.entityTypeRequired", "Entity type is mandatory.");
  } else {
    if (!obj.firstName?.trim()) errors.firstName = message("label.qde.validation.firstNameRequired", "First name is mandatory.");
    if (!obj.lastName?.trim()) errors.lastName = message("label.qde.validation.lastNameRequired", "Last name is mandatory.");
    if (!obj.gender?.trim()) errors.gender = message("label.qde.validation.genderRequired", "Please select gender.");
if (!obj.dob) {
  errors.dob = message(
    "label.qde.validation.dobRequired",
    "Please enter a valid date of birth."
  );
} else {
  const dob = new Date(obj.dob);
  const today = new Date();

  dob.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (dob > today) {
    errors.dob = message(
      "label.qde.validation.dobRequired",
      "Please enter a valid date of birth."
    );
  }
 }
    // if (!obj.motherName?.trim()) errors.motherName = message("label.qde.validation.motherNameRequired", "Mother's name is mandatory.");
  }

  if (!obj.mobile?.trim() || obj.mobile.trim().length !== 10) {
    errors.mobile = message("label.qde.validation.mobileInvalid", "Please enter a valid 10-digit mobile number.");
  }
  if (!obj.email?.trim()) {
    errors.email = message("label.qde.validation.emailInvalid", "Please enter a valid email address.");
  }

  if (!obj.addressType?.trim()) errors.addressType = message("label.qde.validation.addressTypeRequired", "Please select an address type.");
  if (!obj.addr1?.trim()) {
    errors.addr1 = message("label.qde.validation.addressLine1Required", "Address line 1 is mandatory.");
  } else if (obj.addr1.trim().length > 100) {
    errors.addr1 = message("label.qde.validation.addressLine1Max", "Address line 1 cannot exceed 100 characters.");
  }
  // Landmark is only mandatory for Individual parties (kept from the original rule).
  if (!isNonInd && !obj.landmark?.trim()) {
    errors.landmark = message("label.qde.validation.landmarkRequired", "Landmark is mandatory.");
  }
  if (!obj.pincode || String(obj.pincode).trim().length !== 6) {
    errors.pincode = message("label.qde.validation.pincodeInvalid", "Please enter a valid 6-digit PIN code.");
  }

  if (isNonInd) {
    if (!obj.asFirstName?.trim()) errors.asFirstName = message("label.qde.validation.asFirstNameRequired", "Authorised signatory first name is mandatory.");
    if (!obj.asLastName?.trim()) errors.asLastName = message("label.qde.validation.asLastNameRequired", "Authorised signatory last name is mandatory.");
    if (!obj.asDob) errors.asDob = message("label.qde.validation.asDobRequired", "Authorised signatory date of birth is mandatory.");
    if (!obj.asDesignation?.trim()) errors.asDesignation = message("label.qde.validation.asDesignationRequired", "Authorised signatory designation is mandatory.");
    if (!obj.asMobile?.trim() || obj.asMobile.trim().length !== 10) {
      errors.asMobile = message("label.qde.validation.asMobileInvalid", "Please enter a valid 10-digit authorised signatory mobile number.");
    }
    if (!obj.asEmail?.trim()) errors.asEmail = message("label.qde.validation.asEmailRequired", "Authorised signatory email is mandatory.");
    if (!obj.asAadhaar?.trim() || !AADHAAR_PATTERN.test(obj.asAadhaar.trim())) {
      errors.asAadhaar = message("label.qde.validation.aadhaarInvalid", "Please enter a valid 12-digit Aadhaar number.");
    }
    if (!obj.asPan?.trim() || !PAN_PATTERN.test(obj.asPan.trim().toUpperCase())) {
      errors.asPan = message("label.qde.validation.panInvalid", "Please enter a valid PAN number.");
    }
  }

  Object.assign(errors, validateKycFields(obj, isNonInd, translate));
  return errors;
};

const ApplicationQuickDataEntry = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const screenMenuId = location.state?.menuId;
  const incomingApplicationNo = location.state?.applicationNo;

  // Default: New + Individual, so only the Individual field set is visible on first render.
  const [form, setForm] = useState({
    borrowerType: "Individual",
    customerType: "New",
  });

  const [verifying, setVerifying] = useState({});
  const [otpDialog, setOtpDialog] = useState({
    open: false,
    field: "",
    target: "",
  });
  const [ocrFileName, setOcrFileName] = useState("");
  const [ocrStatusKey, setOcrStatusKey] = useState("label.qde.status.notStarted");

  // Field-level validation errors, wired down into each section that needs them.
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({
    applicant: {},
    coApplicants: {},
    guarantors: {},
  });
  const persistedDraftRef = useRef(false);

  const isNonIndividual = form.borrowerType === "Non-Individual";

  // Dynamic field setter
  const setField = useCallback((name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setForm({ borrowerType: "Individual", customerType: "New" });
  }, []);

  const addCoApplicant = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      coApplicants: [
        ...(prev.coApplicants || []),
        emptyParty(),
      ],
    }));
  }, []);

  const removeCoApplicant = useCallback((id) => {
    setForm((prev) => ({
      ...prev,
      coApplicants: (prev.coApplicants || []).filter(
        (c) => c.id !== id
      ),
    }));
    setFormErrors((prev) => {
      const next = { ...prev.coApplicants };
      delete next[id];
      return { ...prev, coApplicants: next };
    });
  }, []);

  const updateCoApplicant = useCallback(
    (id, field, value) => {
      setForm((prev) => ({
        ...prev,
        coApplicants: (prev.coApplicants || []).map((c) =>
          c.id === id
            ? { ...c, [field]: value }
            : c
        ),
      }));
    },
    []
  );

  const addGuarantor = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      guarantors: [
        ...(prev.guarantors || []),
        emptyParty(),
      ],
    }));
  }, []);

  const removeGuarantor = useCallback((id) => {
    setForm((prev) => ({
      ...prev,
      guarantors: (prev.guarantors || []).filter(
        (g) => g.id !== id
      ),
    }));
    setFormErrors((prev) => {
      const next = { ...prev.guarantors };
      delete next[id];
      return { ...prev, guarantors: next };
    });
  }, []);

  const updateGuarantor = useCallback(
    (id, field, value) => {
      setForm((prev) => ({
        ...prev,
        guarantors: (prev.guarantors || []).map((g) =>
          g.id === id
            ? { ...g, [field]: value }
            : g
        ),
      }));
    },
    []
  );

  const mapParty = (p, relationship = null) => {
    const isNonInd = p.borrowerType === "Non-Individual";
    return {
      szApplicantId: null,
      szBorrowerType: isNonInd ? "NON_INDIVIDUAL" : "INDIVIDUAL",
      szCustomerType: "NEW",
      szCustomerId: null,
      szRelationshipWithPrimaryApplicant: p.relationship || relationship,

      individualDetails: isNonInd ? null : {
        szFirstName: p.firstName || null,
        szMiddleName: p.middleName || null,
        szLastName: p.lastName || null,
        szGender: p.gender || null,
        dtDateOfBirth: p.dob || null,
        szFatherName: p.fatherName || null,
        szMotherName: p.motherName || null,
        szApplicantCategory: p.category || null,
        szStaffYn: yn(p.staff),
        szPreApprovedYn: yn(p.preApproved),
      },

      nonIndividualDetails: isNonInd ? {
        szEntityName: p.entityName || null,
        szEntityType: p.entityType || null,
        dtDateofIncorporation: p.doi || null,
        szGstRegYn: p.gstRegistered || "N",
        szMsmeRegYn: p.msmeRegistered || "N",
      } : null,

      szMobile: p.mobile || null,
      szEmail: p.email || null,

      kycDetails: {
        szPanNumber: p.pan || null,
        szUrnNo: p.urn || null,
        szAadhaarNumber: isNonInd ? null : (p.aadhaar || null),
        szPanVerificationStatus: null,
        szPanAadhaarLinkageStatus: null,
        szCkycNumber: isNonInd ? null : (p.ckycNumber || null),
        szCkycVerificationStatus: null,
        szDigiLockerDocumentId: isNonInd ? null : (p.digiRef || null),
        szDigiLockerVerificationStatus: null,
        szAadhaarVerificationStatus: null,
        szAadhaarOtpReference: null,
        szGstNumber: isNonInd ? (p.gstin || null) : null,
        szCin: isNonInd ? (p.cin || null) : null,
        szShopAct: isNonInd ? (p.shopAct || null) : null,
      },

      address: {
        szAddressType: p.addressType || null,
        szAddressLine1: p.addr1 || null,
        szAddressLine2: p.addr2 || null,
        szAddressLine3: p.addr3 || null,
        szLandmark: p.landmark || null,
        iPincode: toNumberOrNull(p.pincode),
        szCity: p.city || null,
        szDistrict: p.district || null,
        szState: p.state || null,
        szCountry: p.country || "INDIA",
      },

      authorisedSignatory: isNonInd ? {
        szAuthFn: p.asFirstName || null,
        szAuthMn: p.asMiddleName || null,
        szAuthLn: p.asLastName || null,
        dtAuthDob: p.asDob || null,
        szAuthDsgn: p.asDesignation || null,
        szAuthMobile: p.asMobile || null,
        szAuthMail: p.asEmail || null,
      } : null,

      authorisedSignatoryKyc: isNonInd ? {
        szAuthSignatoryAadhaar: p.asAadhaar || null,
        szAuthSignatoryPAN: p.asPan || null,
      } : null,
    };
  };

  const buildPayload = useCallback(() => {
    const f = form;
    const borrowerTypeCode = f.borrowerType === "Individual" ? "INDIVIDUAL" : "NON_INDIVIDUAL";
    const customerTypeCode = f.customerType === "Existing" ? "EXISTING" : "NEW";

    return {
      szOrgId: "001",
      szApplicationNo: f.applicationNo || null,

      applicationControl: {
        szApplicationType: f.applicationType || null,
        szPortfolioCode: f.portfolio || null,
        szBorrowerType: borrowerTypeCode,
        szCustomerType: customerTypeCode,
      },

      applicantDetails: {
        szApplicantId: null,
        szBorrowerType: borrowerTypeCode,
        szCustomerType: customerTypeCode,
        szCustomerId: customerTypeCode === "EXISTING" ? (f.customerId || null) : null,
        szRelationshipWithPrimaryApplicant: null,

        individualDetails: isNonIndividual ? null : {
          szFirstName: f.firstName || null,
          szMiddleName: f.middleName || null,
          szLastName: f.lastName || null,
          szGender: f.gender || null,
          dtDateOfBirth: f.dob || null,
          szFatherName: f.fatherName || null,
          szMotherName: f.motherName || null,
          szApplicantCategory: f.profile || null,
          szStaffYn: yn(f.staff),
          szPreApprovedYn: yn(f.preApproved),
        },

        nonIndividualDetails: isNonIndividual ? {
          szEntityName: f.entityName || null,
          szEntityType: f.entityType || null,
          dtDateofIncorporation: f.doi || null,
          szGstRegYn: yn(f.gstRegistered === "Y"),
          szMsmeRegYn: yn(f.msmeRegistered === "Y"),
        } : null,

        szMobile: f.mobile || null,
        szEmail: f.email || null,

        kycDetails: {
          szPanNumber: f.pan || null,
          szUrnNo: f.urn || null,
          szAadhaarNumber: f.aadhaar || null,
          szPanVerificationStatus: f.panStatus || null,
          szPanAadhaarLinkageStatus: f.panAadhaarLinked || null,
          szCkycNumber: f.ckycNumber || null,
          szCkycVerificationStatus: f.ckycStatus || null,
          szDigiLockerDocumentId: f.digiRef || null,
          szDigiLockerVerificationStatus: f.digiStatus || null,
          szAadhaarVerificationStatus: f.aadhaarStatus || null,
          szAadhaarOtpReference: null,
          szGstNumber: f.gstin || null,
          szCin: f.cin || null,
          szShopAct: f.shopAct || null,
        },

        address: {
          szAddressType: f.addressType || null,
          szAddressLine1: f.addr1 || null,
          szAddressLine2: f.addr2 || null,
          szAddressLine3: f.addr3 || null,
          szLandmark: f.landmark || null,
          iPincode: toNumberOrNull(f.pincode),
          szCity: f.city || null,
          szDistrict: f.district || null,
          szState: f.state || null,
          szCountry: f.country || "INDIA",
        },

        authorisedSignatory: isNonIndividual ? {
          szAuthFn: f.asFirstName || null,
          szAuthMn: f.asMiddleName || null,
          szAuthLn: f.asLastName || null,
          dtAuthDob: f.asDob || null,
          szAuthDsgn: f.asDesignation || null,
          szAuthMobile: f.asMobile || null,
          szAuthMail: f.asEmail || null,
        } : null,

        authorisedSignatoryKyc: isNonIndividual ? {
          szAuthSignatoryAadhaar: f.asAadhaar || null,
          szAuthSignatoryPAN: f.asPan || null,
        } : null,
      },

      coApplicants: (f.coApplicants || []).map((p) => mapParty(p)),
      guarantors: (f.guarantors || []).map((p) => mapParty(p, "GUARANTOR")),

      loanDetails: {
        szLoanType: f.loanType || null,
        szProductCode: f.product || null,
        szSchemeCode: f.scheme || null,
        fAppliedAmount: toNumberOrNull(f.loanAmount),
        iAppliedTenor: toNumberOrNull(f.tenure),
        szTenorUnit: "MONTH",
        fInterestRate: toNumberOrNull(f.rate),
        szCurrencyCode: "INR",
      },

      sourcingDetails: {
        szSourcingChannel: f.channel || null,
        szSourcingBranch: f.sourcingBranch || null,
        szServicingBranch: f.servicingBranch || null,
        szSrcChannelUsrId:f.dealerName || f.rmName || f.dsaName || null,
        szSrcChannelCode: f.dealerCode || f.rmCode || f.dsaCode || null,
        szDsaMobile: f.dsaMobile || null,
        szDsaEmail: f.dsaEmail || null,
      },
    };
  }, [form, isNonIndividual]);

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
        borrowerType: p.borrowerType === "Non-Individual" ? "Non-Individual" : "Individual",
        firstName: p.firstName || "",
        lastName: p.lastName || "",
        mobile: p.mobileNumber || p.mobile || "",
        pan: p.panNumber || p.pan || "",
      }));

    setForm((prev) => ({
      ...prev,
      applicationNo: response.applicationNumber || response.applicationNo || prev.applicationNo,
      applicationType: response.applicationType || "",
      portfolio: response.portfolio || null,
      borrowerType: response.borrowerType || prev.borrowerType,
      customerType: response.customerType || applicant.customerType || prev.customerType,
      customerId: response.customerId || applicant.existingCustomerId || "",

      pan: kyc.panNumber || "",
      panStatus: response.panStatus || null,
      aadhaar: kyc.aadhaarNumber || "",
      aadhaarStatus: response.aadhaarStatus || null,
      panAadhaarLinked: response.panAadhaarLinkedStatus || null,
      ckycNumber: kyc.ckycNumber || "",
      ckycStatus: response.ckycStatus || null,
      digiRef: response.digiRef || "",
      digiStatus: response.digiStatus || null,

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
      urnStatus: extra.urnStatus || null,
      bizPanStatus: extra.bizPanStatus || null,
      gstin: response.gstin || "",
      gstinStatus: extra.gstinStatus || null,
      cin: response.cin || "",
      shopAct: response.shopAct || "",
      shopActStatus: extra.shopActStatus || null,

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
      asAadhaarStatus: extra.asAadhaarStatus || null,
      asPan: extra.asPan || "",
      asPanStatus: extra.asPanStatus || null,
      asPanAadhaarLinked: extra.asPanAadhaarLinkedStatus || null,

      addressType: current.addressType || "",
      addr1: current.addressLine1 || "",
      addr2: current.addressLine2 || "",
      addr3: extra.addr3 || "",
      landmark: current.landmark || "",
      pincode: current.pincode || "",
      city: current.city || "",
      district: current.district || "",
      state: current.state || "",
      country: current.country || "India",

      coApplicants: withIds(response.coApplicants),
      guarantors: withIds(response.guarantors),

      loanType: response.loanType || loan.loanPurpose || null,
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

      ocrDocType: extra.ocrDocType || null,
    }));
  }, []);

  /** Maps a party of the fetchQde response (QdeWrapperDto shape) into form party state. */
  const partyFromQde = useCallback((party) => {
    const individual = party?.individualDetails || {};
    const entity = party?.nonIndividualDetails || {};
    const kyc = party?.kycDetails || {};
    const address = party?.address || {};
    const signatory = party?.authorisedSignatory || {};
    const signatoryKyc = party?.authorisedSignatoryKyc || {};
    const isNonInd = party?.szBorrowerType === "NON_INDIVIDUAL";

    return {
      ...emptyParty(),
      applicantId: party?.szApplicantId || "",
      borrowerType: isNonInd ? "Non-Individual" : "Individual",
      customerType: party?.szCustomerType === "EXISTING" ? "Existing" : "New",
      customerId: party?.szCustomerId || "",
      relationship: party?.szRelationshipWithPrimaryApplicant || "",

      firstName: individual.szFirstName || "",
      middleName: individual.szMiddleName || "",
      lastName: individual.szLastName || "",
      gender: individual.szGender || "",
      dob: individual.dtDateOfBirth || "",
      fatherName: individual.szFatherName || "",
      motherName: individual.szMotherName || "",
      category: individual.szApplicantCategory || "",
      staff: individual.szStaffYn === "Y",
      preApproved: individual.szPreApprovedYn === "Y",

      entityName: entity.szEntityName || "",
      entityType: entity.szEntityType || "",
      doi: entity.dtDateofIncorporation || "",
      gstRegistered: entity.szGstRegYn || "N",
      msmeRegistered: entity.szMsmeRegYn || "N",

      mobile: party?.szMobile || "",
      email: party?.szEmail || "",

      pan: kyc.szPanNumber || "",
      urn: kyc.szUrnNo || "",
      aadhaar: kyc.szAadhaarNumber || "",
      ckycNumber: kyc.szCkycNumber || "",
      digiRef: kyc.szDigiLockerDocumentId || "",
      gstin: kyc.szGstNumber || "",
      cin: kyc.szCin || "",
      shopAct: kyc.szShopAct || "",

      addressType: address.szAddressType || "",
      addr1: address.szAddressLine1 || "",
      addr2: address.szAddressLine2 || "",
      addr3: address.szAddressLine3 || "",
      landmark: address.szLandmark || "",
      pincode: address.iPincode != null ? String(address.iPincode) : "",
      city: address.szCity || "",
      district: address.szDistrict || "",
      state: address.szState || "",
      country: address.szCountry || "INDIA",

      asFirstName: signatory.szAuthFn || "",
      asMiddleName: signatory.szAuthMn || "",
      asLastName: signatory.szAuthLn || "",
      asDob: signatory.dtAuthDob || "",
      asDesignation: signatory.szAuthDsgn || "",
      asMobile: signatory.szAuthMobile || "",
      asEmail: signatory.szAuthMail || "",
      asAadhaar: signatoryKyc.szAuthSignatoryAadhaar || "",
      asPan: signatoryKyc.szAuthSignatoryPAN || "",
    };
  }, []);

  /** Loads the QdeWrapperDto returned by GET /los/fetchQde/{orgId}/{appNo} into form state. */
  const hydrateFromQdeResponse = useCallback((response) => {
    if (!response || typeof response !== "object") return;

    const control = response.applicationControl || {};
    const applicant = response.applicantDetails || {};
    const individual = applicant.individualDetails || {};
    const entity = applicant.nonIndividualDetails || {};
    const kyc = applicant.kycDetails || {};
    const address = applicant.address || {};
    const signatory = applicant.authorisedSignatory || {};
    const signatoryKyc = applicant.authorisedSignatoryKyc || {};
    const loan = response.loanDetails || {};
    const sourcing = response.sourcingDetails || {};

    setForm((prev) => ({
      ...prev,
      applicationNo: response.szApplicationNo || prev.applicationNo,
      applicationType: control.szApplicationType || "",
      portfolio: control.szPortfolioCode || null,
      borrowerType: control.szBorrowerType === "NON_INDIVIDUAL" ? "Non-Individual" : "Individual",
      customerType: control.szCustomerType === "EXISTING" ? "Existing" : "New",
      customerId: applicant.szCustomerId || "",
      applicantId: applicant.szApplicantId || "",

      firstName: individual.szFirstName || "",
      middleName: individual.szMiddleName || "",
      lastName: individual.szLastName || "",
      gender: individual.szGender || "",
      dob: individual.dtDateOfBirth || "",
      fatherName: individual.szFatherName || "",
      motherName: individual.szMotherName || "",
      profile: individual.szApplicantCategory || "",
      staff: individual.szStaffYn === "Y",
      preApproved: individual.szPreApprovedYn === "Y",

      entityName: entity.szEntityName || "",
      entityType: entity.szEntityType || "",
      doi: entity.dtDateofIncorporation || "",
      gstRegistered: entity.szGstRegYn || "N",
      msmeRegistered: entity.szMsmeRegYn || "N",

      mobile: applicant.szMobile || "",
      email: applicant.szEmail || "",

      pan: kyc.szPanNumber || "",
      panStatus: kyc.szPanVerificationStatus || null,
      panAadhaarLinked: kyc.szPanAadhaarLinkageStatus || null,
      aadhaar: kyc.szAadhaarNumber || "",
      aadhaarStatus: kyc.szAadhaarVerificationStatus || null,
      ckycNumber: kyc.szCkycNumber || "",
      ckycStatus: kyc.szCkycVerificationStatus || null,
      digiRef: kyc.szDigiLockerDocumentId || "",
      digiStatus: kyc.szDigiLockerVerificationStatus || null,
      urn: kyc.szUrnNo || "",
      gstin: kyc.szGstNumber || "",
      cin: kyc.szCin || "",
      shopAct: kyc.szShopAct || "",

      addressType: address.szAddressType || "",
      addr1: address.szAddressLine1 || "",
      addr2: address.szAddressLine2 || "",
      addr3: address.szAddressLine3 || "",
      landmark: address.szLandmark || "",
      pincode: address.iPincode != null ? String(address.iPincode) : "",
      city: address.szCity || "",
      district: address.szDistrict || "",
      state: address.szState || "",
      country: address.szCountry || "INDIA",

      asFirstName: signatory.szAuthFn || "",
      asMiddleName: signatory.szAuthMn || "",
      asLastName: signatory.szAuthLn || "",
      asDob: signatory.dtAuthDob || "",
      asDesignation: signatory.szAuthDsgn || "",
      asMobile: signatory.szAuthMobile || "",
      asEmail: signatory.szAuthMail || "",
      asAadhaar: signatoryKyc.szAuthSignatoryAadhaar || "",
      asPan: signatoryKyc.szAuthSignatoryPAN || "",

      coApplicants: (Array.isArray(response.coApplicants) ? response.coApplicants : []).map(partyFromQde),
      guarantors: (Array.isArray(response.guarantors) ? response.guarantors : []).map(partyFromQde),

      loanType: loan.szLoanType || null,
      product: loan.szProductCode || "",
      scheme: loan.szSchemeCode || "",
      loanAmount: loan.fAppliedAmount != null ? String(loan.fAppliedAmount) : "",
      tenure: loan.iAppliedTenor != null ? String(loan.iAppliedTenor) : "",
      rate: loan.fInterestRate != null ? String(loan.fInterestRate) : "",

      channel: sourcing.szSourcingChannel || "",
      sourcingBranch: sourcing.szSourcingBranch || "",
      servicingBranch: sourcing.szServicingBranch || "",
    }));
  }, [partyFromQde]);

  const t = useCallback(
    (id, defaultMessage) => intl.formatMessage({ id, defaultMessage }),
    [intl]
  );

  const setBusy = useCallback((key, value) => {
    setVerifying((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    if (!incomingApplicationNo) return;
    persistedDraftRef.current = false;
    HAxiosService.GET(LosQdeAPI.getByAppNo(incomingApplicationNo))
      .then((res) => hydrateFromResponse(unwrapQdePayload(res)))
      .catch(() => toast.error(t("label.qde.msg.loadFailed", "Unable to load application")));
  }, [incomingApplicationNo, hydrateFromResponse, t, toast]);

  /**
   * "Search Existing Applications" pop search. Loads the matching application into the form,
   * searching by application number, mobile number or Aadhaar number.
   */
  const handleSearchApplications = useCallback(
    async ({ applicationNo, mobile, aadhaar }) => {
      const appNo = (applicationNo || "").trim();
      const mobileNo = (mobile || "").trim();
      const aadhaarNo = (aadhaar || "").trim();

      const url = appNo
        ? LosQdeAPI.fetchQde(ORG_ID, appNo)
        : mobileNo
          ? LosQdeAPI.fetchQdeByMobile(ORG_ID, mobileNo)
          : aadhaarNo
            ? LosQdeAPI.fetchQdeByAadhaar(ORG_ID, aadhaarNo)
            : null;

      if (!url) {
        toast.error(
          t(
            "label.qde.msg.searchCriteriaRequired",
            "Enter an application number, mobile number or Aadhaar number."
          )
        );
        return;
      }

      setBusy("appSearch", true);
      try {
        const data = unwrapQdePayload(await HAxiosService.GET(url));
        persistedDraftRef.current = false;
        hydrateFromQdeResponse(data);
        setSearchDialogOpen(false);
        const loadedAppNo = data?.szApplicationNo || appNo;
        toast.success(
          `${t("label.qde.msg.applicationLoaded", "Application loaded")}${loadedAppNo ? ` - ${loadedAppNo}` : ""}`
        );
      } catch (error) {
        toast.error(error?.message || t("label.qde.msg.applicationNotFound", "Application not found"));
      } finally {
        setBusy("appSearch", false);
      }
    },
    [hydrateFromQdeResponse, setBusy, t, toast]
  );

  const runVerification = useCallback(
    async (key, url, payload, statusField, onSuccess) => {
      setBusy(key, true);
      try {
        const data = unwrapApiResponse(await HAxiosService.POST(url, payload));
        const passed = isPassed(data);
        if (statusField) setField(statusField, passed ? VERIFIED : FAILED);
        if (passed) {
          onSuccess?.(data);
          toast.success(t("label.qde.msg.verifySuccess", "Verification successful"));
        } else {
          toast.error(t("label.qde.msg.verifyFailed", "Verification failed"));
        }
        return passed;
      } catch (error) {
        if (statusField) setField(statusField, FAILED);
        toast.error(error?.message || t("label.qde.msg.verifyFailed", "Verification failed"));
        return false;
      } finally {
        setBusy(key, false);
      }
    },
    [setBusy, setField, t, toast]
  );

  const sendOtp = useCallback(
    async (key, url, payload, sentField) => {
      setBusy(key, true);
      try {
        unwrapApiResponse(await HAxiosService.POST(url, payload));
        if (sentField) setField(sentField, true);
        toast.success(t("label.qde.msg.otpSent", "OTP sent successfully"));
        return true;
      } catch (error) {
        toast.error(error?.message || t("label.qde.msg.otpFailed", "Unable to send OTP"));
        return false;
      } finally {
        setBusy(key, false);
      }
    },
    [setBusy, setField, t, toast]
  );

  const updatePartyField = useCallback((party, name, value) => {
    setForm((prev) => ({
      ...prev,
      coApplicants: (prev.coApplicants || []).map((item) => item.id === party.id ? { ...item, [name]: value } : item),
      guarantors: (prev.guarantors || []).map((item) => item.id === party.id ? { ...item, [name]: value } : item),
    }));
  }, []);

  const runPartyVerification = useCallback(async (party, key, url, payload, statusField) => {
    const busyKey = `${party.id}:${key}`;
    setBusy(busyKey, true);
    try {
      const data = unwrapApiResponse(await HAxiosService.POST(url, payload));
      const passed = isPassed(data);
      updatePartyField(party, statusField, passed ? VERIFIED : FAILED);
      toast[passed ? "success" : "error"](t(
        passed ? "label.qde.msg.verifySuccess" : "label.qde.msg.verifyFailed",
        passed ? "Verification successful" : "Verification failed"
      ));
      return passed;
    } catch (error) {
      updatePartyField(party, statusField, FAILED);
      toast.error(error?.message || t("label.qde.msg.verifyFailed", "Verification failed"));
      return false;
    } finally {
      setBusy(busyKey, false);
    }
  }, [setBusy, t, toast, updatePartyField]);

  const sendPartyOtp = useCallback(async (party, key, url, payload, sentField) => {
    const busyKey = `${party.id}:${key}`;
    setBusy(busyKey, true);
    try {
      unwrapApiResponse(await HAxiosService.POST(url, payload));
      updatePartyField(party, sentField, true);
      toast.success(t("label.qde.msg.otpSent", "OTP sent successfully"));
      return true;
    } catch (error) {
      toast.error(error?.message || t("label.qde.msg.otpFailed", "Unable to send OTP"));
      return false;
    } finally {
      setBusy(busyKey, false);
    }
  }, [setBusy, t, toast, updatePartyField]);

  const isPartyBusy = useCallback((party, key) => Boolean(verifying[`${party.id}:${key}`]), [verifying]);

  const partyKycHandlers = {
    onVerifyPan: (party) => runPartyVerification(party, "pan", LosQdeAPI.verifyPan(), { panNumber: party.pan }, "panStatus"),
    onSendAadhaarOtp: (party) => sendPartyOtp(party, "aadhaarSend", LosQdeAPI.aadhaarOtpSend(), { aadhaarNumber: party.aadhaar }, "aadhaarOtpSent"),
    onValidateAadhaarOtp: (party) => runPartyVerification(party, "aadhaarValidate", LosQdeAPI.aadhaarOtpValidate(), { aadhaarNumber: party.aadhaar, otp: party.aadhaarOtp }, "aadhaarStatus"),
    onCheckPanAadhaarLink: (party) => runPartyVerification(party, "panAadhaar", LosQdeAPI.panAadhaarLinkage(), { panNumber: party.pan, aadhaarNumber: party.aadhaar }, "panAadhaarLinked"),
    onSendCkycOtp: (party) => sendPartyOtp(party, "ckycSend", LosQdeAPI.ckycOtpSend(), { ckycNumber: party.ckycNumber }, "ckycOtpSent"),
    onValidateCkycOtp: (party) => runPartyVerification(party, "ckycValidate", LosQdeAPI.ckycOtpValidate(), { ckycNumber: party.ckycNumber, otp: party.ckycOtp }, "ckycStatus"),
    onVerifyBusinessPan: (party) => runPartyVerification(party, "bizPan", LosQdeAPI.verifyPan(), { panNumber: party.pan, entityPan: true }, "bizPanStatus"),
    onVerifyGstin: (party) => runPartyVerification(party, "gstin", LosQdeAPI.verifyPan(), { gstin: party.gstin, panNumber: party.pan }, "gstinStatus"),
    onVerifyShopAct: (party) => runPartyVerification(party, "shopAct", LosQdeAPI.verifyPan(), { shopAct: party.shopAct, panNumber: party.pan }, "shopActStatus"),
    onTriggerCkyc: (party) => runPartyVerification(party, "ckycTrigger", LosQdeAPI.verifyPan(), { ckycNumber: party.ckycNumber, panNumber: party.pan }, "ckycStatus"),
    verifyingPan: (party) => isPartyBusy(party, "pan"),
    verifyingBizPan: (party) => isPartyBusy(party, "bizPan"),
    verifyingGstin: (party) => isPartyBusy(party, "gstin"),
    verifyingShopAct: (party) => isPartyBusy(party, "shopAct"),
    verifyingCkyc: (party) => isPartyBusy(party, "ckycTrigger"),
    verifyingAadhaarSend: (party) => isPartyBusy(party, "aadhaarSend"),
    verifyingAadhaarValidate: (party) => isPartyBusy(party, "aadhaarValidate"),
    verifyingPanAadhaar: (party) => isPartyBusy(party, "panAadhaar"),
    verifyingCkycSend: (party) => isPartyBusy(party, "ckycSend"),
    verifyingCkycValidate: (party) => isPartyBusy(party, "ckycValidate"),
  };

  /** Guards a verification trigger that needs its identifier filled in first. */
  const requireValue = useCallback(
    (value, messageId, defaultMessage) => {
      if (value) return true;
      toast.error(t(messageId, defaultMessage));
      return false;
    },
    [t, toast]
  );

  // ---- KYC handlers (individual) -------------------------------------------

  const handleVerifyPan = () => {
    if (!requireValue(form.pan, "label.qde.msg.enterPan", "Enter a PAN number first")) return undefined;
    return runVerification("pan", LosQdeAPI.verifyPan(), { panNumber: form.pan }, "panStatus");
  };

  const handleSendAadhaarOtp = () => {
    if (!requireValue(form.aadhaar, "label.qde.msg.enterAadhaar", "Enter an Aadhaar number first")) {
      return undefined;
    }
    return sendOtp(
      "aadhaarSend",
      LosQdeAPI.aadhaarOtpSend(),
      { aadhaarNumber: form.aadhaar },
      "aadhaarOtpSent"
    );
  };

  const handleValidateAadhaarOtp = () =>
    runVerification(
      "aadhaarValidate",
      LosQdeAPI.aadhaarOtpValidate(),
      { aadhaarNumber: form.aadhaar, otp: form.aadhaarOtp },
      "aadhaarStatus"
    );

  const handleCheckPanAadhaarLink = () =>
    runVerification(
      "panAadhaar",
      LosQdeAPI.panAadhaarLinkage(),
      { panNumber: form.pan, aadhaarNumber: form.aadhaar },
      "panAadhaarLinked"
    );

  const handleTriggerCkyc = () =>
    runVerification(
      "ckycTrigger",
      LosQdeAPI.ckycTrigger(),
      { ckycNumber: form.ckycNumber, panNumber: form.pan },
      "ckycStatus",
      (data) => {
        if (data?.ckycNumber) setField("ckycNumber", data.ckycNumber);
      }
    );

  const handleSendCkycOtp = () => {
    if (!requireValue(form.ckycNumber, "label.qde.msg.enterCkyc", "Enter a CKYC number first")) {
      return undefined;
    }
    return sendOtp("ckycSend", LosQdeAPI.ckycOtpSend(), { ckycNumber: form.ckycNumber }, "ckycOtpSent");
  };

  const handleValidateCkycOtp = () =>
    runVerification(
      "ckycValidate",
      LosQdeAPI.ckycOtpValidate(),
      { ckycNumber: form.ckycNumber, otp: form.ckycOtp },
      "ckycStatus"
    );

  const handleDigilocker = () => {
    if (!requireValue(form.digiRef || form.mobile, "label.qde.msg.enterDigiRef", "Enter DigiLocker reference or mobile first")) {
      return undefined;
    }
    return runVerification(
      "digilocker",
      LosQdeAPI.digilocker(),
      {
        mobileNumber: form.mobile || null,
        referenceNumber: form.digiRef || null,
        aadhaarNumber: form.aadhaar || null,
      },
      "digiStatus",
      (data) => {
        if (data?.referenceNumber) setField("digiRef", data.referenceNumber);
      }
    );
  };

  // ---- KYC handlers (non-individual) ---------------------------------------

  const handleVerifyBusinessPan = () =>
    runVerification("bizPan", LosQdeAPI.verifyPan(), { panNumber: form.pan, entityPan: true }, "bizPanStatus");

  const handleVerifyGstin = () =>
    runVerification("gstin", LosQdeAPI.verifyPan(), { gstin: form.gstin, panNumber: form.pan }, "gstinStatus");

  const handleVerifyUrn = () =>
    runVerification("urn", LosQdeAPI.verifyPan(), { urn: form.urn, panNumber: form.pan }, "urnStatus");

  const handleVerifyShopAct = () =>
    runVerification("shopAct", LosQdeAPI.verifyPan(), { shopAct: form.shopAct, panNumber: form.pan }, "shopActStatus");

  // ---- Authorised signatory KYC --------------------------------------------

  const handleVerifyAsPan = () =>
    runVerification("asPan", LosQdeAPI.verifyPan(), { panNumber: form.asPan }, "asPanStatus");

  const handleSendAsAadhaarOtp = () =>
    sendOtp(
      "asAadhaarSend",
      LosQdeAPI.aadhaarOtpSend(),
      { aadhaarNumber: form.asAadhaar },
      "asAadhaarOtpSent"
    );

  const handleValidateAsAadhaarOtp = () =>
    runVerification(
      "asAadhaarValidate",
      LosQdeAPI.aadhaarOtpValidate(),
      { aadhaarNumber: form.asAadhaar, otp: form.asAadhaarOtp },
      "asAadhaarStatus"
    );

  const handleCheckAsPanAadhaarLink = () =>
    runVerification(
      "asPanAadhaar",
      LosQdeAPI.panAadhaarLinkage(),
      { panNumber: form.asPan, aadhaarNumber: form.asAadhaar },
      "asPanAadhaarLinked"
    );

  // ---- Mobile OTP ----------------------------------------------------------

  const openMobileOtp = useCallback(
    async (field, mobileNumber) => {
      if (!requireValue(mobileNumber, "label.qde.msg.enterMobile", "Enter a mobile number first")) return;
      const sent = await sendOtp("mobileSend", LosQdeAPI.mobileOtpSend(), { mobileNumber });
      if (sent) setOtpDialog({ open: true, field, target: mobileNumber });
    },
    [requireValue, sendOtp]
  );

  const handleValidateMobileOtp = useCallback(
    async (otp) => {
      const { field, target } = otpDialog;
      setBusy("mobileValidate", true);
      try {
        const data = unwrapApiResponse(
          await HAxiosService.POST(LosQdeAPI.mobileOtpValidate(), { mobileNumber: target, otp })
        );
        const passed = isPassed(data);
        setField(field === "asMobile" ? "asMobileVerified" : "mobileVerified", passed);
        if (passed) {
          toast.success(t("label.qde.msg.verifySuccess", "Verification successful"));
          setOtpDialog({ open: false, field: "", target: "" });
        } else {
          toast.error(t("label.qde.msg.verifyFailed", "Verification failed"));
        }
      } catch (error) {
        toast.error(error?.message || t("label.qde.msg.verifyFailed", "Verification failed"));
      } finally {
        setBusy("mobileValidate", false);
      }
    },
    [otpDialog, setBusy, setField, t, toast]
  );

  // ---- Pincode -------------------------------------------------------------

  // const handlePincodeLookup = useCallback(
  //   async (pincode) => {
  //     if (!pincode || String(pincode).length !== 6) return;
  //     try {
  //       const data = unwrapApiResponse(await HAxiosService.GET(LosQdeAPI.pincode(pincode)));
  //       if (!data) return;
  //       setFields({
  //         city: data.city || "",
  //         district: data.district || "",
  //         state: data.state || "",
  //         country: data.country || "India",
  //       });
  //     } catch {
  //       toast.error(t("label.qde.msg.pincodeFailed", "Unable to fetch pincode details"));
  //     }
  //   },
  //   [setFields, t, toast]
  // );

  // ---- OCR -----------------------------------------------------------------

  const handleFileSelect = useCallback((file) => {
    setOcrFileName(file?.name || "");
    setOcrStatusKey(file ? "label.qde.status.pending" : "label.qde.status.notStarted");
  }, []);

  const persistDraft = useCallback(async () => {
    const isUpdate = persistedDraftRef.current && Boolean(form.applicationNo);
    const payload = buildPayload();

    if (!isUpdate) {
      // A fetched application number is only a search reference. The first
      // save must create a new QDE application number.
      payload.szApplicationNo = null;
    }

    const response = isUpdate
      ? await HAxiosService.PUT(LosQdeAPI.updateDraft(form.applicationNo), payload)
      : await HAxiosService.POST(LosQdeAPI.createDraft(), payload);

    const data = unwrapQdePayload(response);
    const appNo = data?.szApplicationNo || data?.applicationNumber || data?.applicationNo;

    if (appNo) {
      persistedDraftRef.current = true;
      setField("applicationNo", appNo);
    }

    return appNo;
  }, [buildPayload, form.applicationNo, setField]);


  const validateForm = useCallback(() => {
    const applicantErrors = {};

    if (!form.applicationType?.trim()) {
      applicantErrors.applicationType = t("label.qde.validation.applicationTypeRequired", "Application type is mandatory.");
    }
    if (!form.portfolio?.trim()) {
      applicantErrors.portfolio = t("label.qde.validation.portfolioRequired", "Portfolio is mandatory.");
    }
    if (form.customerType === "Existing" && !form.customerId?.trim()) {
      applicantErrors.customerId = t("label.qde.validation.customerIdRequired", "Customer ID is mandatory for an existing customer.");
    }

    Object.assign(applicantErrors, validatePartyFields(form, isNonIndividual, t));

    // Loan details
    if (!form.loanType?.trim()) {
      applicantErrors.loanType = t("label.qde.validation.loanTypeRequired", "Loan type is mandatory.");
    }
    if (!form.product?.trim()) {
      applicantErrors.product = t("label.qde.validation.productRequired", "Product is mandatory.");
    }
    if (!form.loanAmount || Number(form.loanAmount) <= 0) {
      applicantErrors.loanAmount = t("label.qde.validation.loanAmountInvalid", "Please enter a valid loan amount.");
    }
    if (!form.tenure || Number(form.tenure) <= 0) {
      applicantErrors.tenure = t("label.qde.validation.tenureInvalid", "Please enter a valid tenure in months.");
    }

    // Sourcing details — matches SourcingDetailsSection's exact channel values
    // ("DSA" / "RM" / "Dealer") and field names.
    if (!form.channel?.trim()) {
      applicantErrors.channel = t("label.qde.validation.channelRequired", "Sourcing channel is mandatory.");
    }
    if (!form.sourcingBranch?.trim()) {
      applicantErrors.sourcingBranch = t("label.qde.validation.sourcingBranchRequired", "Sourcing branch is mandatory.");
    }
    if (!form.servicingBranch?.trim()) {
      applicantErrors.servicingBranch = t("label.qde.validation.servicingBranchRequired", "Servicing branch is mandatory.");
    }

    if (form.channel === "DSA") {
      if (!form.dsaName?.trim()) applicantErrors.dsaName = t("label.qde.validation.dsaNameRequired", "DSA name is mandatory.");
      if (!form.dsaCode?.trim()) applicantErrors.dsaCode = t("label.qde.validation.dsaCodeRequired", "DSA code is mandatory.");
    }
    if (form.channel === "RM") {
      if (!form.rmName?.trim()) applicantErrors.rmName = t("label.qde.validation.rmNameRequired", "RM name is mandatory.");
      if (!form.rmCode?.trim()) applicantErrors.rmCode = t("label.qde.validation.rmCodeRequired", "RM code is mandatory.");
    }
    if (form.channel === "Dealer") {
      if (!form.dealerName?.trim()) applicantErrors.dealerName = t("label.qde.validation.dealerNameRequired", "Dealer name is mandatory.");
      if (!form.dealerCode?.trim()) applicantErrors.dealerCode = t("label.qde.validation.dealerCodeRequired", "Dealer code is mandatory.");
    }

    const coApplicantErrors = {};
    (form.coApplicants || []).forEach((party) => {
      const errs = validatePartyFields(party, party.borrowerType === "Non-Individual", t);
      if (Object.keys(errs).length) coApplicantErrors[party.id] = errs;
    });

    const guarantorErrors = {};
    (form.guarantors || []).forEach((party) => {
      const errs = validatePartyFields(party, party.borrowerType === "Non-Individual", t);
      if (Object.keys(errs).length) guarantorErrors[party.id] = errs;
    });

    const messages = [
      ...Object.values(applicantErrors),
      ...Object.values(coApplicantErrors).flatMap((partyErrors) => Object.values(partyErrors)),
      ...Object.values(guarantorErrors).flatMap((partyErrors) => Object.values(partyErrors)),
    ];

    return {
      isValid: messages.length === 0,
      messages,
      applicant: applicantErrors,
      coApplicants: coApplicantErrors,
      guarantors: guarantorErrors,
    };
  }, [form, isNonIndividual, t]);

  const handleSave = useCallback(async () => {
    const result = validateForm();
    setFormErrors({
      applicant: result.applicant,
      coApplicants: result.coApplicants,
      guarantors: result.guarantors,
    });

    if (!result.isValid) {
  const validationMessage = [
    "Please correct the following:",
    "",
    ...result.messages.map((message, index) => `${index + 1}. ${message}`)
  ].join("\n");

  toast.error(validationMessage);

  return { success: false };
}

    try {
      const appNo = await persistDraft();
      toast.success(
        appNo
          ? `${t("label.qde.msg.saved", "Application saved")} - ${appNo}`
          : t("label.qde.msg.saved", "Application saved")
      );
      return { success: true };
    } catch (error) {
      toast.error(error?.message || t("label.qde.msg.saveFailed", "Save failed"));
      return { success: false };
    }
  }, [validateForm, persistDraft, t, toast]);

  const handleReset = useCallback(() => {
    persistedDraftRef.current = false;
    resetForm();
    setOcrFileName("");
    setOcrStatusKey("label.qde.status.notStarted");
    setFormErrors({ applicant: {}, coApplicants: {}, guarantors: {} });
    toast.success(t("label.qde.msg.reset", "Form reset"));
    return { success: true };
  }, [resetForm, t, toast]);

  return (
    <HBox sx={{ mt: 2 }}>
      <HBreadCrumb />
      <TitleBar title={t("label.qde.title", "Quick data entry")} />
      <HBox>
        <HBox sx={{ display: "flex", flexDirection: "column", gap: 2, pb: 8 }}>
          <HPaper>
            <HBox sx={{ p: 2, width: "100%" }} data-menu-id={screenMenuId}>
              <BusinessUnitSection
                form={form}
                setField={setField}
                errors={formErrors.applicant}
                onOpenApplicationSearch={() => setSearchDialogOpen(true)}
              />

              <OcrUploadSection
                form={form}
                setField={setField}
                onFileSelect={handleFileSelect}
                ocrFileName={ocrFileName}
                ocrStatusKey={ocrStatusKey}
              />

              <KycCheckSection
                form={form}
                setField={setField}
                isNonIndividual={isNonIndividual}
                verifying={verifying}
                onVerifyPan={handleVerifyPan}
                onSendAadhaarOtp={handleSendAadhaarOtp}
                onValidateAadhaarOtp={handleValidateAadhaarOtp}
                onCheckPanAadhaarLink={handleCheckPanAadhaarLink}
                onTriggerCkyc={handleTriggerCkyc}
                onSendCkycOtp={handleSendCkycOtp}
                onValidateCkycOtp={handleValidateCkycOtp}
                onDigilocker={handleDigilocker}
                onVerifyBusinessPan={handleVerifyBusinessPan}
                onVerifyGstin={handleVerifyGstin}
                onVerifyUrn={handleVerifyUrn}
                onVerifyShopAct={handleVerifyShopAct}
                errors={formErrors.applicant}
              />

              <ApplicantDetailsSection
                form={form}
                setField={setField}
                isNonIndividual={isNonIndividual}
                verifyingMobile={Boolean(verifying.mobileSend)}
                onVerifyMobile={() => openMobileOtp("mobile", form.mobile)}
                onVerifyEmail={() => setField("emailVerified", true)}
                errors={formErrors.applicant}
              />

              {isNonIndividual ? (
                <>
                  <AuthSignatorySection
                    form={form}
                    setField={setField}
                    verifyingMobile={Boolean(verifying.mobileSend)}
                    onVerifyAsMobile={() => openMobileOtp("asMobile", form.asMobile)}
                    onVerifyAsEmail={() => setField("asEmailVerified", true)}
                    errors={formErrors.applicant}
                  />

                  <AuthSignatoryKycSection
                    form={form}
                    setField={setField}
                    verifying={verifying}
                    onVerifyAsPan={handleVerifyAsPan}
                    onSendAsAadhaarOtp={handleSendAsAadhaarOtp}
                    onValidateAsAadhaarOtp={handleValidateAsAadhaarOtp}
                    onCheckAsPanAadhaarLink={handleCheckAsPanAadhaarLink}
                    errors={formErrors.applicant}
                  />
                </>
              ) : null}

              <AddressDetailsSection
                form={form}
                setField={setField}
                isNonIndividual={isNonIndividual}
                // onPincodeLookup={handlePincodeLookup}
                noAccordion={false}
                errors={formErrors.applicant}
              />

              <CoApplicantSection
                items={form.coApplicants || []}
                onAdd={addCoApplicant}
                onRemove={removeCoApplicant}
                onChange={updateCoApplicant}
                errors={formErrors.coApplicants}
                primaryBorrowerType={form.borrowerType}
                kycHandlers={partyKycHandlers}
                primaryAddress={form}
              />

              <GuarantorSection
                items={form.guarantors || []}
                onAdd={addGuarantor}
                onRemove={removeGuarantor}
                onChange={updateGuarantor}
                errors={formErrors.guarantors}
                primaryBorrowerType={form.borrowerType}
                kycHandlers={partyKycHandlers}
                primaryAddress={form}
              />

              <LoanDetailsSection form={form} setField={setField} errors={formErrors.applicant} />

              <SourcingDetailsSection form={form} setField={setField} errors={formErrors.applicant} />
            </HBox>
          </HPaper>
        </HBox>
      </HBox>

      <HButtonBar
        onSave={handleSave}
        onReset={handleReset}
        onClose={() => navigate("/homelayout/welcomepage")}
        disableToast={{ save: true, reset: true, close: true }}
      />

      <SearchApplicationDialog
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        onSearch={handleSearchApplications}
        loading={Boolean(verifying.appSearch)}
      />

      <OtpVerifyDialog
        open={otpDialog.open}
        onClose={() => setOtpDialog({ open: false, field: "", target: "" })}
        onValidate={handleValidateMobileOtp}
        channel={t("label.qde.field.mobile", "Mobile number")}
        target={otpDialog.target}
        loading={Boolean(verifying.mobileValidate)}
      />
    </HBox>
  );
};

export default ApplicationQuickDataEntry;