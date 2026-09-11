import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import { HAxiosService, HBox, HBreadCrumb, HButtonBar, HPaper, TitleBar, useToast } from "@helix/component-library";
import { LosQdeAPI } from "./apiEndpoints";
import { unwrapApiResponse } from "./unwrapApiResponse";
import { VERIFICATION_STATUS } from "./constants/qdeOptions";

import OtpVerifyDialog from "./components/OtpVerifyDialog";
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
const emptyParty = () => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  firstName: "",
  lastName: "",
  mobile: "",
  pan: "",
});

const ApplicationQuickDataEntry = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const screenMenuId = location.state?.menuId;
  const incomingApplicationNo = location.state?.applicationNo;
  const [form, setForm] = useState({});
  const [verifying, setVerifying] = useState({});
  const [otpDialog, setOtpDialog] = useState({
    open: false,
    field: "",
    target: "",
  });
  const [ocrFileName, setOcrFileName] = useState("");
  const [ocrStatusKey, setOcrStatusKey] = useState("label.qde.status.notStarted");
  const isNonIndividual = form.borrowerType === "Non-Individual";

  // Dynamic field setter
  const setField = useCallback((name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Dynamic multiple-field setter
  const setFields = useCallback((fields) => {
    setForm((prev) => ({
      ...prev,
      ...fields,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setForm({});
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

  /** Maps form state onto the backend `QdeApplicationRequest` shape. */
  const buildPayload = useCallback(() => {
    const f = form;
    return {
      applicationControl: {
        szApplicationType: f.applicationType || null,
        szPortfolioCode: f.portfolio || null,
        szBorrowerType: f.borrowerType || null,
        szCustomerType: f.customerType || null,
        szCustomerId: f.customerId || null,
      },

      kycDetails: {
        szPanNumber: f.pan || null,
        szAadhaarNumber: f.aadhaar || null,
        szCkycNumber: f.ckycNumber || null,
        szPanVerificationStatus: isVerified(f.panStatus),
        szAadhaarVerificationStatus: isVerified(f.aadhaarStatus),
        szPanAadhaarLinkageStatus: isVerified(f.panAadhaarLinked),
        szDigiLockerDocumentId: isVerified(f.digiStatus),
        mobileVerified: f.mobileVerified ?? false,
        szCkycVerificationStatus: isVerified(f.ckycStatus) ,
      },

      applicantDetails: {
        szApplicantId: null,
        szFirstName: f.firstName || null,
        szMiddleName: f.middleName || null,
        szLastName: f.lastName || null,
        dtDateOfBirth: f.dob || null,
        szGender: f.gender || null,
        szFatherName: f.fatherName || null,
        szMotherName: f.motherName || null,
        szMobile: f.mobile || null,
        szEmail: f.email || null,
        szCustomerType: f.customerType || null,
        szCustomerId: f.customerId || null,
        szApplicantCategory: f.profile || null,
        szStaffYn: "N",
        szPreApprovedYn: "N",
      },

      address: {
        szAddressType: f.addressType || null,
        szAddressLine1: f.addr1 || null,
        szAddressLine2: f.addr2 || null,
        szAddressLine3: f.addr3 || null,
        szLandmark: f.landmark || null,
        iPincode: f.pincode || null,
        szCity: f.city || null,
        szDistrict: f.district || null,
        szState: f.state || null,
        szCountry: f.country || null,
      },

      loan: {
        szLoanType: f.loanType || null,
        szProduct: f.product || null,
        szSchemeCode: f.scheme || null,
        fAppliedAmount: toNumberOrNull(f.loanAmount),
        iAppliedTenor: toNumberOrNull(f.tenure),
        fInterestRate: toNumberOrNull(f.rate),
        szTenorUnit: "MONTH",
        szCurrencyCode: "INR"
      },

      sourcing: {
        szSourcingChannel: f.channel || null,
        szSourcingBranch: f.sourcingBranch || null,
        szServicingBranch: f.servicingBranch || null ,
        // if Sourcing channel is DSA
        szDsaName: f.channel === "DSA" ? f.channelName || null : null,
        dsaCode: f.channel === "DSA" ? f.channelCode || null : null,
        dsaMobile: f.channel === "DSA" ? f.dsaMobile || null : null,
        dsaEmail: f.channel === "DSA" ? f.dsaEmail || null : null,
        // if Sourcing channel is RM
        salesOfficerName: f.channel === "RM" ? f.rmName || null : null,
        salesOfficerCode: f.channel === "RM" ? f.rmCode || null : null,
      },

      coApplicants: (f.coApplicants || []).map((c) => ({
        szFirstName: c.firstName || null,
        szMiddleName: c.middleName || null,
        lastName: c.lastName || null,
        szMobile: c.mobile || null,
        szGender: c.gender || null,
        dtDateOfBirth: c.dateOfBirth || null,
        szApplicantCategory: c.applicationType || null,
        szMobile: c.szMobile,
        szEmail: c.email,      
        address: {
          szAddressType: c.addressType || null,
          szAddressLine1: c.addr1 || null,
          szAddressLine2: c.addr2 || null,
          szAddressLine3: c.addr3 || null,
          szLandmark: c.landmark || null,
          iPincode: c.pincode || null,
          szCity: c.city || null,
          szDistrict: c.district || null,
          szState: c.state || null,
          szCountry: c.country || null,
        },
        kycDetails: {
          szPanNumber: c.pan || null,
          szAadhaarNumber: c.aadhaar || null,
          szCkycNumber: c.ckycNumber || null,
          szPanVerificationStatus: isVerified(c.panStatus),
          szAadhaarVerificationStatus: isVerified(c.aadhaarStatus),
          szPanAadhaarLinkageStatus: isVerified(c.panAadhaarLinked),
          szDigiLockerDocumentId: isVerified(c.digiStatus),
          mobileVerified: c.mobileVerified ?? false,
          szCkycVerificationStatus: isVerified(c.ckycStatus),
        },
      })),

      guarantors: (f.guarantors || []).map((g) => ({
        szFirstName: g.firstName || null,
        szMiddleName: g.middleName || null,
        lastName: g.lastName || null,
        szMobile: g.mobile || null,
        szGender: g.gender || null,
        dtDateOfBirth: g.dateOfBirth || null,
        szApplicantCategory: g.applicationType || null,
        szMobile: g.szMobile,
        szEmail: g.email,
        address: {
          szAddressType: g.addressType || null,
          szAddressLine1: g.addr1 || null,
          szAddressLine2: g.addr2 || null,
          szAddressLine3: g.addr3 || null,
          szLandmark: g.landmark || null,
          iPincode: g.pincode || null,
          szCity: g.city || null,
          szDistrict: g.district || null,
          szState: g.state || null,
          szCountry: g.country || null,
        },
        kycDetails: {
          szPanNumber: g.pan || null,
          szAadhaarNumber: g.aadhaar || null,
          szCkycNumber: g.ckycNumber || null,
          szPanVerificationStatus: isVerified(g.panStatus),
          szAadhaarVerificationStatus: isVerified(g.aadhaarStatus),
          szPanAadhaarLinkageStatus: isVerified(g.panAadhaarLinked),
          szDigiLockerDocumentId: isVerified(g.digiStatus),
          mobileVerified: g.mobileVerified ?? false,
          szCkycVerificationStatus: isVerified(g.ckycStatus),
        },
      })),
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

  const t = useCallback(
    (id, defaultMessage) => intl.formatMessage({ id, defaultMessage }),
    [intl]
  );

  const setBusy = useCallback((key, value) => {
    setVerifying((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Re-opening an existing draft from the worklist passes the application number in route state.
  useEffect(() => {
    if (!incomingApplicationNo) return;
    HAxiosService.GET(LosQdeAPI.getByAppNo(incomingApplicationNo))
      .then((res) => hydrateFromResponse(unwrapApiResponse(res)))
      .catch(() => toast.error(t("label.qde.msg.loadFailed", "Unable to load application")));
  }, [incomingApplicationNo, hydrateFromResponse, t, toast]);

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

  const handlePincodeLookup = useCallback(
    async (pincode) => {
      if (!pincode || String(pincode).length !== 6) return;
      try {
        const data = unwrapApiResponse(await HAxiosService.GET(LosQdeAPI.pincode(pincode)));
        if (!data) return;
        setFields({
          city: data.city || "",
          district: data.district || "",
          state: data.state || "",
          country: data.country || "India",
        });
      } catch {
        toast.error(t("label.qde.msg.pincodeFailed", "Unable to fetch pincode details"));
      }
    },
    [setFields, t, toast]
  );

  // ---- OCR -----------------------------------------------------------------

  const handleFileSelect = useCallback((file) => {
    setOcrFileName(file?.name || "");
    setOcrStatusKey(file ? "label.qde.status.pending" : "label.qde.status.notStarted");
  }, []);

  // ---- Persistence ---------------------------------------------------------

  /** Creates or updates the draft and returns the resulting application number. */
  const persistDraft = useCallback(async () => {
    const payload = buildPayload();
    console.log("------------",LosQdeAPI.createDraft());
    
    const response = form.applicationNo
      ? await HAxiosService.PUT(LosQdeAPI.updateDraft(form.applicationNo), payload)
      : await HAxiosService.POST(LosQdeAPI.createDraft(), payload);

    const data = unwrapApiResponse(response);
    const appNo = data?.applicationNumber || data?.applicationNo || form.applicationNo;
    if (appNo && appNo !== form.applicationNo) setField("applicationNo", appNo);
    return appNo;
  }, [buildPayload, form.applicationNo, setField]);

  const validateForm = () => {
    console.log("------------", form);
    
        const errors = [];
        if (!form.szApplicationType?.trim()) {
            errors.push(intl.formatMessage({
                    id: "error.qde.appliTypeMandatory",
                    defaultMessage: "Application type is mandatory."
        }));}
        if (!form.portfolioCode?.trim()) {
            errors.push(intl.formatMessage({
                    id: "error.qde.portfolioMandatory",
                    defaultMessage: "Portfolio is mandatory."
        }));}
        if (!form.szFirstName?.trim()) {
            errors.push(intl.formatMessage({
                    id: "error.qde.firstNameMandatory",
                    defaultMessage: "First Name is mandatory."
        }));}
        if (!form.szLastName?.trim()) {
            errors.push(intl.formatMessage({
                    id: "error.qde.lastNameMandatory",
                    defaultMessage: "Last Name is mandatory."
        }));}
        if (!form.dtDateOfBirth?.trim()) {
            errors.push(intl.formatMessage({
                    id: "error.qde.dobMandatory",
                    defaultMessage: "Please enter a valid Date of Birth."
        }));}
        if (!form.szGender?.trim()) {
            errors.push(intl.formatMessage({
                    id: "error.qde.genderMandatory",
                    defaultMessage: "Please select Gender."
        }));}
        if (!form.szEmail?.trim()) {
            errors.push(intl.formatMessage({
                    id: "error.qde.dobMandatory",
                    defaultMessage: "Please enter a valid email address."
        }));}
        if (!form.szMobile?.trim()) {
            errors.push(intl.formatMessage({
                    id: "error.qde.MobNoMandatory",
                    defaultMessage: "Please enter a valid 10-digit mobile number."
        }));}
        if (!form.szAddressType?.trim()) {
            errors.push(intl.formatMessage({
                    id: "error.qde.AddTypeMandatory",
                    defaultMessage: "Please select Address Type."
        }));}
        if (!form.addr1?.trim()) {
            errors.push(intl.formatMessage({
                    id: "error.qde.addLineMandatory",
                    defaultMessage: "Address Line 1 is mandatory."
        }));}
        if (form.addr1?.trim() && form.addr1.length > 100) {
            errors.push(intl.formatMessage({
                    id: "error.qde.limitExceeded",
                    defaultMessage: "Address Line 1 cannot exceed 100 characters."
        }));}
        if (!form.szLandmark?.trim() && form.szBorrowerType === 'Individual') {
            errors.push(intl.formatMessage({
                    id: "error.qde.landmarkMandatory",
                    defaultMessage: "Landmark is mandatory."
        }));}
        if (!form.iPincode?.trim()) {
            errors.push(intl.formatMessage({
                    id: "error.qde.pinMandatory",
                    defaultMessage: "Please enter a valid 6-digit PIN code."
        }));}
        if (!form.fAppliedAmount?.trim() || form.fAppliedAmount?.trim() === 0) {
            errors.push(intl.formatMessage({
                    id: "error.qde.amoutMandatory",
                    defaultMessage: "Please enter a valid Limit amount."
        }));}
        if (!form.tenure?.trim() || form.tenure?.trim() === 0) {
            errors.push(intl.formatMessage({
                    id: "error.qde.amoutMandatory",
                    defaultMessage: "Please enter a valid tenure in months."
        }));}

        if (!form.dealerName?.trim() && form.sourcingChannel?.trim() === 'Dealer') {
            errors.push(intl.formatMessage({
                    id: "error.qde.amoutMandatory",
                    defaultMessage: "Please select Dealer Name."
        }));}
        if (!form.rmName?.trim() && form.sourcingChannel?.trim() === 'rm') {
            errors.push(intl.formatMessage({
                    id: "error.qde.amoutMandatory",
                    defaultMessage: "Please enter a valid tenure in months."
        }));}
        if (!form.dsaName?.trim() && form.sourcingChannel?.trim() === 'dsa') {
            errors.push(intl.formatMessage({
                    id: "error.qde.amoutMandatory",
                    defaultMessage: "Please enter a valid tenure in months."
        }));}

        return errors;
  }

  const handleSave = useCallback(async () => {
    try {
      // const errors = validateForm();
      // if (errors.length > 0) {
      //   toast.error(errors.join("\n"));
      //   return;
      // }

      const appNo = await persistDraft();
      toast.success(
        appNo
          ? `${t("label.qde.msg.saved", "Application saved")} - ${appNo}`
          : t("label.qde.msg.saved", "Application saved")
      );
      return { success: false };
    } catch (error) {
      toast.error(error?.message || t("label.qde.msg.saveFailed", "Save failed"));
      return { success: false };
    }
  }, [persistDraft, t, toast, form]);

  // const handleSubmit = useCallback(async () => {
  //   setBusy("submit", true);
  //   try {
  //     const appNo = await persistDraft();
  //     if (!appNo) {
  //       toast.error(t("label.qde.msg.submitFailed", "Submit failed"));
  //       return;
  //     }
  //     const data = unwrapApiResponse(await HAxiosService.POST(LosQdeAPI.submit(appNo), buildPayload()));
  //     hydrateFromResponse(data);
  //     toast.success(`${t("label.qde.msg.submitted", "Application submitted")} - ${appNo}`);
  //   } catch (error) {
  //     toast.error(error?.message || t("label.qde.msg.submitFailed", "Submit failed"));
  //   } finally {
  //     setBusy("submit", false);
  //   }
  // }, [buildPayload, hydrateFromResponse, persistDraft, setBusy, t, toast]);

  const handleReset = useCallback(() => {
    resetForm();
    setOcrFileName("");
    setOcrStatusKey("label.qde.status.notStarted");
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
              <BusinessUnitSection form={form} setField={setField} />

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
              />

              <ApplicantDetailsSection
                form={form}
                setField={setField}
                isNonIndividual={isNonIndividual}
                verifyingMobile={Boolean(verifying.mobileSend)}
                onVerifyMobile={() => openMobileOtp("mobile", form.mobile)}
                onVerifyEmail={() => setField("emailVerified", true)}
              />

              {isNonIndividual ? (
                <>
                  <AuthSignatorySection
                    form={form}
                    setField={setField}
                    verifyingMobile={Boolean(verifying.mobileSend)}
                    onVerifyAsMobile={() => openMobileOtp("asMobile", form.asMobile)}
                    onVerifyAsEmail={() => setField("asEmailVerified", true)}
                  />

                  <AuthSignatoryKycSection
                    form={form}
                    setField={setField}
                    verifying={verifying}
                    onVerifyAsPan={handleVerifyAsPan}
                    onSendAsAadhaarOtp={handleSendAsAadhaarOtp}
                    onValidateAsAadhaarOtp={handleValidateAsAadhaarOtp}
                    onCheckAsPanAadhaarLink={handleCheckAsPanAadhaarLink}
                  />
                </>
              ) : null}

              <AddressDetailsSection
                form={form}
                setField={setField}
                isNonIndividual={isNonIndividual}
                onPincodeLookup={handlePincodeLookup}
                noAccordion={false}
              />

              <CoApplicantSection
                items={form.coApplicants || []}
                onAdd={addCoApplicant}
                onRemove={removeCoApplicant}
                onChange={updateCoApplicant}
              />

              <GuarantorSection
                items={form.guarantors || []}
                onAdd={addGuarantor}
                onRemove={removeGuarantor}
                onChange={updateGuarantor}
              />

              <LoanDetailsSection form={form} setField={setField} />

              <SourcingDetailsSection form={form} setField={setField} />
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
