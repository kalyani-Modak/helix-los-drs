import { useCallback, useEffect, useMemo, useState } from "react";
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

import { LosDdeAPI } from "./apiEndpoints";
import { DDE_SECTION_CONFIG } from "./constants/ddeSections";
import { DDE_FIELDS } from "./constants/ddeFieldMetadata";
import { isDdeSectionVisible } from "./utils/ddeFieldVisibility";
import {
  applyDdeIncomePatch,
  getDdeIncomeAveragePatch,
} from "./utils/ddeIncomeCalculations";
import { syncPermanentFromCurrent } from "./utils/ddeAddressSync";
import { validateDdeForm } from "./utils/ddeValidation";
import {
  buildDdeSavePayload,
  hydrateDdeFormFromApi,
  unwrapDdePayload,
} from "./utils/mapDdeApiPayload";
import { computeAgeFromDob, createEmptyDdeForm } from "./utils/ddeFormState";
import { useDdeLookups } from "./hooks/useDdeLookups";
import { useQdeLookups } from "./hooks/useQdeLookups";
import DdeFieldGrid from "./components/DdeFieldGrid";
import DdeFormSection from "./components/DdeFormSection";
import PerfiosSection from "./sections/PerfiosSection";
import DdeOcrUploadSection from "./sections/DdeOcrUploadSection";
import DdePartyListSection from "./sections/DdePartyListSection";
import DdeIncomeSection from "./sections/DdeIncomeSection";
import DdeTaxSection from "./sections/DdeTaxSection";
import { partySubsections } from "./utils/ddePartyFields";

const ORG_ID = "001";
const TEMP_APPLICATION_NO = "APP-HL2600238";
const DDE_SHARED_LOOKUP_TYPES = [
  "party.gender",
  "los.borrowercategory",
  "los.address.type.individual",
  "los.address.type.nonindividual",
];
const BORROWER_CATEGORY_FIELDS = DDE_FIELDS.filter((field) => field.name === "customerType");
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
  const orgId = location.state?.orgId || ORG_ID;
  const screenMenuId = location.state?.menuId;
  const incomingApplicationNo = location.state?.applicationNo || TEMP_APPLICATION_NO;
  const [form, setForm] = useState(createEmptyDdeForm);
  const [formErrors, setFormErrors] = useState({});
  const [savedApplicationNo, setSavedApplicationNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  const { lookups: ddeLookups, loading: ddeLookupsLoading } = useDdeLookups(orgId);
  const { lookups: qdeLookups, loading: qdeLookupsLoading } = useQdeLookups(
    orgId,
    DDE_SHARED_LOOKUP_TYPES
  );
  const lookups = useMemo(
    () => ({ ...ddeLookups, ...qdeLookups }),
    [ddeLookups, qdeLookups]
  );
  const lookupsLoading = ddeLookupsLoading || qdeLookupsLoading;

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
      const incomeAveragePatch = getDdeIncomeAveragePatch(name, value, prev);
      if (incomeAveragePatch) {
        Object.assign(next, incomeAveragePatch);
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
    const partySectionKeys = [
      ...(form.coApplicants || []).flatMap((party) =>
        partySubsections(
          "co",
          (lookups["los.coapplicanttype"] || []).find((option) => option.value === party.type)
            ?.label === "Non-Earning"
        ).map(
          (subsection) => `co-${party.id}-${subsection.key}`
        )
      ),
      ...(form.guarantors || []).flatMap((party) =>
        partySubsections("guarantor", false).map(
          (subsection) => `guarantor-${party.id}-${subsection.key}`
        )
      ),
    ];
    setExpandedSections((prev) => ({
      ...prev,
      ...Object.fromEntries(
        DDE_SECTION_CONFIG.map((sectionConfig) => [sectionConfig.key, expanded])
      ),
      ...Object.fromEntries(partySectionKeys.map((key) => [key, expanded])),
    }));
  }, [form.coApplicants, form.guarantors, lookups]);

  const setSectionExpanded = useCallback(
    (sectionKey, expanded) =>
      setExpandedSections((prev) => ({ ...prev, [sectionKey]: expanded })),
    []
  );

  const loadDde = useCallback(
    async (appNo) => {
      setLoading(true);
      try {
        const response = await HAxiosService.GET(LosDdeAPI.fetchDdeSections(appNo));
        const data = unwrapDdePayload(response);
        setForm((prev) => ({
          ...prev,
          ...hydrateDdeFormFromApi(data, lookups),
          applicationNo: data?.szApplicationNo || appNo,
        }));
        setSavedApplicationNo(data?.szApplicationNo || appNo);
      } catch (error) {
        toast.error(
          error?.message || t("label.dde.msg.loadFailed", "Unable to load detailed data entry.")
        );
      } finally {
        setLoading(false);
      }
    },
    [lookups, t, toast]
  );

  useEffect(() => {
    if (incomingApplicationNo && !lookupsLoading) {
      loadDde(incomingApplicationNo);
    }
  }, [incomingApplicationNo, loadDde, lookupsLoading]);

  const persistDde = useCallback(async () => {
    const appNo = form.applicationNo || savedApplicationNo;
    if (!appNo) {
      throw new Error("Application number is required to save detailed data entry.");
    }
    const payload = buildDdeSavePayload(orgId, appNo, form, lookups);
    const response = await HAxiosService.POST(LosDdeAPI.saveDdeSections(appNo), payload);
    const data = unwrapDdePayload(response);
    const newAppNo = data?.szApplicationNo || appNo;
    if (newAppNo) {
      setSavedApplicationNo(String(newAppNo));
      setField("applicationNo", String(newAppNo));
    }
    if (data?.parties?.length) {
      setForm((prev) => ({ ...prev, ...hydrateDdeFormFromApi(data, lookups) }));
    }
    return newAppNo;
  }, [form, lookups, orgId, savedApplicationNo, setField]);

  const handleSave = useCallback(async () => {
    const errors = validateDdeForm(form, intl, lookups);
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
  }, [form, intl, lookups, persistDde, t, toast]);

  const handleReset = useCallback(() => {
    setForm(createEmptyDdeForm());
    setFormErrors({});
    setSavedApplicationNo("");
    toast.success(t("label.dde.msg.reset", "Form reset."));
    return { success: true };
  }, [t, toast]);

  return (
    <HBox>
      <HBox sx={{p:"0rem 1rem 0rem 1rem",  borderBottom: "1px solid #8c8d8f",}}>
        <HBreadCrumb />
        <TitleBar title={t("label.dde.title", "Detailed Data Entry")} />
        <HLabel value="label.dde.subtitle" align="left" colon={false} />
      </HBox>

      <HPaper sx={{p:"1rem 2rem 0rem 2rem"}}>
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
                    />
                  );
                }
                if (sectionConfig.key === "income") {
                  return (
                    <DdeIncomeSection
                      key={sectionConfig.key}
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
                }
                if (sectionConfig.key === "tax") {
                  return (
                    <DdeTaxSection
                      key={sectionConfig.key}
                      form={form}
                      setField={setField}
                      errors={formErrors}
                      icon={SECTION_ICONS[sectionConfig.key]}
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
                borrower={form}
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
                expandedSections={expandedSections}
                onSectionExpandedChange={setSectionExpanded}
              />
              <DdePartyListSection
                variant="guarantor"
                titleKey="label.dde.section.guarantor"
                subTitleKey="label.dde.section.guarantor.subtitle"
                borrower={form}
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
                expandedSections={expandedSections}
                onSectionExpandedChange={setSectionExpanded}
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
