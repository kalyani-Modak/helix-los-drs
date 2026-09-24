import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { HBox, HButton, HDialog, HLabel, HTextField } from "@helix/component-library";

/**
 * Shared OTP challenge dialog. The caller owns the send step and supplies
 * `onValidate(otp)` for the confirmation step.
 */
const OtpVerifyDialog = ({ open, onClose, onValidate, channel, target, loading = false }) => {
  const intl = useIntl();
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (open) setOtp("");
  }, [open]);

  const title = intl.formatMessage({
    id: "label.qde.dialog.otpTitle",
    defaultMessage: "OTP verification",
  });

  const sentToText = intl.formatMessage(
    { id: "label.qde.dialog.otpSentTo", defaultMessage: "OTP sent to {channel} {target}" },
    {
      channel: channel || "",
      target: target || "-",
    }
  );

  return (
    <HDialog
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="xs"
      fullWidth
      aria-labelledby="qde-otp-dialog-title"
      actions={
        <HBox sx={{ display: "flex", gap: 1 }}>
          <HButton label="label.qde.button.cancel" variant="outlined" inline onClick={onClose} />
          <HButton
            label="label.qde.button.validateOtp"
            variant="contained"
            inline
            loading={loading}
            disabled={!otp}
            onClick={() => onValidate?.(otp)}
          />
        </HBox>
      }
    >
      <HBox sx={{ display: "flex", flexDirection: "column", gap: 1.5, px: 1 }}>
        <HLabel value={sentToText} translate={false} align="left" colon={false} />
        <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <HLabel value="label.qde.field.otp" required align="left" colon={false} />
          <HTextField
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            editable
            required
            type="number"
            length={6}
            width="160px"
          />
        </HBox>
      </HBox>
    </HDialog>
  );
};

export default OtpVerifyDialog;
