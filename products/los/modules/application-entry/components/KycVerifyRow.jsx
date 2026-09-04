import { HButton, HLabel, HTextField, HBox } from "@helix/component-library";
import { statusLabelKey } from "../constants/qdeOptions";

const DEFAULT_SIZE = { xs: 12, sm: 6, md: 4 };

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
  buttonLabelKey = "label.qde.button.verify",
  size = DEFAULT_SIZE,
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
    <HLabel
      value={statusLabelKey(status)}
      align="left"
      colon={false}
    />
  </HBox>
);

export default KycVerifyRow;