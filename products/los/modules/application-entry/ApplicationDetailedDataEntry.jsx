import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HAxiosService,
  HBox,
  HBreadCrumb,
  HButtonBar,
  HButton,
  HPaper,
  TitleBar,
  useToast,
  HLabel,
} from "@helix/component-library";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import UnfoldMoreOutlinedIcon from "@mui/icons-material/UnfoldMoreOutlined";
import UnfoldLessOutlinedIcon from "@mui/icons-material/UnfoldLessOutlined";

import { LosDdeAPI, LosQdeAPI } from "./apiEndpoints";
import { unwrapApiResponse } from "./unwrapApiResponse";
import { DDE_SECTION_CONFIG } from "./constants/ddeSections";
import { DDE_FIELDS } from "./constants/ddeFieldMetadata";
import { isDdeSectionVisible } from "./utils/ddeFieldVisibility";
import { applyDdeIncomePatch } from "./utils/ddeIncomeCalculations";
import { syncPermanentFromCurrent } from "./utils/ddeAddressSync";
import { validateDdeForm } from "./utils/ddeValidation";
import { mapQdeToDdePrefill, mapQdePartiesToDde } from "./utils/mapQdeToDdePrefill";
import {
  buildDdeSavePayload,
  hydrateDdeFormFromApi,
  unwrapDdePayload,
} from "./utils/mapDdeApiPayload";
import { computeAgeFromDob, createEmptyDdeForm } from "./utils/ddeFormState";
import { useDdeLookups } from "./hooks/useDdeLookups";
import DdeFieldGrid from "./components/DdeFieldGrid";
import DdeFormSection from "./components/DdeFormSection";
import PerfiosSection from "./sections/PerfiosSection";
import DdeOcrUploadSection from "./sections/DdeOcrUploadSection";
import DdePartyListSection from "./sections/DdePartyListSection";

const ORG_ID = "001";
const BORROWER_CATEGORY_FIELDS = DDE_FIELDS.filter((field) => field.name === "customerType");
const EXPANDABLE_SECTION_KEYS = [
  ...DDE_SECTION_CONFIG.map((sectionConfig) => sectionConfig.key),
  "ddeCoApplicants",
  "ddeGuarantors",
];

const SECTION_ICONS = {
  personal: <PersonOutlineOutlinedIcon fontSize="small" />,
  currentAddress: <LocationOnOutlinedIcon fontSize="small" />,
  permanentAddress: <LocationOnOutlinedIcon fontSize="small" />,
  contact: <PersonOutlineOutlinedIcon fontSize="small" />,
  employment: <WorkOutlineOutlinedIcon fontSize="small" />,
  income: <WorkOutlineOutlinedIcon fontSize="small" />,
  sep: <WorkOutlineOutlinedIcon fontSize="small" />,
  senp: <WorkOutlineOutlinedIcon fontSize="small" />,
  pensioner: <WorkOutlineOutlinedIcon fontSize="small" />,
  bank: <AccountBalanceOutlinedIcon fontSize="small" />,
  tax: <ReceiptLongOutlinedIcon fontSize="small" />,
  loan: <ReceiptLongOutlinedIcon fontSize="small" />,
};

const ApplicationDetailedDataEntry = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const screenMenuId = location.state?.menuId;
  const incomingApplicationNo = location.state?.applicationNo;

  const [form, setForm] = useState(createEmptyDdeForm);
  const [formErrors, setFormErrors] = useState({});
  const [savedApplicationNo, setSavedApplicationNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  const { lookups } = useDdeLookups(ORG_ID);

  const t = useCallback(
    (id, fallback) => intl.formatMessage({ id, defaultMessage: fallback }),
    [intl]
  );

  const setField = useCallback((name, value) => {
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "dob") {
        next.age = computeAgeFromDob(value);
      }
      const incomePatch = applyDdeIncomePatch(next);
      if (incomePatch) {
        Object.assign(next, incomePatch);
      }
      const addressPatch = syncPermanentFromCurrent(next);
      if (addressPatch) {
        Object.assign(next, addressPatch);
      }
      return next;
    });
  }, []);

  const setAllSectionsExpanded = useCallback((expanded) => {
    setExpandedSections(
      Object.fromEntries(EXPANDABLE_SECTION_KEYS.map((key) => [key, expanded]))
    );
  }, []);

  const setSectionExpanded = useCallback(
    (sectionKey, expanded) =>
      setExpandedSections((prev) => ({ ...prev, [sectionKey]: expanded })),
    []
  );

  const loadFromQde = useCallback(async (appNo) => {
    const response = await HAxiosService.GET(LosQdeAPI.fetchQde(ORG_ID, appNo)).then(
      unwrapApiResponse
    );
    const payload = response?.responseJson || response?.data || response;
    const applicant = payload?.applicantDetails || {};
    const individual = applicant.individualDetails || {};
    const address = applicant.address || {};
    const loan = payload?.loanDetails || {};
    const qdeShape = {
      firstName: individual.szFirstName,
      middleName: individual.szMiddleName,
      lastName: individual.szLastName,
      gender: individual.szGender,
      dob: individual.dtDateOfBirth,
      mobile: applicant.szMobile,
      email: applicant.szEmail,
      pan: applicant.kycDetails?.szPanNumber,
      aadhaar: applicant.kycDetails?.szAadhaarNumber,
      profile: individual.szApplicantCategory,
      addr1: address.szAddressLine1,
      addr2: address.szAddressLine2,
      city: address.szCity,
      district: address.szDistrict,
      state: address.szState,
      pincode: address.iPincode,
      country: address.szCountry,
      loanAmount: loan.requestedAmount,
      tenure: loan.tenureMonths,
      coApplicants: payload?.coApplicants,
      guarantors: payload?.guarantors,
    };
    const prefill = mapQdeToDdePrefill(qdeShape);
    setForm((prev) => ({
      ...prev,
      ...prefill,
      applicationNo: appNo,
      coApplicants:
        prev.coApplicants?.length > 0
          ? prev.coApplicants
          : mapQdePartiesToDde(qdeShape.coApplicants || [], "co"),
      guarantors:
        prev.guarantors?.length > 0
          ? prev.guarantors
          : mapQdePartiesToDde(qdeShape.guarantors || [], "guarantor"),
    }));
  }, []);

  const loadDde = useCallback(
    async (appNo) => {
      setLoading(true);
      try {
        const response = await HAxiosService.GET(LosDdeAPI.fetchDde(ORG_ID, appNo)).then(
          unwrapApiResponse
        );
        const data = unwrapDdePayload(response);
        if (data && Object.keys(data).length > 0) {
          setForm((prev) => ({ ...prev, ...hydrateDdeFormFromApi(data) }));
        } else {
          await loadFromQde(appNo);
        }
        setSavedApplicationNo(appNo);
      } catch {
        await loadFromQde(appNo);
        setSavedApplicationNo(appNo);
      } finally {
        setLoading(false);
      }
    },
    [loadFromQde]
  );

  useEffect(() => {
    if (incomingApplicationNo) {
      loadDde(String(incomingApplicationNo));
    }
  }, [incomingApplicationNo, loadDde]);

  const persistDde = useCallback(async () => {
    const payload = buildDdeSavePayload(ORG_ID, form.applicationNo || savedApplicationNo, form);
    const appNo = form.applicationNo || savedApplicationNo;
    const url = appNo ? LosDdeAPI.updateDde(appNo) : LosDdeAPI.saveDde();
    const response = await HAxiosService.POST(url, payload).then(unwrapApiResponse);
    const data = unwrapDdePayload(response);
    const newAppNo =
      data?.szApplicationNo ||
      data?.applicationNo ||
      response?.responseJson?.szApplicationNo ||
      appNo;
    if (newAppNo) {
      setSavedApplicationNo(String(newAppNo));
      setField("applicationNo", String(newAppNo));
    }
    return newAppNo;
  }, [form, savedApplicationNo, setField]);

  const handleSave = useCallback(async () => {
    const errors = validateDdeForm(form, intl);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error(t("label.dde.msg.validationFailed", "Please fix validation errors."));
      return { success: false };
    }
    try {
      await persistDde();
      toast.success(t("label.dde.msg.saved", "Detailed data entry saved successfully."));
      return { success: true };
    } catch (error) {
      toast.error(error?.message || t("label.dde.msg.saveFailed", "Unable to save detailed data entry."));
      return { success: false };
    }
  }, [form, intl, persistDde, t, toast]);

  const handleReset = useCallback(() => {
    setForm(createEmptyDdeForm());
    setFormErrors({});
    setSavedApplicationNo("");
    toast.success(t("label.dde.msg.reset", "Form reset."));
    return { success: true };
  }, [t, toast]);

  return (
    <HBox>
      <HBox>
        <HBreadCrumb />
        <TitleBar title={t("label.dde.title", "Detailed data entry")} />
        <HLabel value="label.dde.subtitle" align="left" colon={false} />
        {savedApplicationNo ? (
          <HLabel
            value={`${t("label.dde.field.applicationNo", "Application number")}: ${savedApplicationNo}`}
            align="left"
            colon={false}
          />
        ) : null}
      </HBox>

      <HPaper>
        <HBox data-menu-id={screenMenuId}>
          {loading ? (
            <HLabel value="label.dde.msg.loading" align="left" colon={false} />
          ) : (
            <>
              <DdeOcrUploadSection />
              <HBox
                sx={{
                  width: "100%",
                  p: 1.25,
                  mb: 2,
                  border: "1px solid #86efac",
                  borderRadius: 2,
                  backgroundColor: "#f0fdf4",
                  boxSizing: "border-box",
                }}
              >
                <HLabel
                  value="label.dde.prefillNotice"
                  align="left"
                  colon={false}
                  sx={{ color: "#14532d", fontSize: 12 }}
                />
              </HBox>
              <HBox
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: 1,
                  width: "100%",
                  mb: 1.5,
                }}
              >
                <HButton
                  label="label.dde.button.expandAll"
                  variant="outlined"
                  size="small"
                  inline
                  startIcon={<UnfoldMoreOutlinedIcon fontSize="small" />}
                  onClick={() => setAllSectionsExpanded(true)}
                />
                <HButton
                  label="label.dde.button.collapseAll"
                  variant="outlined"
                  size="small"
                  inline
                  startIcon={<UnfoldLessOutlinedIcon fontSize="small" />}
                  onClick={() => setAllSectionsExpanded(false)}
                />
              </HBox>
              <HBox sx={{ width: "100%", mb: 2 }}>
                <DdeFieldGrid
                  fields={BORROWER_CATEGORY_FIELDS}
                  form={form}
                  setField={setField}
                  errors={formErrors}
                  lookups={lookups}
                />
              </HBox>
              {DDE_SECTION_CONFIG.map((sectionConfig) => {
                if (!isDdeSectionVisible(sectionConfig, form)) {
                  return null;
                }
                if (sectionConfig.custom === "perfios") {
                  return (
                    <PerfiosSection
                      key={sectionConfig.key}
                      form={form}
                      setField={setField}
                      expanded={expandedSections[sectionConfig.key]}
                      onExpandedChange={(expanded) =>
                        setSectionExpanded(sectionConfig.key, expanded)
                      }
                    />
                  );
                }
                return (
                  <DdeFormSection
                    key={sectionConfig.key}
                    sectionConfig={sectionConfig}
                    icon={SECTION_ICONS[sectionConfig.key]}
                    form={form}
                    setField={setField}
                    errors={formErrors}
                    lookups={lookups}
                    expanded={expandedSections[sectionConfig.key]}
                    onExpandedChange={(expanded) =>
                      setSectionExpanded(sectionConfig.key, expanded)
                    }
                  />
                );
              })}
              <DdePartyListSection
                variant="co"
                titleKey="label.dde.section.coApplicant"
                subTitleKey="label.dde.section.coApplicant.subtitle"
                items={form.coApplicants || []}
                onAdd={(party) =>
                  setForm((prev) => ({
                    ...prev,
                    coApplicants: [...(prev.coApplicants || []), party],
                  }))
                }
                onRemove={(id) =>
                  setForm((prev) => ({
                    ...prev,
                    coApplicants: (prev.coApplicants || []).filter((p) => p.id !== id),
                  }))
                }
                onChange={(rows) => setForm((prev) => ({ ...prev, coApplicants: rows }))}
                lookups={lookups}
                expanded={expandedSections.ddeCoApplicants}
                onExpandedChange={(expanded) =>
                  setSectionExpanded("ddeCoApplicants", expanded)
                }
              />
              <DdePartyListSection
                variant="guarantor"
                titleKey="label.dde.section.guarantor"
                subTitleKey="label.dde.section.guarantor.subtitle"
                items={form.guarantors || []}
                onAdd={(party) =>
                  setForm((prev) => ({
                    ...prev,
                    guarantors: [...(prev.guarantors || []), party],
                  }))
                }
                onRemove={(id) =>
                  setForm((prev) => ({
                    ...prev,
                    guarantors: (prev.guarantors || []).filter((p) => p.id !== id),
                  }))
                }
                onChange={(rows) => setForm((prev) => ({ ...prev, guarantors: rows }))}
                lookups={lookups}
                expanded={expandedSections.ddeGuarantors}
                onExpandedChange={(expanded) =>
                  setSectionExpanded("ddeGuarantors", expanded)
                }
              />
            </>
          )}
        </HBox>
      </HPaper>

      <HButtonBar
        onSave={handleSave}
        onReset={handleReset}
        onClose={() => navigate("/homelayout/welcomepage")}
        disableToast={{ save: true, reset: true, close: true }}
      />

    </HBox>
  );
};

export default ApplicationDetailedDataEntry;
