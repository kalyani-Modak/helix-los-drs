import { HButton, HLabel, HTextField, HBox } from "@helix/component-library";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

const KycVerifyRow = ({
  labelKey,
  value,
  onChange,
  status,
  verifying = false,
  onVerify,
  required = false,
  placeholder = "",
  maxLength,
  disabled = false,
  error = false,
  buttonLabelKey = "label.qde.button.verify",
  isTriggerButton = false,
  disableVerifyWhenEmpty = true,
  KycStatusLabel = () => null,
}) => (
  <HBox
    sx={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      gap: 1,
      mb: 0.2,
    }}
  >
    {/* Label */}
    <HBox
      sx={{
        width: "280px",
        minWidth: "280px",
        flexShrink: 0,
      }}
    >
      <HLabel
        value={labelKey}
        required={required}
        align="left"
        colon={false}
      />
    </HBox>

    {/* Input */}
    <HTextField
      value={value ?? ""}
      onChange={onChange}
      editable={!disabled}
      disabled={disabled}
      required={required}
      error={error}
      placeholder={placeholder}
      length={maxLength}
      width="350px"
    />
  <HBox sx={{ flex: 1 }} />
    {/* Space reserved for Aadhaar OTP + Get OTP */}
    <HBox
      sx={{
        width: "228px",
        minWidth: "228px",
        flexShrink: 0,
      }}
    />

    {/* Verify */}
    <HButton
      label={
        isTriggerButton
          ? "label.qde.button.trigger"
          : buttonLabelKey
      }
      variant="outlined"
      size="small"
      inline
      loading={verifying}
      disabled={disabled || (disableVerifyWhenEmpty && !value)}
      startIcon={
        <VerifiedUserOutlinedIcon fontSize="small" />
      }
      onClick={onVerify}
      sx={{
        width: "140px",
        minWidth: "140px",
        height: "32px",
        minHeight: "32px",
        flexShrink: 0,
        mr:1.8
      }}
    />

    {/* Status */}
    
      <KycStatusLabel status={status} />
  </HBox>
);

export default KycVerifyRow;

