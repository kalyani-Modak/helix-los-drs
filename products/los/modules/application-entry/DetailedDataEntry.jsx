import { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HAxiosService,
  HBox,
  HBreadCrumb,
  HButton,
  HButtonBar,
  HDropdown,
  HLabel,
  HPaper,
  useToast,
} from "@helix/component-library";

import { LosQdeAPI } from "./apiEndpoints";
import { unwrapApiResponse } from "./unwrapApiResponse";
import { BORROWER_CATEGORIES } from "./constants/qdeOptions";
import { OCR_MAX_SIZE_BYTES, UPLOAD_STATUS } from "./constants/ddeOptions";

import OcrBanner from "./sections/OcrBanner";
import PersonalDetailsSection from "./sections/PersonalDetailsSection";
import DdeAddressDetailsSection from "./sections/DdeAddressDetailsSection";
import ContactCorrespondenceSection from "./sections/ContactCorrespondenceSection";


const ORG_ID = "001";
const STAGE_NO = 3;
const TOTAL_STAGES = 18;
const ROLE_LABEL = "Sales Manager";

const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const AADHAAR_PATTERN = /^[0-9]{12}$/;

const emptyAddress = () => ({
  addr1: "",
  addr2: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
  country: "India",
});

const INITIAL_FORM = {
  profile: "",
  title: "",
  firstName: "",
  middleName: "",
  lastName: "",
  aadhaar: "",
  pan: "",
  passportNo: "",
  dob: "",
  gender: "",
  maritalStatus: "",
  spouseName: "",
  dependents: "",
  nationality: "",
  countryOfBirth: "",
  religion: "",
  educationLevel: "",
  residenceStatus: "",
  mobile: "",
  email: "",
  homePhone: "",
  officePhone: "",
  alternateMobile: "",
  officeEmail: "",
  personalEmail: "",
  currentAddress: emptyAddress(),
  permanentAddress: { ...emptyAddress(), sameAsCurrent: false },
};

/** Immutable set by dotted path, e.g. setByPath(obj, ["currentAddress","city"], "Pune"). */
const setByPath = (obj, keys, value) => {
  const [head, ...rest] = keys;
  return {
    ...obj,
    [head]: rest.length ? setByPath(obj?.[head] || {}, rest, value) : value,
  };
};

const unwrapPayload = (response) => {
  const unwrapped = unwrapApiResponse(response);
  return (
    unwrapped?.responseJson ||
    unwrapped?.data ||
    unwrapped ||
    response?.responseJson ||
    response?.data?.responseJson ||
    response?.data?.data ||
    {}
  );
};

/** Maps the QdeWrapperDto returned by fetchQde into the DDE form shape (auto-populate). */
const qdeToDdeForm = (qde) => {
  const applicant = qde?.applicantDetails || {};
  const individual = applicant.individualDetails || {};
  const kyc = applicant.kycDetails || {};
  const address = applicant.address || {};

  return {
    profile: individual.szApplicantCategory || "",
    firstName: individual.szFirstName || "",
    middleName: individual.szMiddleName || "",
    lastName: individual.szLastName || "",
    gender: individual.szGender || "",
    dob: individual.dtDateOfBirth || "",
    aadhaar: kyc.szAadhaarNumber || "",
    pan: kyc.szPanNumber || "",
    mobile: applicant.szMobile || "",
    email: applicant.szEmail || "",
    currentAddress: {
      addr1: address.szAddressLine1 || "",
      addr2: address.szAddressLine2 || "",
      city: address.szCity || "",
      district: address.szDistrict || "",
      state: address.szState || "",
      pincode: address.iPincode != null ? String(address.iPincode) : "",
      country: address.szCountry || "India",
    },
  };
};

const validateDde = (form, t) => {
  const errors = {};
  const req = (key, value, id, msg) => {
    if (!String(value ?? "").trim()) errors[key] = t(id, msg);
  };

  req("profile", form.profile, "label.dde.validation.categoryRequired", "Borrower category is mandatory.");
  req("title", form.title, "label.dde.validation.titleRequired", "Title is mandatory.");
  req("firstName", form.firstName, "label.qde.validation.firstNameRequired", "First name is mandatory.");
  req("lastName", form.lastName, "label.qde.validation.lastNameRequired", "Last name is mandatory.");
  req("gender", form.gender, "label.qde.validation.genderRequired", "Please select gender.");
  req("maritalStatus", form.maritalStatus, "label.dde.validation.maritalRequired", "Marital status is mandatory.");
  req("nationality", form.nationality, "label.dde.validation.nationalityRequired", "Nationality is mandatory.");
  req("educationLevel", form.educationLevel, "label.dde.validation.educationRequired", "Education level is mandatory.");
  req("residenceStatus", form.residenceStatus, "label.dde.validation.residenceRequired", "Residence status is mandatory.");

  if (form.aadhaar && !AADHAAR_PATTERN.test(form.aadhaar.trim())) {
    errors.aadhaar = t("label.qde.validation.aadhaarInvalid", "Please enter a valid 12-digit Aadhaar number.");
  }
  if (form.pan && !PAN_PATTERN.test(form.pan.trim().toUpperCase())) {
    errors.pan = t("label.qde.validation.panInvalid", "Please enter a valid PAN number.");
  }

  if (!form.dob) {
    errors.dob = t("label.qde.validation.dobRequired", "Please enter a valid date of birth.");
  } else {
    const dob = new Date(form.dob);
    const today = new Date();
    dob.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    if (dob > today) errors.dob = t("label.qde.validation.dobRequired", "Please enter a valid date of birth.");
  }

  if (!form.mobile?.trim() || form.mobile.trim().length !== 10) {
    errors.mobile = t("label.qde.validation.mobileInvalid", "Please enter a valid 10-digit mobile number.");
  }
  if (!form.email?.trim()) {
    errors.email = t("label.qde.validation.emailInvalid", "Please enter a valid email address.");
  }

  // Addresses (keys are dotted so DdeAddressDetailsSection's err("currentAddress.addr1") works)
  const checkAddress = (prefix, addr) => {
    if (!addr?.addr1?.trim()) errors[`${prefix}.addr1`] = t("label.qde.validation.addressLine1Required", "Address line 1 is mandatory.");
    if (!addr?.city?.trim()) errors[`${prefix}.city`] = t("label.dde.validation.cityRequired", "City is mandatory.");
    if (!addr?.district?.trim()) errors[`${prefix}.district`] = t("label.dde.validation.districtRequired", "District is mandatory.");
    if (!addr?.state?.trim()) errors[`${prefix}.state`] = t("label.dde.validation.stateRequired", "State is mandatory.");
    if (String(addr?.pincode || "").trim().length !== 6) errors[`${prefix}.pincode`] = t("label.qde.validation.pincodeInvalid", "Please enter a valid 6-digit PIN code.");
    if (!addr?.country?.trim()) errors[`${prefix}.country`] = t("label.dde.validation.countryRequired", "Country is mandatory.");
  };
  checkAddress("currentAddress", form.currentAddress);
  checkAddress("permanentAddress", form.permanentAddress);
  return errors;
};


const StageHeader = ({ stageLabel, title, subtitle, role }) => (
  <HBox sx={{ pb: 2, mb: 2, borderBottom: "1px solid", borderColor: "divider" }}>
    <HBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
      <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <HLabel value={stageLabel} translate={false} align="left" colon={false} sx={{ fontSize: 12, color: "text.secondary" }} />
        <HLabel value={title} translate={false} align="left" colon={false} sx={{ fontSize: 22, fontWeight: 700 }} />
        <HLabel value={subtitle} translate={false} align="left" colon={false} sx={{ color: "text.secondary" }} />
      </HBox>
      <HBox
        sx={{
          px: 1.5,
          py: 0.25,
          borderRadius: 4,
          backgroundColor: "rgba(233, 30, 99, 0.08)",
          whiteSpace: "nowrap",
        }}
      >
        <HLabel value={role} translate={false} align="left" colon={false} sx={{ fontSize: 12 }} />
      </HBox>
    </HBox>
  </HBox>
);

const InfoAlert = ({ text }) => (
  <HBox
    sx={{
      border: "1px solid",
      borderColor: "rgba(46, 204, 113, 0.45)",
      backgroundColor: "rgba(46, 204, 113, 0.08)",
      borderRadius: 1.5,
      px: 2,
      py: 1.5,
      mb: 2,
    }}
  >
    <HLabel value={text} translate={false} align="left" colon={false} sx={{ fontSize: 13 }} />
  </HBox>
);


const DetailedDataEntry = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const screenMenuId = location.state?.menuId;
  const applicationNo = location.state?.applicationNo;

  const t = useCallback((id, defaultMessage) => intl.formatMessage({ id, defaultMessage }), [intl]);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [autoPopulated, setAutoPopulated] = useState(false);

  // OCR banner state (matches OcrBanner's uploadState contract)
  const [uploadState, setUploadState] = useState({ status: UPLOAD_STATUS.IDLE, fileName: "", error: "" });
  const [ocrFile, setOcrFile] = useState(null);
  const [ocrBusy, setOcrBusy] = useState(false);

  // Expand / collapse all. Changing `sectionsVersion` remounts the sections with the new default;
  // form data lives in this component, so nothing is lost. See note in the hand-off message.
  const [sectionsOpen, setSectionsOpen] = useState(true);
  const [sectionsVersion, setSectionsVersion] = useState(0);

  /** Supports plain names ("firstName") and dotted paths ("currentAddress.city"). */
  const setField = useCallback((name, value) => {
    setForm((prev) => setByPath(prev, String(name).split("."), value));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  /* ---- auto-populate from Quick Data Entry ---- */
  useEffect(() => {
    if (!applicationNo) return;
    let cancelled = false;
    setLoading(true);
    HAxiosService.GET(LosQdeAPI.fetchQde(ORG_ID, applicationNo))
      .then((res) => {
        if (cancelled) return;
        const mapped = qdeToDdeForm(unwrapPayload(res));
        setForm((prev) => ({
          ...prev,
          ...mapped,
          currentAddress: { ...prev.currentAddress, ...mapped.currentAddress },
        }));
        setAutoPopulated(true);
      })
      .catch(() => {
        if (!cancelled) toast.error(t("label.dde.msg.loadFailed", "Unable to load Quick Data Entry details"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [applicationNo, t, toast]);

  /* ---- OCR handlers ---- */
  const handleOcrUpload = useCallback((file, error) => {
    if (!file) {
      setOcrFile(null);
      setUploadState({ status: UPLOAD_STATUS.FAILED, fileName: "", error: error || "" });
      return;
    }
    if (file.size > OCR_MAX_SIZE_BYTES) {
      setUploadState({ status: UPLOAD_STATUS.FAILED, fileName: file.name, error: "File exceeds the maximum allowed size of 10 MB" });
      return;
    }
    setOcrFile(file);
    setUploadState({ status: UPLOAD_STATUS.IDLE, fileName: file.name, error: "" });
  }, []);

  const handleOcrExtract = useCallback(async () => {
    if (!ocrFile) return;
    setOcrBusy(true);
    setUploadState((prev) => ({ ...prev, status: UPLOAD_STATUS.PROCESSING, error: "" }));
    try {
      // TODO: replace with the real OCR endpoint, e.g.
      // const fd = new FormData(); fd.append("file", ocrFile);
      // const data = unwrapPayload(await HAxiosService.POST(LosDdeAPI.ocrExtract(), fd));
      // then merge the extracted values into the form with setField(...)
      await new Promise((resolve) => setTimeout(resolve, 800));
      setUploadState((prev) => ({ ...prev, status: UPLOAD_STATUS.SUCCESS }));
      toast.success(t("label.dde.msg.ocrDone", "Extraction completed"));
    } catch (error) {
      setUploadState((prev) => ({
        ...prev,
        status: UPLOAD_STATUS.FAILED,
        error: error?.message || "",
      }));
    } finally {
      setOcrBusy(false);
    }
  }, [ocrFile, t, toast]);

  /* ---- expand / collapse ---- */
  const toggleAll = useCallback((open) => {
    setSectionsOpen(open);
    setSectionsVersion((v) => v + 1);
  }, []);

  /* ---- save / reset ---- */
  const handleSave = useCallback(async () => {
    const found = validateDde(form, t);
    setErrors(found);

    const messages = Object.values(found);
    if (messages.length) {
      toast.error(
        ["Please correct the following:", "", ...messages.map((m, i) => `${i + 1}. ${m}`)].join("\n")
      );
      return { success: false };
    }

    try {
      // TODO: replace with the real DDE save endpoint
      // await HAxiosService.PUT(LosDdeAPI.save(applicationNo), buildDdePayload(form));
      toast.success(
        applicationNo
          ? `${t("label.dde.msg.saved", "Details saved")} - ${applicationNo}`
          : t("label.dde.msg.saved", "Details saved")
      );
      return { success: true };
    } catch (error) {
      toast.error(error?.message || t("label.dde.msg.saveFailed", "Save failed"));
      return { success: false };
    }
  }, [applicationNo, form, t, toast]);

  const handleReset = useCallback(() => {
    setForm(INITIAL_FORM);
    setErrors({});
    setAutoPopulated(false);
    setOcrFile(null);
    setUploadState({ status: UPLOAD_STATUS.IDLE, fileName: "", error: "" });
    toast.success(t("label.dde.msg.reset", "Form reset"));
    return { success: true };
  }, [t, toast]);

  const stageLabel = useMemo(() => `STAGE ${STAGE_NO} OF ${TOTAL_STAGES}`, []);

  return (
    <HBox sx={{ mt: 2 }} data-menu-id={screenMenuId}>
      <HBreadCrumb />

      <HBox sx={{ display: "flex", flexDirection: "column", gap: 2, pb: 8 }}>
        <HPaper>
          <HBox sx={{ p: 2, width: "100%" }}>
            <StageHeader
              stageLabel={stageLabel}
              title={t("label.dde.title", "Detailed Data Entry")}
              subtitle={t("label.dde.subtitle", "Capture full applicant, employment, income and product data.")}
              role={ROLE_LABEL}
            />

            {/* OCR banner */}
            <OcrBanner
              uploadState={uploadState}
              onUpload={handleOcrUpload}
              onExtract={handleOcrExtract}
              busy={ocrBusy}
            />

            {/* Auto-populate notice */}
            {autoPopulated ? (
              <InfoAlert
                text={t(
                  "label.dde.info.autoPopulated",
                  "Fields entered during Quick Data Entry have been auto-populated. Complete the remaining details to create a comprehensive customer profile."
                )}
              />
            ) : null}

            {/* Expand / Collapse all */}
            <HBox sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 2 }}>
              <HButton
                label={t("label.dde.button.expandAll", "Expand all")}
                translate={false}
                variant="outlined"
                size="small"
                inline
                onClick={() => toggleAll(true)}
              />
              <HButton
                label={t("label.dde.button.collapseAll", "Collapse all")}
                translate={false}
                variant="outlined"
                size="small"
                inline
                onClick={() => toggleAll(false)}
              />
            </HBox>

            {/* Borrower category (drives which income sections appear later in the flow) */}
            <HBox sx={{ width: "33%", minWidth: 280, display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
              <HLabel
                value={t("label.dde.field.borrowerCategory", "Borrower Category")}
                required
                translate={false}
                align="left"
                colon={false}
              />
              <HDropdown
                name="profile"
                options={BORROWER_CATEGORIES}
                value={form.profile}
                onChange={(e) => setField("profile", e.target.value)}
                required
                error={Boolean(errors.profile)}
                width="100%"
              />
              <HLabel
                value={t("label.dde.helper.borrowerCategory", "Auto-populated from QDE — drives which income sections appear below")}
                translate={false}
                align="left"
                colon={false}
                sx={{ fontSize: 10, color: "text.secondary" }}
              />
            </HBox>

            {/* Sections */}
            <HBox key={sectionsVersion} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <HBox id="dde-personal">
                <PersonalDetailsSection
                  form={form}
                  setField={setField}
                  errors={errors}
                  defaultExpanded={sectionsOpen}
                  disabled={loading}
                />
              </HBox>

              <HBox id="dde-address">
                <DdeAddressDetailsSection
                  form={form}
                  setField={setField}
                  errors={errors}
                  defaultExpanded={sectionsOpen}
                />
              </HBox>
               <HBox id="dde-contact">
                <ContactCorrespondenceSection
                  form={form}
                  setField={setField}
                  errors={errors}
                  defaultExpanded={sectionsOpen}
                />
              </HBox>
            </HBox>
          </HBox>
        </HPaper>
      </HBox>

      <HButtonBar
        onSave={handleSave}
        onReset={handleReset}
        onClose={() => navigate("/homelayout/welcomepage")}
        disableToast={{ save: true, reset: true, close: true }}
      />
    </HBox>
  );
};

export default DetailedDataEntry;