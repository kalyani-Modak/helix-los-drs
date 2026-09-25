import { useEffect, useRef, useState } from "react";
import { HButton, HLabel, HTextField, HBox } from "@helix/component-library";
import KycVerifyRow from "../components/KycVerifyRow";
import SectionBlock from "../components/SectionBlock";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";

const KycStatusLabel = ({ status }) => {
  const statusConfig = {
    PENDING: {
      label: "Pending",
      color: "text.secondary",
    },
    VERIFIED: {
      label: "Verified",
      color: "success.main",
    },
    FAILED: {
      label: "Failed",
      color: "error.main",
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.PENDING;

  return (
    <HLabel
      value={currentStatus.label}
      align="left"
      colon={false}
      sx={{
        color: currentStatus.color,
        fontWeight: 600,
      }}
    />
  );
};

const KycOtpRow = ({
  labelKey,
  value,
  onChange,
  otpValue,
  onOtpChange,
  otpSent,
  onSendOtp,
  onValidateOtp,
  sending,
  validating,
  status,
  required = false,
  placeholder = "",
  maxLength,
  disabled = false,
  error = false,
  otpTimer = 0,
  otpExpired = false,
  isTriggerButton = false,
  verifying = false,
  onVerify,
}) => (
  
  <HBox sx={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%", gap: 1, mb: 0.2 }}>
    <HBox sx={{ width: "280px", minWidth: "280px", flexShrink: 0 }}>
      <HLabel
        value={labelKey}
        required={required}
        align="left"
        colon={false}
      />
    </HBox>

    {/* Trigger button */}
    {isTriggerButton && (
      <HButton
        label="label.qde.button.trigger"
        variant="outlined"
        size="small"
        inline
        loading={verifying}
        // disabled={disabled || !value}
        onClick={onVerify}
    />)}

    <HTextField
      value={value ?? ""}
      onChange={onChange}
      editable={!disabled}
      disabled={disabled}
      required={required}
      error={error}
      placeholder={placeholder}
      length={maxLength}
      width="330px"
    />

    {/* OTP */}
    <HTextField
      value={otpValue ?? ""}
      onChange={onOtpChange}
      editable={otpSent && !disabled && !otpExpired}
      disabled={!otpSent || disabled || otpExpired}
      type="number"
      length={6}
      placeholder="Enter OTP"
      width="140px"
    />

    {/* Get OTP */}
    <HButton
      label={
        otpTimer > 0
          ? `Resend (${otpTimer}s)`
          : otpSent
            ? "Resend OTP"
            : "Get OTP"
      }
      variant="outlined"
      size="small"
      inline
      loading={sending}
      disabled={disabled || !value || otpTimer > 0}
      startIcon={<SecurityOutlinedIcon fontSize="small" />}
      onClick={onSendOtp}
    />

    {otpExpired && (
      <HLabel
        value="Aadhaar OTP expired. Please resend."
        align="left"
        colon={false}
        sx={{
          color: "error.main",
          fontWeight: 600,
        }}
      />
    )}

    {/* Validate OTP */}
    <HButton
      label="label.qde.button.validateOtp"
      variant="contained"
      size="small"
      inline
      loading={validating}
      disabled={
        disabled ||
        !otpSent ||
        !otpValue ||
        otpExpired
      }
      startIcon={<VerifiedUserOutlinedIcon fontSize="small" />}
      onClick={onValidateOtp}
    />

    {/* Status */}
    <KycStatusLabel status={status} />
  </HBox>
);

const IndividualKyc = ({
  form,
  setField,
  verifying,
  handlers,
  errors = {},
}) => {
  const [aadhaarOtpTimer, setAadhaarOtpTimer] = useState(0);
  const [aadhaarOtpExpired, setAadhaarOtpExpired] = useState(false);
  const aadhaarImageInputRef = useRef(null);

  useEffect(() => {
    if (aadhaarOtpTimer <= 0) {
      return undefined;
    }
    const timer = setInterval(() => {
      setAadhaarOtpTimer((prev) => {
        if (prev <= 1) {
          setAadhaarOtpExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [aadhaarOtpTimer]);

  const handleSendAadhaarOtp = async () => {
    setAadhaarOtpExpired(false);
    setField("aadhaarOtp", "");

    try {
      const result = await handlers.onSendAadhaarOtp();

      if (result !== false) {
        setAadhaarOtpTimer(30);
      }
    } catch (error) {
      setAadhaarOtpTimer(0);
      setAadhaarOtpExpired(false);
    }
  };

  const handleValidateAadhaarOtp = async () => {
    const result = await handlers.onValidateAadhaarOtp();

    if (result === true) {
      // Stop timer
      setAadhaarOtpTimer(0);

      // Reset OTP state
      setAadhaarOtpExpired(false);
      setField("aadhaarOtpSent", false);
      setField("aadhaarOtp", "");
      setField("aadhaarStatus", "VERIFIED");
    }
    return result;
  };

  const handleAadhaarImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setField("aadhaarImage", file);
    setField("aadhaarImageName", file.name);

    if (handlers.onUploadAadhaarImage) {
      handlers.onUploadAadhaarImage(file);
    }
  };

  return (
    <>
      {/* PAN */}
      <KycVerifyRow
        labelKey="label.qde.field.pan"
        value={form.pan}
        onChange={(e) =>
          setField("pan", e.target.value.toUpperCase())
        }
        status={form.panStatus}
        verifying={verifying.pan}
        onVerify={handlers.onVerifyPan}
        required
        error={Boolean(errors.pan)}
        maxLength={10}
        placeholder="ABCDE1234F"
        KycStatusLabel={KycStatusLabel}
      />

      {/* Aadhaar + OTP - SAME ROW */}
      <KycOtpRow
        labelKey="label.qde.field.aadhaar"
        value={form.aadhaar}
        onChange={(e) =>
          setField("aadhaar", e.target.value)
        }
        otpValue={form.aadhaarOtp}
        onOtpChange={(e) =>
          setField("aadhaarOtp", e.target.value)
        }
        otpSent={form.aadhaarOtpSent}
        onSendOtp={handleSendAadhaarOtp}
        onValidateOtp={handleValidateAadhaarOtp}
        sending={verifying.aadhaarSend}
        validating={verifying.aadhaarValidate}
        status={form.aadhaarStatus}
        required
        error={Boolean(errors.aadhaar)}
        maxLength={12}
        placeholder="12-digit Aadhaar number"
        otpTimer={aadhaarOtpTimer}
        otpExpired={aadhaarOtpExpired}
      />

      {/* Upload Aadhaar Image */}
      <HBox sx={{ display: "flex", alignItems: "center", width: "100%", gap: 1, mb: 0.2, border: "1px solid", borderColor: "divider", borderRadius: 1, p: 1 }}>
        <HBox sx={{ width: "280px", minWidth: "280px", flexShrink: 0, flexDirection: "column", alignItems: "flex-start" }}>
          <HLabel
            value="Upload Aadhaar Image"
            align="left"
            colon={false}
          />

          <HLabel
            value="JPG / PNG — auto-fills Aadhaar, First Name, Last Name and Date of Birth."
            align="left"
            colon={false}
            sx={{ fontSize: "11px", color: "text.secondary" }}
          />
        </HBox>

        <HBox sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <input
            ref={aadhaarImageInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleAadhaarImageUpload}
            style={{ display: "none" }}
          />

          <HButton
            label="Upload image"
            variant="outlined"
            size="small"
            inline
            startIcon={<UploadFileOutlinedIcon fontSize="small" />}
            onClick={() => aadhaarImageInputRef.current?.click()}
          />

          {form.aadhaarImageName && (
            <HLabel
              value={form.aadhaarImageName}
              align="left"
              colon={false}
              sx={{ fontSize: "12px", color: "text.secondary" }}
            />
          )}
        </HBox>
      </HBox>

      {/* PAN - Aadhaar Link */}
      <HBox sx={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%", gap: 1, mb: 0.2 }}>
        <HBox sx={{ width: "280px", minWidth: "280px", flexShrink: 0 }}>
          <HLabel value="label.qde.field.panAadhaarLink" align="left" colon={false} />
        </HBox>

        <HBox sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <HButton
            label="label.qde.button.verify"
            variant="outlined"
            size="small"
            inline
            loading={verifying.panAadhaar}
            disabled={!form.pan || !form.aadhaar}
            onClick={handlers.onCheckPanAadhaarLink}
          />

          <KycStatusLabel status={status} />
        </HBox>
      </HBox>

      {/* CKYC + OTP - SAME ROW */}
      <KycOtpRow
        labelKey="label.qde.field.ckyc"
        value={form.ckycNumber}
        onChange={(e) =>
          setField("ckycNumber", e.target.value)
        }
        otpValue={form.ckycOtp}
        onOtpChange={(e) =>
          setField("ckycOtp", e.target.value)
        }
        otpSent={form.ckycOtpSent}
        onSendOtp={handlers.onSendCkycOtp}
        onValidateOtp={handlers.onValidateCkycOtp}
        sending={verifying.ckycSend}
        validating={verifying.ckycValidate}
        status={form.ckycStatus}
        maxLength={14}
        placeholder="CKYC Number"
        disabled={!form.ckycNumber}
        isTriggerButton
        onVerify={handlers.onTriggerCkyc}

      />

      {/* DigiLocker */}
      <HBox sx={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%", gap: 1, mb: 0.2 }}>
        <HBox sx={{ width: "280px", minWidth: "300px", flexShrink: 0 }}>
          <HLabel value="label.qde.field.digilocker" align="left" colon={false} />
        </HBox>

        <HBox sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <HTextField
            value={form.digiRef}
            onChange={(e) =>
              setField("digiRef", e.target.value)
            }
            editable
            width="330px"
            placeholder="Import documents via DigiLocker"
          />

          <HButton
            label="label.qde.button.fetch"
            variant="outlined"
            size="small"
            inline
            loading={verifying.digilocker}
            onClick={handlers.onDigilocker}
          />

          <KycStatusLabel status={status} />
        </HBox>
      </HBox>
    </>
  );
};

const NonIndividualKyc = ({
  form,
  setField,
  verifying,
  handlers,
  errors = {},
}) => (
  <>
    { }
    <KycVerifyRow
      labelKey="label.qde.field.businessPan"
      value={form.pan}
      onChange={(e) =>
        setField("pan", e.target.value.toUpperCase())
      }
      status={form.bizPanStatus}
      verifying={verifying.bizPan}
      onVerify={handlers.onVerifyBusinessPan}
      required
      error={Boolean(errors.pan)}
      maxLength={10}
      placeholder="AAACX1234K"
      KycStatusLabel={KycStatusLabel}
    />

    {/* GSTIN */}
    <KycVerifyRow
      labelKey="label.qde.field.gstin"
      value={form.gstin}
      onChange={(e) =>
        setField("gstin", e.target.value.toUpperCase())
      }
      status={form.gstinStatus}
      verifying={verifying.gstin}
      onVerify={handlers.onVerifyGstin}
      disabled={form.gstRegistered !== "Y"}
      maxLength={15}
    />

    {/* CIN */}
    <HBox sx={{ display: "flex", alignItems: "center", width: "100%", gap: 1, mb: 0.2 }}>
      <HBox sx={{ width: "280px", minWidth: "280px", flexShrink: 0 }}>
        <HLabel value="label.qde.field.cin" required align="left" colon={false} />
      </HBox>

      <HTextField
        value={form.cin}
        onChange={(e) =>
          setField("cin", e.target.value.toUpperCase())
        }
        editable
        required
        placeholder="CIN"
        status={form.cinStatus}
        verifying={verifying.cin}
        onVerify={handlers.onVerifyCin}
        length={21}
        width="330px"
        error={Boolean(errors.cin)}
      />

      <HLabel value="For reference only" align="left" colon={false} />
    </HBox>

    {/* Shop Act */}
    <KycVerifyRow
      labelKey="label.qde.field.shopAct"
      value={form.shopAct}
      onChange={(e) =>
        setField("shopAct", e.target.value)
      }
      required
      placeholder="Shop Act"
      status={form.shopActStatus}
      verifying={verifying.shopAct}
      onVerify={handlers.onVerifyShopAct}
      maxLength={30}
      error={Boolean(errors.shopAct)}
    />

    {/* CKYC */}
    <KycVerifyRow
      labelKey="label.qde.field.ckyc"
      value={form.ckycNumber}
      onChange={(e) =>
        setField("ckycNumber", e.target.value)
      }
      status={form.ckycStatus}
      verifying={verifying.ckycTrigger}
      onVerify={handlers.onTriggerCkyc}
      maxLength={14}
      buttonLabelKey="label.qde.button.verify"
      isTriggerButton
    />
  </>
);

const KycCheckSection = ({
  form,
  setField,
  isNonIndividual,
  verifying = {},
  compact = false,
  sectionKey = "kycCheck",
  errors = {},
  ...handlers
}) => (
  <SectionBlock
    sectionKey={sectionKey}
    titleKey={isNonIndividual ? "label.qde.section.kyc.nonIndividual" : "label.qde.section.kyc.individual"}
    subTitleKey={isNonIndividual ? "label.qde.section.kyc.nonIndividual.subtitle" : "label.qde.section.kyc.individual.subtitle"}
    icon={<VerifiedUserOutlinedIcon fontSize="small" />}
    noAccordion={compact}
  >
    {isNonIndividual ? (
      <NonIndividualKyc
        form={form}
        setField={setField}
        verifying={verifying}
        handlers={handlers}
        errors={errors}
      />
    ) : (
      <IndividualKyc
        form={form}
        setField={setField}
        verifying={verifying}
        handlers={handlers}
        errors={errors}
      />
    )}
  </SectionBlock>
);

export default KycCheckSection;