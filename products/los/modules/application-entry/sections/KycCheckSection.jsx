import { useEffect, useRef, useState } from "react";
import { HButton, HLabel, HTextField, HBox, useToast } from "@helix/component-library";
import KycVerifyRow from "../components/KycVerifyRow";
import FieldError from "../components/FieldError";
import SectionBlock from "../components/SectionBlock";
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

const KycStatusLabel = ({ status }) => {
  const statusConfig = {
    PENDING: {
      label: "Pending",
      color: "#757575",
      background: "#f5f5f5",
      border: "#d6d6d6",
    },
    VERIFIED: {
      label: "Verified",
      color: "#2e7d32",
      background: "#e8f5e9",
      border: "#a5d6a7",
    },
    FAILED: {
      label: "Failed",
      color: "#d32f2f",
      background: "#ffebee",
      border: "#ef9a9a",
    },
  };

  const normalizedStatus = String(status || "PENDING").toUpperCase();
  const currentStatus =
    statusConfig[normalizedStatus] || statusConfig.PENDING;

  return (
    <HBox
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "32px",
        flexShrink: 0,
      }}
    >
      <HLabel
        value={currentStatus.label}
        align="center"
        colon={false}
        sx={{
          color: currentStatus.color,
          backgroundColor: currentStatus.background,
          border: `1px solid ${currentStatus.border}`,
          borderRadius: "12px",
          padding: "3px 10px",
          fontSize: "11px",
          fontWeight: 600,
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          boxSizing: "border-box",
        }}
      />
    </HBox>
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
  errorMessage,
  otpTimer = 0,
  otpExpired = false,
  isTriggerButton = false,
  verifying = false,
  onVerify,
}) => (

  <HBox sx={{
    display: "grid",
    gridTemplateColumns: "minmax(0, 24%) minmax(0, 29%) minmax(0, 13%) minmax(0, 12%) auto auto",
    alignItems: "flex-start",
    width: "100%",
    minWidth: 0,
    gap: 1,
    mb: 0.2,
    "@media (max-width: 900px)": { gridTemplateColumns: "minmax(0, 24%) minmax(0, 29%) minmax(0, 13%) minmax(0, 12%) auto auto" },
    "@media (max-width: 600px)": { gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)" },
  }}>
    <HBox sx={{ minWidth: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
      <HLabel
        value={labelKey}
        required={required}
        align="left"
        colon={false}
      />

      {/* Trigger button */}
      {isTriggerButton && (
        <HButton
          label="label.qde.button.trigger"
          variant="outlined"
          size="small"
          inline
          loading={verifying}
          onClick={onVerify}
          sx={{ height: "30px", minHeight: "30px", whiteSpace: "nowrap" }}
        />)}
    </HBox>
      <HBox sx={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
        <HTextField
          value={value ?? ""}
          onChange={onChange}
          editable={!disabled}
          disabled={disabled}
          required={required}
          error={error}
          placeholder={placeholder}
          length={maxLength}
          width="100%"
        />
        <FieldError message={errorMessage} sx={{ mt: 2 }} />
      </HBox>


      {/* OTP */}
      <HTextField
        value={otpValue ?? ""}
        onChange={onOtpChange}
        editable={otpSent && !disabled && !otpExpired}
        disabled={!otpSent || disabled || otpExpired}
        type="number"
        length={6}
        placeholder="Enter OTP"
        width="100%"
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
        disabled={disabled || otpTimer > 0}
        onClick={onSendOtp}
        sx={{ height: "32px", minHeight: "32px", whiteSpace: "nowrap", width: "100%" }}
      />

      {/* Validate OTP */}
      <HButton
        label="label.qde.button.validateOtp"
        variant="contained"
        color="success"
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
        sx={{ height: "32px", minHeight: "32px", whiteSpace: "nowrap", width: "120px", minWidth: "120px", maxWidth: "120px", justifySelf: "center" }}
      />
    {/* Status */}
    <HBox sx={{ justifySelf: "end", mr: 1 }}>
      <KycStatusLabel status={status} />
    </HBox>
  </HBox>
);

const IndividualKyc = ({
  form,
  setField,
  verifying,
  handlers,
  errors = {},
  aadhaarOtpTimer = 0,
  showAadhaarImageUpload = true,
}) => {
  const [aadhaarOtpExpired, setAadhaarOtpExpired] = useState(false);
  const aadhaarImageInputRef = useRef(null);
  const aadhaarOtpTimerWasRunning = useRef(false);
  const toast = useToast();

  useEffect(() => {
    if (aadhaarOtpExpired) {
      toast.error("Aadhaar OTP expired. Please resend.");
    }
  }, [aadhaarOtpExpired, toast]);

  useEffect(() => {
    if (aadhaarOtpTimer > 0) {
      aadhaarOtpTimerWasRunning.current = true;
      setAadhaarOtpExpired(false);
    } else if (aadhaarOtpTimerWasRunning.current) {
      aadhaarOtpTimerWasRunning.current = false;
      if (form.aadhaarOtpSent) setAadhaarOtpExpired(true);
    }
  }, [aadhaarOtpTimer, form.aadhaarOtpSent]);

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

  const handleReplaceAadhaarImage = () => {
    aadhaarImageInputRef.current?.click();
  };

  const handleViewAadhaarImage = () => {
    if (!form.aadhaarImage) {
      return;
    }

    const imageUrl = URL.createObjectURL(form.aadhaarImage);
    window.open(imageUrl, "_blank", "noopener,noreferrer");

    // Release URL after a short delay
    setTimeout(() => {
      URL.revokeObjectURL(imageUrl);
    }, 1000);
  };

  const handleClearAadhaarImage = () => {
    setField("aadhaarImage", null);
    setField("aadhaarImageName", "");

    // Allow selecting the same file again after clearing
    if (aadhaarImageInputRef.current) {
      aadhaarImageInputRef.current.value = "";
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
        errorMessage={errors.pan}
        maxLength={10}
        placeholder="ABCDE1234F"
        KycStatusLabel={KycStatusLabel}
        disableVerifyWhenEmpty={false}
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
        onSendOtp={handlers.onSendAadhaarOtp}
        onValidateOtp={handlers.onValidateAadhaarOtp}
        sending={verifying.aadhaarSend}
        validating={verifying.aadhaarValidate}
        status={form.aadhaarStatus}
        required
        error={Boolean(errors.aadhaar)}
        errorMessage={errors.aadhaar}
        maxLength={12}
        placeholder="12-digit Aadhaar number"
        otpTimer={aadhaarOtpTimer}
        otpExpired={aadhaarOtpExpired}
      />

      {showAadhaarImageUpload && (
      <>
      {/* Upload Aadhaar Image */}
      <HBox
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: 1,
          mb: 0.2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          p: 1,
        }}
      >
        {/* Label section */}
        <HBox
          sx={{
            minWidth: 0,
            flex: "1 1 auto",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <HLabel
            value="Upload Aadhaar Image"
            align="left"
            colon={false}
            sx={{
              color: "text.primary",
            }}
          />

          <HLabel
            value="JPG / PNG — auto-fills Aadhaar, First Name, Last Name and Date of Birth."
            align="left"
            colon={false}
            sx={{
              fontSize: "11px",
              color: "text.secondary",
              whiteSpace: "normal",
            }}
          />
        </HBox>

        {/* Hidden file input */}
        <input
          ref={aadhaarImageInputRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={handleAadhaarImageUpload}
          style={{ display: "none" }}
        />

        {/* Actions */}
        <HBox
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            marginLeft: "auto",
          }}
        >
          {/* Upload / Replace */}
          {!form.aadhaarImage ? (
            <HButton
              label="Upload image"
              variant="outlined"
              size="small"
              inline
              startIcon={<FileUploadOutlinedIcon fontSize="small" />}
              onClick={() => aadhaarImageInputRef.current?.click()}
            />
          ) : (
            <>
              <HButton
                label="Replace image"
                variant="outlined"
                size="small"
                inline
                startIcon={<FileUploadOutlinedIcon fontSize="small" />}
                onClick={handleReplaceAadhaarImage}
              />

              {/* File name */}
              <HLabel
                value={form.aadhaarImageName}
                align="left"
                colon={false}
                sx={{
                  fontSize: "12px",
                  color: "text.secondary",
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              />

              {/* View */}
              <HButton
                label="View"
                variant="outlined"
                size="small"
                inline
                startIcon={<VisibilityOutlinedIcon fontSize="small" />}
                onClick={handleViewAadhaarImage}
              />

              {/* Clear */}
              <HButton
                label="Clear"
                variant="text"
                size="small"
                inline
                startIcon={<DeleteOutlineOutlinedIcon fontSize="small" />}
                onClick={handleClearAadhaarImage}
                sx={{
                  color: "error.main",
                }}
              />
            </>
          )}
        </HBox>
      </HBox>
      </>
      )}

      {/* PAN - Aadhaar Link */}
      <HBox sx={{ display: "grid", gridTemplateColumns: "minmax(0, 24%) minmax(0, 29%) minmax(0, 13%) minmax(0, 12%) auto auto", alignItems: "center", width: "100%", minWidth: 0, gap: 1, mb: 0.2 }}>
        <HBox sx={{ minWidth: 0 }}>
          <HLabel value="label.qde.field.panAadhaarLink" align="left" colon={false} />
        </HBox>
        <HBox sx={{ minWidth: 0 }} />
        <HBox sx={{ minWidth: 0 }} />
        <HBox sx={{ minWidth: 0 }} />
        <HButton
            label="label.qde.button.verify"
            variant="outlined"
            size="small"
            inline
            loading={verifying.panAadhaar}
            disabled={!form.pan || !form.aadhaar}
            onClick={handlers.onCheckPanAadhaarLink}
            startIcon={<VerifiedUserOutlinedIcon fontSize="small" />}
            sx={{ height: "32px", minHeight: "32px", whiteSpace: "nowrap", width: "120px", minWidth: "120px", maxWidth: "120px" }}
          />
        <HBox sx={{ justifySelf: "end", gridColumn: 6, mr: 1 }}>
          <KycStatusLabel status={form.panAadhaarLinked} />
        </HBox>
      </HBox>

      {/* CKYC + OTP - SAME ROW */}
      <KycOtpRow
        labelKey="label.qde.field.ckyc"
        value={form.ckycNumber}
        onChange={(e) => {
          if (!form.ckycTriggered) {
            setField("ckycNumber", e.target.value);
          }
        }}
        otpValue={form.ckycOtp}
        onOtpChange={(e) =>
          setField("ckycOtp", e.target.value)
        }
        disabled={form.ckycStatus === "VERIFIED"}
        otpSent={form.ckycOtpSent}
        onSendOtp={handlers.onSendCkycOtp}
        onValidateOtp={handlers.onValidateCkycOtp}
        sending={verifying.ckycSend}
        validating={verifying.ckycValidate}
        status={form.ckycStatus}
        maxLength={14}
        placeholder="CKYC Number"
        isTriggerButton
        onVerify={handlers.onTriggerCkyc}

      />

      {/* DigiLocker */}
      <HBox sx={{ display: "grid", gridTemplateColumns: "minmax(0, 24%) minmax(0, 29%) minmax(0, 13%) minmax(0, 12%) auto auto", alignItems: "center", width: "100%", minWidth: 0, gap: 1, mb: 0.2 }}>
        <HBox sx={{ minWidth: 0 }}>
          <HLabel value="label.qde.field.digilocker" align="left" colon={false} />
        </HBox>

        <HBox sx={{ display: "flex", alignItems: "center", }}>
          <HTextField
            value={form.digiRef}
            onChange={(e) => setField("digiRef", e.target.value)}
            editable
            width="100%"
            placeholder="Import documents via DigiLocker"
          />
        </HBox>
        <HBox sx={{ minWidth: 0 }} />
        <HBox sx={{ minWidth: 0 }} />
        <HButton
          label="label.qde.button.verify"
          variant="outlined"
          size="small"
          inline
          loading={verifying.digilocker}
          onClick={handlers.onDigilocker}
          startIcon={<VerifiedUserOutlinedIcon fontSize="small" />}
          sx={{ height: "32px", minHeight: "32px", whiteSpace: "nowrap", width: "120px", minWidth: "120px", maxWidth: "120px" }}
        />

        <HBox sx={{ justifySelf: "end", gridColumn: 6, mr: 1 }}>
          <KycStatusLabel status={form.digiStatus} />
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
      <KycVerifyRow
      labelKey="URN No."
      value={form.urn}
      onChange={(e) =>
        setField("urn", e.target.value.toUpperCase())
      }
      status={form.urnStatus}
      verifying={verifying.urn}
      onVerify={handlers.onVerifyUrn}
      error={Boolean(errors.urn)}
      errorMessage={errors.urn}
      disableVerifyWhenEmpty={false}
      placeholder="Unique Reference Number"
      KycStatusLabel={KycStatusLabel}
      maxLength={16}
    />
    { /*Business pan */}
    <KycVerifyRow
      labelKey="label.qde.field.businessPan"
      value={form.bizPan}
      onChange={(e) =>
        setField("bizPan", e.target.value.toUpperCase())
      }
      status={form.bizPanStatus}
      verifying={verifying.bizPan}
      onVerify={handlers.onVerifyBusinessPan}
      required
      error={Boolean(errors.bizPan)}
      errorMessage={errors.bizPan}
      maxLength={10}
      placeholder="AAACX1234K"
      disableVerifyWhenEmpty={false}
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
      maxLength={15}
      placeholder="22AAAAA0000A1Z5"
      disableVerifyWhenEmpty={false}
      KycStatusLabel={KycStatusLabel}
    />

    {/* CIN */}
    <HBox sx={{
      display: "grid",
      gridTemplateColumns: "minmax(0, 24%) minmax(0, 29%) minmax(0, 13%) minmax(0, 12%) auto auto",
      alignItems: "flex-start",
      width: "100%",
      minWidth: 0,
      gap: 1,
      mb: 0.2,
      "@media (max-width: 900px)": { gridTemplateColumns: "minmax(0, 24%) minmax(0, 29%) minmax(0, 13%) minmax(0, 12%) auto auto" },
      "@media (max-width: 600px)": { gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)" },
    }}>
      <HBox sx={{ minWidth: 0 }}>
        <HLabel value="label.qde.field.cin" align="left" colon={false} />
      </HBox>
      <HBox sx={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
        <HTextField
          value={form.cin}
          onChange={(e) => setField("cin", e.target.value.toUpperCase())}
          editable
          placeholder="L000000XX0000XXX000000"
          length={21}
          width="100%"
          error={Boolean(errors.cin)}
        />
        <FieldError message={errors.cin} sx={{ mt: 2 }} />
      </HBox>
      <HBox sx={{ minWidth: 0 }} />
      <HBox sx={{ minWidth: 0 }} />
      <HBox sx={{ minWidth: 0 }}>
        <HLabel
          value="For reference only"
          align="left"
          colon={false}
          sx={{ fontStyle: "italic", fontSize: "11px", color: "text.secondary", mt: 0.3 }}
        />
      </HBox>
      <HBox sx={{ minWidth: 0 }} />
    </HBox>

      {/* Shop Act */}
      <KycVerifyRow
        labelKey="label.qde.field.shopAct"
        value={form.shopAct}
        onChange={(e) =>
          setField("shopAct", e.target.value)
        }
        placeholder="Shop Act & Establishment Registration No."
        status={form.shopActStatus}
        verifying={verifying.shopAct}
        onVerify={handlers.onVerifyShopAct}
        maxLength={30}
        error={Boolean(errors.shopAct)}
        errorMessage={errors.shopAct}
        KycStatusLabel={KycStatusLabel}
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
  footerNote,
  aadhaarOtpTimer = 0,
  showAadhaarImageUpload = true,
  ...handlers
}) => (
  <SectionBlock
    sectionKey={sectionKey}
    titleKey={isNonIndividual ? "label.qde.section.kyc.nonIndividual" : "label.qde.section.kyc.individual"}
    subTitleKey={isNonIndividual ? "label.qde.section.kyc.nonIndividual.subtitle" : "label.qde.section.kyc.individual.subtitle"}
    icon={<VerifiedUserOutlinedIcon fontSize="small" />}
    noAccordion={compact}
    showHeaderMeta={compact}
    headerStatusLabel={!isNonIndividual ? "PAN-Aadhaar Linkage:" : false}
    headerStatus={!isNonIndividual ? form.panAadhaarLinked : false}
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
        aadhaarOtpTimer={aadhaarOtpTimer}
        showAadhaarImageUpload={showAadhaarImageUpload}
      />
    )}
    {footerNote}
  </SectionBlock>
);

export default KycCheckSection;