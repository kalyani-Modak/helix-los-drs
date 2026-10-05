import { HBox } from "@helix/component-library";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const FieldError = ({ message, sx }) =>
  message ? (
    <HBox sx={{ display: "flex", alignItems: "center", gap: "3px", color: "error.main", fontSize: "11px", lineHeight: "14px", ...sx }}>
      <ErrorOutlineIcon sx={{ fontSize: "14px", flexShrink: 0 }} />
      <span>{message}</span>
    </HBox>
  ) : null;

export default FieldError;