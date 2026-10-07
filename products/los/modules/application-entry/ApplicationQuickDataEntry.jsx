import { useCallback, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import { HAxiosService, HBox, HBreadCrumb, HButtonBar, HPaper, TitleBar, useToast, HLabel } from "@helix/component-library";
import { LosQdeAPI,LosDocumentAPI } from "./apiEndpoints";
import { unwrapApiResponse } from "./unwrapApiResponse";
import {
  ADDRESS_TYPES_INDIVIDUAL,
  ADDRESS_TYPES_NON_INDIVIDUAL,
  DEFAULT_LOAN_TYPE,
  DEFAULT_PORTFOLIO,
  GENDERS,
  VERIFICATION_STATUS,
} from "./constants/qdeOptions";
import { useQdeLookups, QDE_LOOKUP_TYPES } from "./hooks/useQdeLookups";
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
import QdeProgressBar from "./components/QdeProgressBar";

const { VERIFIED, FAILED } = VERIFICATION_STATUS;
const isPassed = (data) => data?.verified !== false && data?.matched !== false;
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
const URN_ACT_PATTERN = /^[A-Z0-9][A-Z0-9\s/-]{0,15}$/i;
const normalizeCustomerType = (...values) => {
  const value = values.find((candidate) => String(candidate ?? "").trim());
  return ["EXISTING", "EXISTING CUSTOMER", "E"].includes(
    String(value ?? "").trim().replace(/[_-]+/g, " ").toUpperCase()
  )
    ? "Existing"
    : "New";
};

const normalizeBorrowerType = (value, fallback = "Individual") => {
  const normalizedValue = String(value ?? "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();

  if (normalizedValue === "NON_INDIVIDUAL") return "Non-Individual";
  if (normalizedValue === "INDIVIDUAL") return "Individual";
  return fallback;
};

const normalizeLookupValue = (value, options, fallbackOptions = []) => {
  if (value == null || value === "") return "";

  const normalizedValue = String(value).trim().toLowerCase();
  const option = [...(Array.isArray(options) ? options : []), ...fallbackOptions].find(
    (item) => [item.value, item.label].some(
      (candidate) => String(candidate ?? "").trim().toLowerCase() === normalizedValue
    )
  );

  return option?.value ?? value;
};

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
const mergeSavedPartyIds = (currentParties = [], savedParties = []) => {
  if (!Array.isArray(currentParties)) {
    return currentParties;
  }

  if (!Array.isArray(savedParties)) {
    return currentParties;
  }

  return currentParties.map((party, index) => {
    const existingMatch = party?.szApplicantId
      ? savedParties.find(
          (saved) =>
            saved?.szApplicantId === party.szApplicantId
        )
      : null;

    // Match by applicant ID first. For new parties without IDs,
    // use the same index as a fallback.
    const savedParty =
      existingMatch || savedParties[index];

    if (!savedParty?.szApplicantId) {
      return party;
    }

    return {
      ...party,
      szApplicantId: savedParty.szApplicantId,
    };
  });
};

const validateKycFields = (obj, isNonInd, translate) => {
  const errors = {};
  const message = (id, fallback) => translate(id, fallback);

  if (isNonInd) {
    const businessPan = String(obj.bizPan ?? "").trim().toUpperCase();

    if (!businessPan || !PAN_PATTERN.test(businessPan)) {
      errors.bizPan = message(
        "label.qde.validation.bizPan",
        "Please enter a valid Business PAN number."
      );
    }
  } else {
    const pan = String(obj.pan ?? "").trim().toUpperCase();
    if (!obj.aadhaar?.trim() || !AADHAAR_PATTERN.test(obj.aadhaar.trim())) {
      errors.aadhaar = message(
        "label.qde.validation.aadhaarInvalid",
        "Please enter a valid 12-digit Aadhaar number."
      );
    }
  }

  if (isNonInd && obj.cin?.trim() && !CIN_PATTERN.test(obj.cin.trim().toUpperCase())) {
  errors.cin = message("label.qde.validation.cinInvalid", "Please enter a valid CIN." );
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

const validatePartyFields = (obj, isNonInd, translate, options = {}) => {
  const { requireMotherName = false } = options;
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
    if (requireMotherName && !String(obj.motherName ?? "").trim()) {
      errors.motherName = message(
        "label.qde.validation.motherNameRequired",
        "Mother's name is mandatory."
      );
    }
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
  const [currentProgressStep, setCurrentProgressStep] = useState(0);

  const [aadhaarOtpTimer, setAadhaarOtpTimer] = useState(0);
  const [aadhaarOtpExpired, setAadhaarOtpExpired] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [savedApplicationNo, setSavedApplicationNo] = useState("");

  // Default: New + Individual, so only the Individual field set is visible on first render.
  const [form, setForm] = useState({
    borrowerType: "Individual",
    customerType: "New",
    applicationType: "N",
    addressType: "CURR",
    portfolio: DEFAULT_PORTFOLIO,
    loanType: DEFAULT_LOAN_TYPE,
    
    dsaName: "salesofficer",
    dsaCode: "EMP-9AE607",

    rmName: "salesofficer",
    rmCode: "EMP-9AE607",
  });

  const [verifying, setVerifying] = useState({});
  const [partyAadhaarOtpTimers, setPartyAadhaarOtpTimers] = useState({});
  const [otpDialog, setOtpDialog] = useState({
    open: false,
    field: "",
    target: "",
    partyId: null,
  });
  const [ocrFileName, setOcrFileName] = useState("");
  const [ocrStatusKey, setOcrStatusKey] = useState("label.qde.status.noFile");

  // Field-level validation errors, wired down into each section that needs them.
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({
    applicant: {},
    coApplicants: {},
    guarantors: {},
  });
  const currentDraftApplicationNoRef = useRef(incomingApplicationNo || null);
  const savedQdeRef = useRef(null);
  const persistedDraftRef = useRef(false);
  const saveInProgressRef = useRef(false);

  const isNonIndividual = form.borrowerType === "Non-Individual";
  const { lookups } = useQdeLookups(ORG_ID, QDE_LOOKUP_TYPES);

  useEffect(() => {
  setCurrentProgressStep(0);
}, [isNonIndividual]);

  // Dynamic field setter
  const setField = useCallback((name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      applicant: { ...prev.applicant, [name]: undefined },
    }));
  }, []);

  const resetForm = useCallback(() => {
    setForm({
      borrowerType: "Individual",
      customerType: "New",
      applicationType: "N",
      addressType: "CURR",
      portfolio: DEFAULT_PORTFOLIO,
      loanType: DEFAULT_LOAN_TYPE,    });
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
        setFormErrors((prev) => ({
          ...prev,
          coApplicants: {
            ...prev.coApplicants,
            [id]: { ...prev.coApplicants[id], [field]: undefined },
          },
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
        setFormErrors((prev) => ({
          ...prev,
          guarantors: {
            ...prev.guarantors,
            [id]: { ...prev.guarantors[id], [field]: undefined },
          },
        }));
    },
    []
  );

  const handleClearApplication = useCallback(() => {
    setForm((prev) => {
      const clearedForm = Object.keys(prev).reduce((acc, key) => {
        acc[key] = "";
        return acc;
      }, {});

      return {
        ...clearedForm,
        borrowerType: "Individual",
        customerType: "Existing",
        applicationType: "N",
        addressType: "CURR",
        portfolio: DEFAULT_PORTFOLIO,
        loanType: DEFAULT_LOAN_TYPE,
      };
    });

    currentDraftApplicationNoRef.current = null;
    savedQdeRef.current = null;
    persistedDraftRef.current = false;
    setSavedApplicationNo("");
  }, []);

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
    const customerTypeCode = normalizeCustomerType(f.customerType) === "Existing"
      ? "EXISTING"
      : "NEW";

    return {
      szOrgId: "001",
      szApplicationNo: currentDraftApplicationNoRef.current,

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
          szPanNumber: isNonIndividual ? (f.bizPan || null) : (f.pan || null),
          szUrnNo: f.urn || null,
          szAadhaarNumber: isNonIndividual ? null : (f.aadhaar || null),
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
    const customerId = response.customerId || applicant.existingCustomerId || "";

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
      applicationType: response.applicationType || "N",
      portfolio: response.portfolio || DEFAULT_PORTFOLIO,
      borrowerType: normalizeBorrowerType(response.borrowerType, prev.borrowerType),
      customerType: customerId
        ? "Existing"
        : normalizeCustomerType(response.customerType, applicant.customerType, prev.customerType),
      customerId,

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

      addressType: current.addressType || (response.borrowerType === "Non-Individual" ? "" : "CURR"),
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

      loanType: response.loanType || loan.loanPurpose || DEFAULT_LOAN_TYPE,
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
      gender: normalizeLookupValue(
        individual.szGender,
        lookups["party.gender"],
        GENDERS
      ),
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
      panStatus: kyc.szPanVerificationStatus || null,
      panAadhaarLinked: kyc.szPanAadhaarLinkageStatus || null,
      urn: kyc.szUrnNo || "",
      aadhaar: kyc.szAadhaarNumber || "",
      aadhaarStatus: kyc.szAadhaarVerificationStatus || null,
      ckycNumber: kyc.szCkycNumber || "",
      ckycStatus: kyc.szCkycVerificationStatus || null,
      digiRef: kyc.szDigiLockerDocumentId || "",
      digiStatus: kyc.szDigiLockerVerificationStatus || null,
      gstin: kyc.szGstNumber || "",
      cin: kyc.szCin || "",
      shopAct: kyc.szShopAct || "",

      addressType: normalizeLookupValue(
        address.szAddressType,
        isNonInd ? lookups["los.address.type.nonindividual"] : lookups["los.address.type.individual"],
        isNonInd ? ADDRESS_TYPES_NON_INDIVIDUAL : ADDRESS_TYPES_INDIVIDUAL
      ),
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
  }, [lookups]);

  /** Loads the QdeWrapperDto returned by GET /los/fetchQde/{orgId}/{appNo} into form state. */
  const hydrateFromQdeResponse = useCallback((response, preserveExistingCustomerType = false) => {
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
    const customerId = applicant.szCustomerId || "";
    const isNonIndividualApplicant = normalizeBorrowerType(control.szBorrowerType) === "Non-Individual";

    setForm((prev) => ({
      ...prev,
      applicationType: control.szApplicationType || "N",
      portfolio: control.szPortfolioCode || DEFAULT_PORTFOLIO,
      borrowerType: isNonIndividualApplicant ? "Non-Individual" : "Individual",
      customerType: preserveExistingCustomerType
        ? "Existing"
        : customerId
          ? "Existing"
          : normalizeCustomerType(control.szCustomerType, applicant.szCustomerType, prev.customerType),
      customerId,
      applicantId: applicant.szApplicantId || "",

      firstName: individual.szFirstName || "",
      middleName: individual.szMiddleName || "",
      lastName: individual.szLastName || "",
      gender: normalizeLookupValue(
        individual.szGender,
        lookups["party.gender"],
        GENDERS
      ),
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

      addressType: normalizeLookupValue(
        address.szAddressType,
        isNonIndividualApplicant
          ? lookups["los.address.type.nonindividual"]
          : lookups["los.address.type.individual"],
        isNonIndividualApplicant ? ADDRESS_TYPES_NON_INDIVIDUAL : ADDRESS_TYPES_INDIVIDUAL
      ),
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

      loanType: loan.szLoanType || DEFAULT_LOAN_TYPE,
      product: loan.szProductCode || "",
      scheme: loan.szSchemeCode || "",
      loanAmount: loan.fAppliedAmount != null ? String(loan.fAppliedAmount) : "",
      tenure: loan.iAppliedTenor != null ? String(loan.iAppliedTenor) : "",
      rate: loan.fInterestRate != null ? String(loan.fInterestRate) : "",

      channel: sourcing.szSourcingChannel || "",
      sourcingBranch: sourcing.szSourcingBranch || "",
      servicingBranch: sourcing.szServicingBranch || "",
    }));
  }, [lookups, partyFromQde]);

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

  useEffect(() => {
    if (!Object.values(partyAadhaarOtpTimers).some((remaining) => remaining > 0)) return undefined;
    const timer = setInterval(() => {
      setPartyAadhaarOtpTimers((current) => {
        const next = {};
        Object.entries(current).forEach(([partyId, remaining]) => {
          if (remaining > 1) next[partyId] = remaining - 1;
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [partyAadhaarOtpTimers]);

  useEffect(() => {
    if (!otpDialog.open) {
      return;
    }
    setOtpTimer(30);
    const timer = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [otpDialog.open]);

  useEffect(() => {
    if (aadhaarOtpTimer <= 0) return undefined;
    const timer = setInterval(() => {
      setAadhaarOtpTimer((remaining) => {
        if (remaining <= 1) {
          setAadhaarOtpExpired(true);
          return 0;
        }
        return remaining - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [aadhaarOtpTimer]);

  /**
   * "Search Existing Applications" pop search. Loads the matching application into the form,
  * searching by application number, mobile number or PAN number.
   */
  const handleSearchApplications = useCallback(
    async ({ applicationNo, mobile, panNumber }) => {
      const appNo = (applicationNo || "").trim();
      const mobileNo = (mobile || "").trim();
      const panNo = (panNumber || "").trim();

      const url = appNo
        ? LosQdeAPI.fetchQde(ORG_ID, appNo)
        : mobileNo
          ? LosQdeAPI.fetchQdeByMobile(ORG_ID, mobileNo)
          : panNo
            ? LosQdeAPI.fetchQdeByPanNumber(ORG_ID, panNo)
            : null;

      if (!url) {
        toast.error(
          t(
            "label.qde.msg.searchCriteriaRequired",
            "Enter an application number, mobile number or valid PAN number."
          )
        );
        return;
      }

      setBusy("appSearch", true);
      try {
        const data = unwrapQdePayload(await HAxiosService.GET(url));
        currentDraftApplicationNoRef.current = savedQdeRef.current?.szApplicationNo || null;
        persistedDraftRef.current = false;
        hydrateFromQdeResponse(data, true);
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

  /** Loads an existing applicant into one co-applicant or guarantor row. */
  const handleSearchCustomer = useCallback(
    async (party, { applicationNo, mobile, panNumber }) => {
      const appNo = (applicationNo || "").trim();
      const mobileNo = (mobile || "").trim();
      const panNo = (panNumber || "").trim().toUpperCase();
      if (!appNo && !mobileNo && !panNo) {
        toast.error(t("label.qde.msg.searchCriteriaRequired", "Enter an application number, mobile number or valid PAN number."));
        return false;
      }
      const lookupUrl = appNo
        ? LosQdeAPI.fetchQde(ORG_ID, appNo)
        : mobileNo
          ? LosQdeAPI.fetchQdeByMobile(ORG_ID, mobileNo)
          : LosQdeAPI.fetchQdeByPanNumber(ORG_ID, panNo);
      const notFoundMessage = t("label.qde.msg.applicationNotFound", "No matching applicant found");
      const busyKey = `${party.id}:appSearch`;

      setBusy(busyKey, true);
      try {
        const data = unwrapQdePayload(await HAxiosService.GET(lookupUrl));
        const candidates = [
          data?.applicantDetails,
          ...(Array.isArray(data?.coApplicants) ? data.coApplicants : []),
          ...(Array.isArray(data?.guarantors) ? data.guarantors : []),
          data?.szBorrowerType ? data : null,
        ].filter(Boolean);

        const match = appNo
          ? data?.applicantDetails || candidates[0]
          : candidates.find((candidate) => mobileNo
            ? String(candidate.szMobile || "").trim() === mobileNo
            : String(candidate.kycDetails?.szPanNumber || "").trim().toUpperCase() === panNo
          );
        if (!match) {
          toast.error(notFoundMessage);
          return false;
        }

        const {
          id: _mappedId,
          applicantId: _mappedApplicantId,
          relationship: _mappedRelationship,
          ...details
        } = partyFromQde(match);
        if (form.borrowerType === "Individual" && details.borrowerType === "Non-Individual") {
          toast.error(
            t(
              "label.qde.msg.customerBorrowerTypeMismatch",
              "This customer is Non-Individual. Co-applicants and guarantors must be Individual when the primary applicant is Individual."
            )
          );
          return false;
        }
        const fill = (item) =>
          item.id === party.id
            ? {
                ...item,
                ...details,
                customerType: "Existing",
                customerId: details.customerId || item.customerId || "",
                customerSearch: appNo || mobileNo || panNo,
                sameAsPrimaryAddress: false,
              }
            : item;
        setForm((prev) => ({
          ...prev,
          coApplicants: (prev.coApplicants || []).map(fill),
          guarantors: (prev.guarantors || []).map(fill),
        }));
        toast.success(t("label.qde.msg.customerLoaded", "Customer details loaded"));
        return true;
      } catch (error) {
        toast.error(error?.message || notFoundMessage);
        return false;
      } finally {
        setBusy(busyKey, false);
      }
    },
    [form.borrowerType, partyFromQde, setBusy, t, toast]
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

  const isPartyBusy = useCallback((party, key) => Boolean(verifying[`${party.id}:${key}`]), [verifying]);

  const openPartyOtp = useCallback((field, target, partyId) => {
    if (!target || (field === "mobile" && !/^[6-9]\d{9}$/.test(target))) return;
    setOtpDialog({ open: true, field, target, partyId });
    toast.success(`OTP sent to ${target}. (Demo OTP: 123456)`);
  }, [toast]);

  const partyKycHandlers = {
    onVerifyPan: (party) => {
      const pan = party.pan?.trim().toUpperCase() || "";
      if (!pan) {
        updatePartyField(party, "panStatus", FAILED);
        toast.error(t("label.qde.msg.enterPan", "Enter a PAN number first"));
        return false;
      }
      if (!PAN_PATTERN.test(pan)) {
        updatePartyField(party, "panStatus", FAILED);
        updatePartyField(party, "panAadhaarLinked", "PENDING");
        toast.error(t("label.qde.msg.invalidPan", "Please enter a valid PAN number"));
        return false;
      }
      updatePartyField(party, "pan", pan);
      updatePartyField(party, "panStatus", VERIFIED);
      toast.success(t("label.qde.msg.PanVerify", "PAN Verified"));
      return true;
    },
    onSendAadhaarOtp: (party) => {
      const aadhaar = party.aadhaar?.trim() || "";
      if (!aadhaar) {
        updatePartyField(party, "aadhaarStatus", FAILED);
        toast.error(t("label.qde.msg.enterAadhaar", "Enter an Aadhaar number first"));
        return false;
      }
      if (!AADHAAR_PATTERN.test(aadhaar)) {
        updatePartyField(party, "aadhaarStatus", FAILED);
        toast.error(t("label.qde.msg.invalidAadhaar", "Please enter a valid 12-digit Aadhaar number"));
        return false;
      }
      updatePartyField(party, "aadhaar", aadhaar);
      updatePartyField(party, "aadhaarOtp", "");
      updatePartyField(party, "aadhaarOtpSent", true);
      updatePartyField(party, "aadhaarStatus", "PENDING");
      setPartyAadhaarOtpTimers((current) => ({ ...current, [party.id]: 30 }));
      toast.success(t("label.qde.msg.aadhaarOtpSent", "UIDAI: OTP sent to Aadhaar-registered mobile. (Demo OTP: 123456) · 30 resend(s) left"));
      return true;
    },
    onValidateAadhaarOtp: (party) => {
      const otp = party.aadhaarOtp || "";
      const aadhaar = party.aadhaar?.trim() || "";
      if (!aadhaar) {
        updatePartyField(party, "aadhaarStatus", FAILED);
        updatePartyField(party, "panAadhaarLinked", FAILED);
        toast.error(t("label.qde.msg.enterAadhaar", "Enter an Aadhaar number first"));
        return false;
      }
      if (!AADHAAR_PATTERN.test(aadhaar)) {
        updatePartyField(party, "aadhaarStatus", FAILED);
        updatePartyField(party, "panAadhaarLinked", FAILED);
        toast.error(t("label.qde.msg.invalidAadhaar", "Please enter a valid 12-digit Aadhaar number"));
        return false;
      }
      if (!party.aadhaarOtpSent) {
        toast.error(t("label.qde.msg.sendAadhaarOtpFirst", "Get an Aadhaar OTP first"));
        return false;
      }
      if (!/^\d{6}$/.test(otp)) {
        updatePartyField(party, "aadhaarStatus", FAILED);
        updatePartyField(party, "panAadhaarLinked", FAILED);
        toast.error(t("label.qde.msg.invalidAadhaarOtp", "Please enter a valid 6-digit OTP"));
        return false;
      }
      if (otp !== "123456") {
        updatePartyField(party, "aadhaarStatus", FAILED);
        updatePartyField(party, "panAadhaarLinked", FAILED);
        toast.error(t("label.qde.msg.aadhaarVerificationFailed", "Invalid Aadhaar OTP"));
        return false;
      }
      updatePartyField(party, "aadhaarStatus", VERIFIED);
      updatePartyField(party, "aadhaarOtp", "");
      updatePartyField(party, "aadhaarOtpSent", false);
      setPartyAadhaarOtpTimers((current) => {
        const next = { ...current };
        delete next[party.id];
        return next;
      });
      toast.success(t("label.qde.msg.aadhaarVerified", "Aadhaar verified successfully"));
      return true;
    },
    onCheckPanAadhaarLink: (party) => {
      if (party.panStatus === VERIFIED && party.aadhaarStatus === VERIFIED) {
        updatePartyField(party, "panAadhaarLinked", VERIFIED);
        toast.success(t("label.qde.msg.panAadhaarLinked", "PAN-Aadhaar linkage verified successfully"));
        return true;
      }
      updatePartyField(party, "panAadhaarLinked", FAILED);
      toast.error(t("label.qde.msg.panAadhaarNotVerified", "Please verify PAN and Aadhaar first"));
      return false;
    },
    onSendCkycOtp: (party) => {
      if (!party.ckycTriggered || !party.ckycNumber) {
        toast.error("Trigger CKYC first to fetch the CKYC number.");
        return false;
      }
      updatePartyField(party, "ckycOtp", "");
      updatePartyField(party, "ckycOtpSent", true);
      updatePartyField(party, "ckycStatus", "PENDING");
      toast.success("OTP sent successfully. (Demo OTP: 123456)");
      return true;
    },
    onValidateCkycOtp: (party) => {
      const otp = party.ckycOtp || "";
      if (!/^\d{6}$/.test(otp)) {
        toast.error("Please enter a valid 6-digit OTP");
        return false;
      }
      const passed = otp === "123456";
      updatePartyField(party, "ckycStatus", passed ? VERIFIED : FAILED);
      if (passed) {
        updatePartyField(party, "ckycOtp", "");
        updatePartyField(party, "ckycOtpSent", false);
        toast.success("CKYC verified successfully");
      } else {
        toast.error("Invalid CKYC OTP");
      }
      return passed;
    },
    onDigilocker: (party) => {
      const digiRef = party.digiRef?.trim() || "";
      if (!digiRef) {
        updatePartyField(party, "digiStatus", FAILED);
        toast.error(t("label.qde.msg.enterDigiRef", "Enter DigiLocker reference or mobile first"));
        return false;
      }
      updatePartyField(party, "digiRef", digiRef);
      updatePartyField(party, "digiStatus", VERIFIED);
      toast.success(t("label.qde.msg.digiLockerVerified", "DigiLocker verified successfully"));
      return true;
    },
    onTriggerCkyc: (party) => {
      const ckycNumber = party.ckycNumber?.trim() || `CKYC${Math.floor(10000000000000 + Math.random() * 90000000000000)}`;
      updatePartyField(party, "ckycNumber", ckycNumber);
      updatePartyField(party, "ckycTriggered", true);
      updatePartyField(party, "ckycOtpSent", false);
      updatePartyField(party, "ckycOtp", "");
      updatePartyField(party, "ckycStatus", "PENDING");
      toast.success("CKYC registry hit. Number fetched.");
      return true;
    },
    onVerifyBusinessPan: (party) => {
      const pan = party.bizPan?.trim().toUpperCase() || "";
      if (!pan || !PAN_PATTERN.test(pan)) {
        updatePartyField(party, "bizPanStatus", FAILED);
        toast.error(t(pan ? "label.qde.msg.invalidPan" : "label.qde.msg.enterBussPan", pan ? "Please enter a valid PAN number" : "Enter a Business PAN number first"));
        return false;
      }
      updatePartyField(party, "bizPan", pan);
      updatePartyField(party, "bizPanStatus", VERIFIED);
      toast.success(t("label.qde.msg.PanVerify", "PAN Verified"));
      return true;
    },
    onVerifyGstin: (party) => {
      const gstin = party.gstin?.trim().toUpperCase() || "";
      if (gstin.length !== 15) {
        updatePartyField(party, "gstinStatus", FAILED);
        toast.error(t(gstin ? "label.qde.msg.invalidGSTIN" : "label.qde.msg.emptyGSTIN", gstin ? "Please enter a valid GSTIN number" : "Please enter a GSTIN number"));
        return false;
      }
      updatePartyField(party, "gstin", gstin);
      updatePartyField(party, "gstinStatus", VERIFIED);
      toast.success(t("label.qde.msg.GstinVerify", "GSTIN Verified"));
      return true;
    },
    onVerifyUrn: (party) => {
      const urn = party.urn?.trim() || "";
      if (!urn) {
        updatePartyField(party, "urnStatus", FAILED);
        toast.error(t("label.qde.msg.enterUrn", "Please enter URN No."));
        return false;
      }
      updatePartyField(party, "urn", urn);
      updatePartyField(party, "urnStatus", VERIFIED);
      toast.success(t("label.qde.msg.urnVerified", "URN No. verified successfully"));
      return true;
    },
    onVerifyShopAct: (party) => {
      const shopAct = party.shopAct?.trim().toUpperCase() || "";
      if (shopAct.length <= 3) {
        updatePartyField(party, "shopActStatus", FAILED);
        toast.error(t(shopAct ? "label.qde.msg.invalidshopact" : "label.qde.msg.emptyshopact", shopAct ? "Please enter a valid shop act number" : "Please enter a shop act number"));
        return false;
      }
      updatePartyField(party, "shopAct", shopAct);
      updatePartyField(party, "shopActStatus", VERIFIED);
      toast.success(t("label.qde.msg.shopactVerify", "Shop Act Verified"));
      return true;
    },
    onVerifyMobile: (party) => openPartyOtp("mobile", party.mobile, party.id),
    onVerifyEmail: (party) => openPartyOtp("email", party.email, party.id),
    verifyingPan: (party) => isPartyBusy(party, "pan"),
    verifyingBizPan: (party) => isPartyBusy(party, "bizPan"),
    verifyingGstin: (party) => isPartyBusy(party, "gstin"),
    verifyingShopAct: (party) => isPartyBusy(party, "shopAct"),
    verifyingCkyc: (party) => isPartyBusy(party, "ckycTrigger"),
    verifyingAadhaarSend: (party) => isPartyBusy(party, "aadhaarSend"),
    verifyingAadhaarValidate: (party) => isPartyBusy(party, "aadhaarValidate"),
    verifyingPanAadhaar: (party) => isPartyBusy(party, "panAadhaar"),
    aadhaarOtpTimer: (party) => partyAadhaarOtpTimers[party.id] || 0,
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
    if (!requireValue(form.pan, "label.qde.msg.enterPan", "Enter a PAN number first")) {
      setField("panStatus", "FAILED");
      return false;
    }
    const pan = form.pan.trim().toUpperCase();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

    if (!panRegex.test(pan)) {
      setField("panStatus", "FAILED");
      setField("panAadhaarLinked", "PENDING");
      toast.error(t("label.qde.msg.invalidPan", "Please enter a valid PAN number"));
      return false;
    }
    setField("pan", pan);
    setField("panStatus", "VERIFIED");
    toast.success(t("label.qde.msg.PanVerify", "PAN Verified"));

    return true;
  };

  const handleSendAadhaarOtp = () => {
    if (!requireValue( form.aadhaar, "label.qde.msg.enterAadhaar", "Enter Aadhaar number first" )) {
      return false;
    }
    const aadhaar = form.aadhaar.trim();
    if (!/^\d{12}$/.test(aadhaar)) {
      toast.error( t( "label.qde.msg.invalidAadhaar", "Please enter a valid 12-digit Aadhaar number" ) );
      setField("aadhaarStatus", "FAILED");
      return false;
    }
    setField("aadhaarOtp", "");
    setField("aadhaarOtpSent", true);
    setField("aadhaarStatus", "PENDING");

    setAadhaarOtpExpired(false);
    setAadhaarOtpTimer(30);

    toast.success(t("label.qde.msg.aadhaarOtpSent", "UIDAI: OTP sent to Aadhaar-registered mobile. (Demo OTP: 123456) · 30 resend(s) left"));
    return true;
  };

  const handleValidateAadhaarOtp = async () => {
    if (aadhaarOtpExpired) {
      toast.error( t("label.qde.msg.aadhaarOtpExpired", "Aadhaar OTP expired. Please resend."));
      return false;
    }

    if (!form.aadhaarOtp) {
      toast.error( t( "label.qde.msg.enterAadhaarOtp", "Please enter OTP"));
      return false;
    }

    if (form.aadhaarOtp.length !== 6) {
      toast.error( t( "label.qde.msg.invalidAadhaarOtp", "Please enter a valid 6-digit OTP"));
      setField("aadhaarStatus", "FAILED");
      return false;
    }

    if (form.aadhaarOtp === "123456") {
      setField("aadhaarStatus", "VERIFIED");
      setField("aadhaarOtp", "");
      setField("aadhaarOtpSent", false);
      setAadhaarOtpExpired(false);
      setAadhaarOtpTimer(0);

      toast.success(
        t(
          "label.qde.msg.aadhaarVerified",
          "Aadhaar verified successfully"
        )
      );
      return true;
    }

    setField("aadhaarStatus", "FAILED");

    toast.error(
      t(
        "label.qde.msg.aadhaarVerificationFailed",
        "Invalid Aadhaar OTP"
      )
    );

    return false;
  };

  const handleCheckPanAadhaarLink = () => {
    if (
      form.panStatus === "VERIFIED" &&
      form.aadhaarStatus === "VERIFIED"
    ) {
      setField("panAadhaarLinked", "VERIFIED");

      toast.success(
        t(
          "label.qde.msg.panAadhaarLinked",
          "PAN-Aadhaar linkage verified successfully"
        )
      );

      return true;
    }

    setField("panAadhaarLinked", "FAILED");

    toast.error(
      t(
        "label.qde.msg.panAadhaarNotVerified",
        "Please verify PAN and Aadhaar first"
      )
    );

    return false;
  };

  const handleTriggerCkyc = () => {
    let ckycNumber = form.ckycNumber?.trim();
    if (!ckycNumber) {
      ckycNumber = `CKYC${Math.floor(
        10000000000000 + Math.random() * 90000000000000
      )}`;
    }
    setField("ckycNumber", ckycNumber);
    setField("ckycTriggered", true);
    setField("ckycOtpSent", false);
    setField("ckycOtp", "");
    setField("ckycStatus", "PENDING");

    toast.success(`CKYC registry hit. Number fetched.`);
    return true;
  };

  const handleSendCkycOtp = () => {
  if (!form.ckycTriggered) {
    toast.error("Trigger CKYC first to fetch the CKYC number.");
    return false;
  }

  if (!form.ckycNumber) {
    toast.error("CKYC number is required.");
    return false;
  }
  setField("ckycOtp", "");
  setField("ckycOtpSent", true);
  setField("ckycStatus", "PENDING");
  toast.success("OTP sent successfully. (Demo OTP: 123456)");
  return true;
};


  const handleValidateCkycOtp = () => {
    if (!form.ckycOtp) {
      toast.error("Please enter OTP");
      return false;
    }

    if (form.ckycOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return false;
    }

    if (form.ckycOtp === "123456") {
      setField("ckycStatus", "VERIFIED");
      setField("ckycOtpSent", false);
      setField("ckycOtp", "");
      toast.success("CKYC verified successfully");
      return true;
    }
    setField("ckycStatus", "FAILED");
    toast.error("Invalid CKYC OTP");
    return false;
  };
   

  const handleDigilocker = () => {
    const digiRef = form.digiRef?.trim();
    if (!digiRef) { 
        setField("digiStatus", "FAILED");
        toast.error( t( "label.qde.msg.enterDigiRef", "Enter DigiLocker reference or mobile first" ) ); 
        return false; }

        setField("digiRef", digiRef); setField("digiStatus", "VERIFIED");
         toast.success( t( "label.qde.msg.digiLockerVerified", "DigiLocker verified successfully" ) );
         return true;;
  };

  // ---- KYC handlers (non-individual) ---------------------------------------

  const handleVerifyBusinessPan = () =>{
    if (!requireValue(form.bizPan, "label.qde.msg.enterBussPan", "Enter a Business PAN number first")) {
      setField("bizPanStatus", "FAILED");
      return false;
    }
    const bizPan = form.bizPan.trim().toUpperCase();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

    if (!panRegex.test(bizPan)) {
      setField("bizPanStatus", "FAILED");
      setField("panAadhaarLinked", "PENDING");
      toast.error(t("label.qde.msg.invalidPan", "Please enter a valid PAN number"));
      return false;
    }
    setField("bizPan", bizPan);
    setField("bizPanStatus", "VERIFIED");
    toast.success(t("label.qde.msg.PanVerify", "PAN Verified"));

    return true;
  }

  const handleVerifyGstin = () => {
    const gstin = form.gstin?.trim().toUpperCase() || "";
    if (!gstin) {
      setField("gstinStatus", "FAILED");
      toast.error(t("label.qde.msg.emptyGSTIN", "Please enter a GSTIN number"));
      return;
    }

    if (gstin.length !== 15) {
      setField("gstinStatus", "FAILED");
       toast.error(t("label.qde.msg.invalidGSTIN", "Please enter a valid GSTIN number"));
      return;
    }
    setField("gstinStatus", "VERIFIED");
    toast.success(t("label.qde.msg.GstinVerify", "GSTIN Verified"));
  }

  const handleVerifyUrn = () => {
    const urn = form.urn?.trim();

    if (!urn) {
      setField("urnStatus", "FAILED");
      toast.error(t("label.qde.msg.enterUrn","Please enter URN No."));
      return false;
    }
    setField("urn", urn);
    setField("urnStatus", "VERIFIED");

    toast.success(t("label.qde.msg.urnVerified","URN No. verified successfully"));
    return true;
  };

  const handleVerifyShopAct = () =>{
   const shopAct = form.shopAct?.trim().toUpperCase() || "";
    if (!shopAct) {
      setField("shopActStatus", "FAILED");
      toast.error(t("label.qde.msg.emptyshopact", "Please enter a shop act number"));
      return;
    }

    if (shopAct.length <= 3) {
      setField("shopActStatus", "FAILED");
       toast.error(t("label.qde.msg.invalidshopact", "Please enter a valid shop act number"));
      return;
    }
    setField("shopActStatus", "VERIFIED");
    toast.success(t("label.qde.msg.shopactVerify", "Shop Act Verified"));
  }
  // ---- Authorised signatory KYC --------------------------------------------

  const handleVerifyAsPan = () => {
    const pan = form.asPan?.trim().toUpperCase() || "";
    if (!pan) {
      setField("asPanStatus", "FAILED");
      setField("asPanAadhaarLinked", "FAILED");
      toast.error(t("label.qde.msg.enterPan", "Enter a PAN number first"));
      return false;
    }
    if (!PAN_PATTERN.test(pan)) {
      setField("asPanStatus", "FAILED");
      setField("asPanAadhaarLinked", "FAILED");
      toast.error(t("label.qde.msg.invalidPan", "Please enter a valid PAN number"));
      return false;
    }

    setField("asPan", pan);
    setField("asPanStatus", "VERIFIED");
    toast.success(t("label.qde.msg.PanVerify", "PAN Verified"));
    return true;
  };

  const handleSendAsAadhaarOtp = () => {
    const aadhaar = form.asAadhaar?.trim() || "";
    if (!aadhaar) {
      setField("asAadhaarStatus", "FAILED");
      setField("asPanAadhaarLinked", "FAILED");
      toast.error(t("label.qde.msg.enterAadhaar", "Enter Aadhaar number first"));
      return false;
    }
    if (!AADHAAR_PATTERN.test(aadhaar)) {
      setField("asAadhaarStatus", "FAILED");
      setField("asPanAadhaarLinked", "FAILED");
      toast.error(t("label.qde.msg.invalidAadhaar", "Please enter a valid 12-digit Aadhaar number"));
      return false;
    }

    setField("asAadhaar", aadhaar);
    setField("asAadhaarOtp", "");
    setField("asAadhaarOtpSent", true);
    setField("asAadhaarStatus", "PENDING");
    setAadhaarOtpExpired(false);
    setAadhaarOtpTimer(30);
    toast.success(
      t(
        "label.qde.msg.aadhaarOtpSent",
        "UIDAI: OTP sent to Aadhaar-registered mobile. (Demo OTP: 123456) · 30 resend(s) left"
      )
    );
    return true;
  };

  const handleValidateAsAadhaarOtp = () => {
    const aadhaar = form.asAadhaar?.trim() || "";
    if (!aadhaar) {
      setField("asAadhaarStatus", "FAILED");
      setField("asPanAadhaarLinked", "FAILED");
      toast.error(t("label.qde.msg.enterAadhaar", "Enter Aadhaar number first"));
      return false;
    }
    if (!AADHAAR_PATTERN.test(aadhaar)) {
      setField("asAadhaarStatus", "FAILED");
      setField("asPanAadhaarLinked", "FAILED");
      toast.error(t("label.qde.msg.invalidAadhaar", "Please enter a valid 12-digit Aadhaar number"));
      return false;
    }
    if (!form.asAadhaarOtp) {
      setField("asAadhaarStatus", "FAILED");
      setField("asPanAadhaarLinked", "FAILED");
      toast.error(t("label.qde.msg.enterAadhaarOtp", "Please enter OTP"));
      return false;
    }
    if (!/^\d{6}$/.test(form.asAadhaarOtp)) {
      setField("asAadhaarStatus", "FAILED");
      setField("asPanAadhaarLinked", "FAILED");
      toast.error(t("label.qde.msg.invalidAadhaarOtp", "Please enter a valid 6-digit OTP"));
      return false;
    }

    if (form.asAadhaarOtp === "123456") {
      setField("asAadhaarStatus", "VERIFIED");
      setField("asAadhaarOtp", "");
      setField("asAadhaarOtpSent", false);
      setAadhaarOtpExpired(false);
      setAadhaarOtpTimer(0);
      toast.success(t("label.qde.msg.aadhaarVerified", "Aadhaar verified successfully"));
      return true;
    }

    setField("asAadhaarStatus", "FAILED");
    setField("asPanAadhaarLinked", "FAILED");
    toast.error(t("label.qde.msg.aadhaarVerificationFailed", "Invalid Aadhaar OTP"));
    return false;
  };

  const handleCheckAsPanAadhaarLink = () => {
    if (
      form.asPanStatus === "VERIFIED" &&
      form.asAadhaarStatus === "VERIFIED"
    ) {
      setField("asPanAadhaarLinked", "VERIFIED");
      toast.success(
        t(
          "label.qde.msg.panAadhaarLinked",
          "PAN-Aadhaar linkage verified successfully"
        )
      );
      return true;
    }

    setField("asPanAadhaarLinked", "FAILED");
    toast.error(
      t(
        "label.qde.msg.panAadhaarNotVerified",
        "Please verify PAN and Aadhaar first"
      )
    );
    return false;
  };

  const openOtp = useCallback(
    (field, target) => {
      if (!target) {
        return;
      }

      const isMobile = field === "mobile" || field === "asMobile";

      if (isMobile && !/^[6-9]\d{9}$/.test(target)) {
        toast.error("Enter 10-digit mobile starting 6-9.");
        return;
      }
      if (!isMobile && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target)) {
        toast.error("Invalid email format (RFC 5322).");
        return;
      }

      setOtpDialog({
        open: true,
        field,
        target,
        partyId: null,
      });

      toast.success(`OTP sent to ${target}. (Demo OTP: 123456)`);
    },
    [toast]
  );

  const handleValidateOtp = useCallback(
    (enteredOtp) => {
      if (enteredOtp !== "123456") {
        toast.error("Invalid OTP. Try again.");
        return;
      }

      if (otpDialog.partyId) {
        updatePartyField(
          { id: otpDialog.partyId },
          otpDialog.field === "mobile" ? "mobileVerified" : "emailVerified",
          true
        );
        if (otpDialog.field === "mobile") {
          toast.success("Mobile Verified", "success");
        }
      } else if (otpDialog.field === "mobile") {
        setField("mobileVerified", true);
        toast.success("Mobile Verified", "success");
      } else if (otpDialog.field === "asMobile") {
        setField("asMobileVerified", true);
        toast.success("Mobile Verified", "success");
      }

      if (otpDialog.field === "email" || otpDialog.field === "asEmail") {
        setField(otpDialog.field === "asEmail" ? "asEmailVerified" : "emailVerified", true);
        toast.success("Email Verified", "success");
      }

      setOtpDialog({
        open: false,
        field: "",
        target: "",
      });
    },
    [otpDialog.field, otpDialog.partyId, setField, toast, updatePartyField]
  );

  // ---- OCR -----------------------------------------------------------------

  const handleFileSelect = useCallback((file) => {
    setOcrFileName(file?.name || "");
    setOcrStatusKey(file ? "label.qde.status.pending" : "label.qde.status.notStarted");
  }, []);

// Prevents the same Aadhaar file from being uploaded again
// every time the user saves the same draft.
const aadhaarUploadedRef = useRef(null);

const persistDraft = useCallback(async () => {
  // 1. Build the current form payload.
  const payload = buildPayload();

  // 2. Reuse previously saved IDs when the current form
  const previous = savedQdeRef.current;

  if (previous) {
    payload.szApplicationNo =
      payload.szApplicationNo ||
      previous.szApplicationNo;

    if (payload.applicantDetails && previous.applicantDetails) {
      payload.applicantDetails = {
        ...payload.applicantDetails,
        szApplicantId:
          payload.applicantDetails.szApplicantId ||
          previous.applicantDetails.szApplicantId,
      };
    }

    payload.coApplicants = mergeSavedPartyIds(
      payload.coApplicants || [],
      previous.coApplicants || []
    );

    payload.guarantors = mergeSavedPartyIds(
      payload.guarantors || [],
      previous.guarantors || []
    );
  }

  // 3. Save or update using the same POST API.
  const response = await HAxiosService.POST(
    LosQdeAPI.createDraft(),
    payload
  );

  const data = unwrapQdePayload(response);

  if (!data) {
    throw new Error(
      "The server returned an empty QDE save response."
    );
  }

  // 4. Resolve the application number.
  const appNo =
    data.szApplicationNo ||
    data.applicationNumber ||
    data.applicationNo ||
    payload.szApplicationNo;

  if (!appNo) {
    throw new Error(
      "Application number was not returned by the server."
    );
  }

  const orgId =
    data.szOrgId ||
    payload.szOrgId ||
    form.szOrgId ||
    "001";

  // Applicant ID may be omitted from a successful save response. Resolve it from the saved QDE only when document upload requires it.
  let savedData = data;
  let applicantId =
    savedData?.applicantDetails?.szApplicantId ||
    savedData?.szApplicantId ||
    savedData?.applicantId ||
    payload?.applicantDetails?.szApplicantId ||
    previous?.applicantDetails?.szApplicantId ||
    null;

  if (form.aadhaarImage && !applicantId) {
    throw new Error(
      "Application saved, but the applicant ID could not be loaded for Aadhaar document upload."
    );
  }

  // 6. Keep all returned IDs for the next save.
  const savedQde = {
    ...payload,
    ...savedData,
    szOrgId: orgId,
    szApplicationNo: appNo,

    applicantDetails: {
      ...(payload.applicantDetails || {}),
      ...(savedData.applicantDetails || {}),
      szApplicantId: applicantId,
    },

    coApplicants: mergeSavedPartyIds(
      payload.coApplicants || [],
      savedData.coApplicants || payload.coApplicants || []
    ),

    guarantors: mergeSavedPartyIds(
      payload.guarantors || [],
      savedData.guarantors || payload.guarantors || []
    ),
  };

  savedQdeRef.current = savedQde;
  currentDraftApplicationNoRef.current = appNo;
  persistedDraftRef.current = true;

  // Keep the application number in the visible form state.
  setField("applicationNo", appNo);

  // 7. Upload Aadhaar only after the QDE save succeeds.
  //    Do not upload the same file again on every draft save.
  if (form.aadhaarImage) {
    const file = form.aadhaarImage;

    const uploadKey = [
      appNo,
      orgId,
      file.name,
      file.size,
      file.lastModified,
    ].join("|");

    if (aadhaarUploadedRef.current !== uploadKey) {
      const documentRequests = [
        {
          itemId: null,
          custom: false,
          docName: null,
          iDocumentsSrNo: null,

          szApplicationNo: appNo,
          szOrgId: orgId,
          szDocCode: "AADHAAR",
          szApplicantId: applicantId,

          szAssetSrNo: null,
          szStageDue: "PRE_SUBMISSION",
          szDocWaiveAllowYn: "N",
          szReceivedYn: "Y",
          szWaivedYn: "N",
          szWaiverDec: null,
          szWaiverReason: null,
          szDifferYn: "N",
          szMandatoryYn: "Y",
          szOriginalReqYn: "Y",

          szVerfDecision: null,
          szVerifiedBy: null,
          szUserSpecifiedYn: "N",

          documentId: null,

          szDocFamilyCode: "KYC",
          szDocFamilyDesc:
            "Personal Identification and KYC Documents",

          cFraudYn: "N",
          szRemarks: null,
          iDueDays: null,
          dtDueDate: null,
          szDocketLocation: null,
          iNoOfPages: null,

          cLevel: "P",

          dtRecieptDate: null,
          dtDeferralDate: null,

          szCreatedBy: null,
          dtCreatedOn: null,
          szUpdatedBy: null,
          dtUpdatedOn: null,

          filePartName: "aadhaarFile",
        },
      ];

      const formData = new FormData();

      formData.append(
        "request",
        new Blob(
          [JSON.stringify(documentRequests)],
          { type: "application/json" }
        )
      );

      formData.append(
        "aadhaarFile",
        file,
        file.name
      );

      const uploadUrl =
        LosDocumentAPI.LosDocumentAPI("ECF-DocumentUpload") +
        "/documents/upload" +
        `?applicationNo=${encodeURIComponent(appNo)}` +
        `&orgId=${encodeURIComponent(orgId)}`;

      // Allow the browser/Axios to set the multipart boundary.
      await HAxiosService.POST(
        uploadUrl,
        formData,
        {},
        false
      );
      aadhaarUploadedRef.current = uploadKey;
    }
  }

  return appNo;
}, [
  buildPayload,
  form,
  setField,
]);


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

    Object.assign(applicantErrors, validatePartyFields(form, isNonIndividual, t, { requireMotherName: !isNonIndividual }));

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
    if (!form.scheme || Number(form.scheme) <= 0) {
      applicantErrors.scheme = t("label.qde.validation.schemeInvalid", "Please enter a valid scheme.");
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
      const errs = validatePartyFields(party, party.borrowerType === "Non-Individual", t, { requireMotherName: false });
      if (Object.keys(errs).length) coApplicantErrors[party.id] = errs;
    });

    const guarantorErrors = {};
    (form.guarantors || []).forEach((party) => {
      const errs = validatePartyFields(party, party.borrowerType === "Non-Individual", t, { requireMotherName: false });
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
  // HButtonBar can fire the save callback again while the previous
  // request is still running. Guard the entire save operation.
  if (saveInProgressRef.current) {
    return {
      success: false,
      applicationNo: savedQdeRef.current?.szApplicationNo || null,
      ignored: true,
    };
  }

  saveInProgressRef.current = true;

  const result = validateForm();

  setFormErrors({
    applicant: result.applicant,
    coApplicants: result.coApplicants,
    guarantors: result.guarantors,
  });

  if (!result.isValid) {
    saveInProgressRef.current = false;

    return {
      success: false,
      applicationNo: null,
    };
  }

  // 2. Save the application and related records.
  try {
    const appNo = await persistDraft();

    // 3. Display the application number after a successful save.
      setSavedApplicationNo(appNo);
    toast.success(
      appNo
        ? `${t(
            "label.qde.msg.saved",
            "Application saved"
          )} - ${appNo}`
        : t(
            "label.qde.msg.saved",
            "Application saved"
          )
    );

    return {
      success: true,
      applicationNo: appNo,
    };
  } catch (error) {
    console.error("QDE save failed:", error);

    toast.error(
      error?.message ||
        t(
          "label.qde.msg.saveFailed",
          "Save failed"
        )
    );

    return {
      success: false,
      applicationNo:
        savedQdeRef.current?.szApplicationNo || null,
    };
  } finally {
    saveInProgressRef.current = false;
  }
}, [
  validateForm,
  persistDraft,
  form.applicationNo,
  form.coApplicants,
  form.guarantors,
  t,
  toast,
]);

  const handleReset = useCallback(() => {
    saveInProgressRef.current = false;
    currentDraftApplicationNoRef.current = null;
    savedQdeRef.current = null;
    persistedDraftRef.current = false;
    setSavedApplicationNo("");
    resetForm();
    setOcrFileName("");
    setOcrStatusKey("label.qde.status.notStarted");
    setFormErrors({ applicant: {}, coApplicants: {}, guarantors: {} });
    toast.success(t("label.qde.msg.reset", "Form reset"));
    return { success: true };
  }, [resetForm, t, toast]);

  return (
    <HBox sx={{ mt: 2, width: "100%", minWidth: 0, maxWidth: "100%" }}>
      <HBox sx={{ width: "100%", padding: "0.5rem 1rem 0 1rem", flexDirection: "column", borderBottom: "1px solid var(--drs-border-divider, hsl(215 14% 90%))" }}>
        <HBreadCrumb />
        <TitleBar title={t("label.qde.title", "Quick data entry")} />
        <HLabel
          value="Fast initial capture of applicant, product and key eligibility details before detailed data entry."
          align="left"
          colon={false}
        />
        {savedApplicationNo ? (
          <HBox sx={{ display: "flex", justifyContent: "flex-end", width: "100%", mt: 1 }}>
            <HBox sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              maxWidth: "100%",
              px: 1.25,
              py: 0.5,
              border: "1px solid var(--drs-border-divider, hsl(215 14% 90%))",
              borderRadius: "6px",
              backgroundColor: "var(--drs-surface, #fff)",
            }}>
              <HLabel
                value="Application No."
                translate={false}
                align="left"
                colon={false}
                sx={{ color: "var(--drs-text-secondary, #667085)" }}
              />
              <HLabel
                value={savedApplicationNo}
                translate={false}
                align="left"
                colon={false}
                sx={{ fontWeight: 600, overflowWrap: "anywhere" }}
              />
            </HBox>
          </HBox>
        ) : null}
      </HBox>

      <HBox sx={{ width: "100%", minWidth: 0, maxWidth: "100%" }}>
        <HBox sx={{ display: "flex", flexDirection: "column", gap: 2, pb: 8 }}>
          <HPaper sx={{ width: "100%", minWidth: 0, maxWidth: "100%" }}>

            <HBox sx={{ p: 2, width: "100%" }} data-menu-id={screenMenuId}>
              <QdeProgressBar
                isNonIndividual={isNonIndividual}
              />
              <HBox id="qde-application">
                <BusinessUnitSection
                  form={form}
                  setField={setField}
                  errors={formErrors.applicant}
                  onOpenApplicationSearch={() => setSearchDialogOpen(true)}
                  onClearApplicationNo={handleClearApplication}
                  applicationTypeOptions={lookups["los.applicationtype"]}
                  portfolioOptions={lookups["los.portfolio"]}
                />
              </HBox>

              <OcrUploadSection
                form={form}
                setField={setField}
                onFileSelect={handleFileSelect}
                ocrFileName={ocrFileName}
                ocrStatusKey={ocrStatusKey}
                docTypeOptions={lookups["los.doctype"]}
              />

             <HBox id="qde-kyc">
              <KycCheckSection
                form={form}
                setField={setField}
                aadhaarOtpTimer={aadhaarOtpTimer}
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
              </HBox>
              <HBox id="qde-applicant">
              <ApplicantDetailsSection
                form={form}
                setField={setField}
                isNonIndividual={isNonIndividual}
                verifyingMobile={Boolean(verifying.mobileSend)}
                onVerifyMobile={() => openOtp("mobile", form.mobile)}
                onVerifyEmail={() => openOtp("email", form.email)}
                errors={formErrors.applicant}
                genderOptions={lookups["party.gender"]}
                entityTypeOptions={lookups["los.entitytype"]}
                borrowerCategoryOptions={lookups["los.borrowercategory"]}
              />
              </HBox>
              {isNonIndividual ? (
                <>
                  <AuthSignatorySection
                    form={form}
                    setField={setField}
                    onVerifyAsMobile={() => openOtp("asMobile", form.asMobile)}
                    onVerifyAsEmail={() => openOtp("asEmail", form.asEmail)}
                    errors={formErrors.applicant}
                  />
                  
                  <HBox id="qde-auth-signatory-kyc">
                  <AuthSignatoryKycSection
                    form={form}
                    setField={setField}
                    aadhaarOtpTimer={aadhaarOtpTimer}
                    verifying={verifying}
                    onVerifyAsPan={handleVerifyAsPan}
                    onSendAsAadhaarOtp={handleSendAsAadhaarOtp}
                    onValidateAsAadhaarOtp={handleValidateAsAadhaarOtp}
                    onCheckAsPanAadhaarLink={handleCheckAsPanAadhaarLink}
                    errors={formErrors.applicant}
                  />
                  </HBox>
                </>
              ) : null}
              <HBox id="qde-address">
                <AddressDetailsSection
                  form={form}
                  setField={setField}
                  isNonIndividual={isNonIndividual}
                  // onPincodeLookup={handlePincodeLookup}
                  noAccordion={false}
                  errors={formErrors.applicant}
                  individualOptions={lookups["los.address.type.individual"]}
                  nonIndividualOptions={lookups["los.address.type.nonindividual"]}
                />
              </HBox>

              <CoApplicantSection
                items={form.coApplicants || []}
                onAdd={addCoApplicant}
                onRemove={removeCoApplicant}
                onChange={updateCoApplicant}
                errors={formErrors.coApplicants}
                primaryBorrowerType={form.borrowerType}
                kycHandlers={partyKycHandlers}
                primaryAddress={form}
                onSearchCustomer={handleSearchCustomer}
                lookups={lookups}
              />
              <HBox sx={{ width: "100%", minWidth: 0, maxWidth: "100%" }}>
                <GuarantorSection
                  items={form.guarantors || []}
                  onAdd={addGuarantor}
                  onRemove={removeGuarantor}
                  onChange={updateGuarantor}
                  errors={formErrors.guarantors}
                  primaryBorrowerType={form.borrowerType}
                  kycHandlers={partyKycHandlers}
                  primaryAddress={form}
                  onSearchCustomer={handleSearchCustomer}
                  lookups={lookups}
                />
              </HBox>

              <HBox id="qde-loan">
                <LoanDetailsSection
                  form={form}
                  setField={setField}
                  errors={formErrors.applicant}
                  productOptions={lookups["los.product"]}
                  schemeOptions={lookups["los.scheme"]}
                />
              </HBox>

              <HBox id="qde-sourcing">
                <SourcingDetailsSection
                  form={form}
                  setField={setField}
                  errors={formErrors.applicant}
                  channelOptions={lookups["los.channel"]}
                  branchOptions={lookups["los.branch"]}
                />
              </HBox>
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
        onClose={() =>
          setOtpDialog({
            open: false,
            field: "",
            target: "",
          })
        }
        onValidate={handleValidateOtp}
        channel={
          otpDialog.field === "mobile" || otpDialog.field === "asMobile"
            ? t("label.qde.field.mobile", "Mobile number")
            : t("label.qde.field.email", "Email")
        }
        target={otpDialog.target}
        loading={Boolean(
          otpDialog.field === "mobile" || otpDialog.field === "asMobile"
            ? verifying.mobileValidate
            : verifying.emailValidate
        )}
      />
    </HBox>
  );
};

export default ApplicationQuickDataEntry;