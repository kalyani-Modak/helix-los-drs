import { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HAxiosService,
  HBox,
  HBreadCrumb,
  HButtonBar,
  HPaper,
  TitleBar,
  useToast,
} from "@helix/component-library";

import { LosQdeAPI } from "./apiEndpoints";
import { unwrapApiResponse } from "./unwrapApiResponse";
import { VERIFICATION_STATUS } from "./constants/qdeOptions";
import useQuickDataEntryForm from "./hooks/useQuickDataEntryForm";
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

/** A verification endpoint counts as passed unless it explicitly says otherwise. */
const isPassed = (data) => data?.verified !== false && data?.matched !== false;

const ApplicationQuickDataEntry = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const screenMenuId = location.state?.menuId;
  const incomingApplicationNo = location.state?.applicationNo;

  const {
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
  } = useQuickDataEntryForm();

  const [verifying, setVerifying] = useState({});
  const [otpDialog, setOtpDialog] = useState({ open: false, field: "", target: "" });
  const [ocrFileName, setOcrFileName] = useState("");
  const [ocrStatusKey, setOcrStatusKey] = useState("label.qde.status.notStarted");

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
        mobileNumber: form.mobile || undefined,
        referenceNumber: form.digiRef || undefined,
        aadhaarNumber: form.aadhaar || undefined,
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
    const response = form.applicationNo
      ? await HAxiosService.PUT(LosQdeAPI.updateDraft(form.applicationNo), payload)
      : await HAxiosService.POST(LosQdeAPI.createDraft(), payload);

    const data = unwrapApiResponse(response);
    const appNo = data?.applicationNumber || data?.applicationNo || form.applicationNo;
    if (appNo && appNo !== form.applicationNo) setField("applicationNo", appNo);
    return appNo;
  }, [buildPayload, form.applicationNo, setField]);

  const handleSave = useCallback(async () => {
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
  }, [persistDraft, t, toast]);

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
    <Box sx={{ mt: 2 }}>
      <HBreadCrumb />
      <TitleBar title={t("label.qde.title", "Quick data entry")} />
      <HBox>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pb: 8 }}>
          <HPaper>
            <Box sx={{ p: 2, width: "100%" }} data-menu-id={screenMenuId}>
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
              />

              <CoApplicantSection
                items={form.coApplicants}
                onAdd={addCoApplicant}
                onRemove={removeCoApplicant}
                onChange={updateCoApplicant}
              />

              <GuarantorSection
                items={form.guarantors}
                onAdd={addGuarantor}
                onRemove={removeGuarantor}
                onChange={updateGuarantor}
              />

              <LoanDetailsSection form={form} setField={setField} />

              <SourcingDetailsSection form={form} setField={setField} />
            </Box>
          </HPaper>
        </Box>
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
    </Box>
  );
};

export default ApplicationQuickDataEntry;
