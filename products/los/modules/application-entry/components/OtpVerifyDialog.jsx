import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { HBox, HButton, HDialog, HLabel, HTextField } from "@helix/component-library";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const OtpVerifyDialog = ({
  open,
  onClose,
  onValidate,
  channel,
  target,
  loading = false,
  timerSeconds = 30,
}) => {
  const intl = useIntl();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(timerSeconds);
  const otpRefs = useRef([]);
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    if (open) {
      setOtp("");
      setOtpError("");
      setTimer(timerSeconds);
    }
  }, [open, timerSeconds]);

  useEffect(() => {
    if (!open) return;

    setOtp("");
    setTimer(timerSeconds);

    setTimeout(() => {
      otpRefs.current[0]?.focus();
    }, 100);
  }, [open, timerSeconds]);

  useEffect(() => {
    if (!open || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, timer]);

  const title = intl.formatMessage({
    id: "label.qde.dialog.otpTitle",
    defaultMessage: "OTP verification",
  });

  const sentToText = `OTP sent to ${target || "-"}. (Demo OTP: 123456)`;

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    if (!digit) {
      const otpArray = otp.split("");
      otpArray[index] = "";
      setOtp(otpArray.join(""));

      return;
    }

    const otpArray = otp.split("");
    otpArray[index] = digit;

    const newOtp = otpArray.join("").slice(0, 6);

    setOtp(newOtp);

    if (index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pastedOtp = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    setOtp(pastedOtp);

    const focusIndex = Math.min(pastedOtp.length, 5);

    setTimeout(() => {
      otpRefs.current[focusIndex]?.focus();
    }, 0);
  };

  const handleValidate = () => {
    if (otp !== "123456") {
      setOtpError("Invalid OTP. Try again.");
      return;
    }
    setOtpError("");
    onValidate?.(otp);
  };

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
          <HButton
            label="label.qde.button.cancel"
            variant="outlined"
            inline
            onClick={onClose}
          />

          <HButton
            label="label.qde.button.validateOtp"
            variant="contained"
            inline
            loading={loading}
            disabled={otp.length !== 6 || timer === 0}
            onClick={handleValidate}
          />
        </HBox>
      }
    >
      <HBox sx={{ display: "flex", flexDirection: "column", gap: 1.5, px: 1 }}>
        <HLabel
          value={sentToText}
          translate={false}
          align="left"
          colon={false}
        />

        <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.5, }}>
          <HLabel
            value="label.qde.field.otp"
            required
            align="left"
            colon={false}
          />

          <HBox sx={{ display: "flex", justifyContent: "center", gap: 1, }}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <HTextField
                key={index}
                value={otp[index] || ""}
                onChange={(e) =>
                  handleOtpChange(index, e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                inputRef={(ref) => {
                  otpRefs.current[index] = ref;
                }}
                editable
                required
                type="number"
                width="45px"
              />
            ))}
          </HBox>
        </HBox>

        <HBox sx={{ display: "flex", justifyContent: "center" }}>
          <HLabel
            value={`OTP expires in 0:${String(timer).padStart(2, "0")}`}
            colon={false}
          />
        </HBox>
        {otpError && (
          <HBox sx={{ display: "flex", alignItems: "center", gap: 0.5, }}>
            <ErrorOutlineIcon
              sx={{ fontSize: 18, color: "error.main", }}/>
            <HLabel
              value={otpError}
              translate={false}
              colon={false}
            />
          </HBox>
        )}
      </HBox>
    </HDialog>
  );
};

export default OtpVerifyDialog;