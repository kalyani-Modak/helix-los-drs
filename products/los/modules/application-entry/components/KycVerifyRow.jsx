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
      display: "grid",
      gridTemplateColumns: "minmax(0, 24%) minmax(0, 29%) minmax(0, 13%) minmax(0, 12%) auto auto",
      alignItems: "center",
      width: "100%",
      minWidth: 0,
      gap: 1,
      mb: 0.2,
      "@media (max-width: 900px)": {
        gridTemplateColumns: "minmax(0, 24%) minmax(0, 29%) minmax(0, 13%) minmax(0, 12%) auto auto",
      },
      "@media (max-width: 600px)": {
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
      },
    }}
  >
    {/* Label */}
    <HBox sx={{ minWidth: 0 }}>
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
      width="100%"
    />
    <HBox sx={{ minWidth: 0 }} />
    <HBox sx={{ minWidth: 0 }} />
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
      sx={{ height: "32px", minHeight: "32px", whiteSpace: "nowrap" }}
    />

    {/* Status */}
    <HBox sx={{ justifySelf: "end" }}>
      <KycStatusLabel status={status} />
    </HBox>
  </HBox>
);

export default KycVerifyRow;

