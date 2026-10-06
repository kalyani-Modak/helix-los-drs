import { HButton, HLabel, HTextField, HBox } from "@helix/component-library";
import SectionBlock from "../components/SectionBlock";
import { statusLabelKey } from "../constants/qdeOptions";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import FieldError from "../components/FieldError";

const AuthKycStatus = ({ status }) => {
  const normalizedStatus = String(status || "Pending").toUpperCase();
  const colors = {
    VERIFIED: { color: "#2e7d32", background: "#e8f5e9", border: "#a5d6a7" },
    FAILED: { color: "#d32f2f", background: "#ffebee", border: "#ef9a9a" },
    PENDING: { color: "#757575", background: "#f5f5f5", border: "#d6d6d6" },
  };
  const style = colors[normalizedStatus] || colors.PENDING;
  const labelStatus =
    normalizedStatus === "VERIFIED"
      ? "Verified"
      : normalizedStatus === "FAILED"
        ? "Failed"
        : "Pending";

  return (
    <HBox sx={{ width: "64px", minWidth: "64px", flexShrink: 0, display: "flex", justifyContent: "flex-end" }}>
      <HLabel
        value={statusLabelKey(labelStatus)}
        align="center"
        colon={false}
        sx={{
          width: "64px",
          boxSizing: "border-box",
          borderRadius: "12px",
          padding: "3px 8px",
          fontSize: "11px",
          fontWeight: 600,
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          color: style.color,
          backgroundColor: style.background,
          border: `1px solid ${style.border}`,
          color: "text.primary",
        }}
      />
    </HBox>
  );
};

const AuthSignatoryKycSection = ({
  form,
  setField,
  verifying = {},
  onVerifyAsPan,
  onSendAsAadhaarOtp,
  onValidateAsAadhaarOtp,
  onCheckAsPanAadhaarLink,
  aadhaarOtpTimer = 0,
  noAccordion,
  errors = {},
}) => {
  const err = (name) => errors[name];

  return (
    <SectionBlock
      sectionKey="authSignatoryKyc"
      titleKey="label.qde.section.authSignatoryKyc"
      subTitleKey="label.qde.section.authSignatoryKyc.subtitle"
      noAccordion={noAccordion}
      icon={<VerifiedUserOutlinedIcon fontSize="small" />}
      headerStatusLabel="PAN-Aadhaar Linkage:"
      headerStatus={form.asPanAadhaarLinked }
 
    >
      <HBox sx={{ display: "flex", alignItems: "flex-start", gap: 1, width: "100%", mb: 1 }}>
        <HBox sx={{ width: "280px", minWidth: "280px", flexShrink: 0 }}>
          <HLabel sx={{ color: "text.primary" }} value="Auth. Signatory Aadhaar" required align="left" colon={false} />
        </HBox>
        <HBox sx={{ display: "flex", alignItems: "flex-start", flexDirection:"row", gap: 5, width: "100%", }}>
        <HBox sx={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
        <HTextField
          value={form.asAadhaar ?? ""}
          onChange={(e) => setField("asAadhaar", e.target.value)}
          editable
          required
          error={Boolean(err("asAadhaar"))}
          length={12}
          placeholder="12-digit Aadhaar number"
          width="350px"
        />
        <FieldError message={err("asAadhaar")} sx={{ mt: 2 }} />
        </HBox>
        <HTextField
          value={form.asAadhaarOtp ?? ""}
          onChange={(e) => setField("asAadhaarOtp", e.target.value)}
          editable={Boolean(form.asAadhaar)}
          disabled={!form.asAadhaar || !form.asAadhaarOtpSent || form.asAadhaarStatus === "VERIFIED"}
          type="number"
          length={6}
          placeholder="Enter OTP"
          width="140px"
        />
        <HButton
          label={
            aadhaarOtpTimer > 0
              ? `Resend (${aadhaarOtpTimer}s)`
              : form.asAadhaarOtpSent
                ? "Resend OTP"
                : "Get OTP"
          }
          variant="outlined"
          size="small"
          inline
          loading={verifying.asAadhaarSend}
          disabled={aadhaarOtpTimer > 0}
          onClick={onSendAsAadhaarOtp}
          sx={{ width: "140px", minWidth: "140px", height: "32px", flexShrink: 0 }}
        />
        </HBox>
        <HBox sx={{ flex: 1, minWidth: 0 }} />
        <HButton
          label="label.qde.button.validateOtp"
          variant="contained"
          color="success"
          size="small"
          inline
          loading={verifying.asAadhaarValidate}
          disabled={!form.asAadhaarOtp}
          startIcon={<VerifiedUserOutlinedIcon fontSize="small" />}
          onClick={onValidateAsAadhaarOtp}
          sx={{ width: "130px", minWidth: "130px", height: "32px", flexShrink: 0 }}
        />
        <AuthKycStatus status={form.asAadhaarStatus} />
      </HBox>

      <HBox sx={{ display: "flex", alignItems: "flex-start", gap: 1, width: "100%", mb: 1 }}>
        <HBox sx={{ width: "280px", minWidth: "280px", flexShrink: 0 }}>
          <HLabel sx={{ color: "text.primary" }} value="Auth. Signatory PAN" align="left" colon={false} />
        </HBox>
        <HBox sx={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
        <HTextField
          value={form.asPan ?? ""}
          onChange={(e) => setField("asPan", e.target.value.toUpperCase())}
          editable
          error={Boolean(err("asPan"))}
          length={10}
          placeholder="AAAAA9999A"
          width="350px"
        />
        <FieldError message={err("asPan")} sx={{ mt: 2 }} />
        </HBox>

        <HBox sx={{ flex: 1, minWidth: 0 }} />
        <HButton
          label="label.qde.button.verify"
          variant="outlined"
          size="small"
          inline
          loading={verifying.asPan}
          onClick={onVerifyAsPan}
          startIcon={<VerifiedUserOutlinedIcon fontSize="small" />}
          sx={{ width: "130px", minWidth: "130px", height: "32px", flexShrink: 0 }}
        />
        <AuthKycStatus status={form.asPanStatus} />
      </HBox>

      <HBox sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%", mb: 0.2 }}>
        <HBox sx={{ width: "280px", minWidth: "280px", flexShrink: 0 }}>
          <HLabel sx={{ color: "text.primary" }} value="label.qde.field.panAadhaarLink" align="left" colon={false} />
        </HBox>
        <HBox sx={{ flex: 1, minWidth: 0 }} />
        <HButton
          label="label.qde.button.verify"
          variant="outlined"
          size="small"
          inline
          loading={verifying.asPanAadhaar}
          disabled={!form.asPanStatus || !form.asAadhaarStatus}
          onClick={onCheckAsPanAadhaarLink}
          startIcon={<VerifiedUserOutlinedIcon fontSize="small" />}
          sx={{ width: "130px", minWidth: "130px", height: "32px", flexShrink: 0 }}
        />
        <AuthKycStatus status={form.asPanAadhaarLinked} />
      </HBox>
    </SectionBlock>
  );
};

export default AuthSignatoryKycSection;
