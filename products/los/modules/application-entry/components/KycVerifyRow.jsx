import { HButton, HLabel, HTextField, HBox } from "@helix/component-library";

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
  KycStatusLabel = () => null,
}) => (
  <HBox
    sx={{
      display: "grid",
      gridTemplateColumns: "280px 330px 1fr 130px 80px",
      alignItems: "center",
      columnGap: 1,
      width: "100%",
      mb: 0.2,
    }}
  >
    {/* Label */}
    <HBox
      sx={{
        width: "280px",
        minWidth: "280px",
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
      width="330px"
    />

    {/* Empty space between input and button */}
    <HBox />

    {/* Verify / Trigger button */}
    <HButton
      label={buttonLabelKey}
      variant="outlined"
      size="small"
      inline
      loading={verifying}
      disabled={disabled || !value}
      onClick={onVerify}
    />

    {/* Status */}
    <KycStatusLabel status={status} />
  </HBox>
);

export default KycVerifyRow;