import { HButton,  HLabel,  HTextField,  HBox } from "@helix/component-library";
import FieldRow from "../components/FieldRow";
import KycVerifyRow from "../components/KycVerifyRow";
import SectionBlock from "../components/SectionBlock";
import {
  statusLabelKey,
  YES_NO_OPTIONS,
} from "../constants/qdeOptions";

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
}) => (
  <HBox sx={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%", gap: 1, mb: 0.2, }} >
    <HBox sx={{ width: "280px", minWidth: "280px", flexShrink: 0, }} >
      <HLabel
        value={labelKey}
        required={required}
        align="left"
        colon={false}
      />
    </HBox>

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

    {/* OTP */}
    <HTextField
      value={otpValue ?? ""}
      onChange={onOtpChange}
      editable={otpSent && !disabled}
      disabled={!otpSent || disabled}
      type="number"
      length={6}
      placeholder="Enter OTP"
      width="140px"
    />

    {/* Get OTP */}
    <HButton
      label="label.qde.button.sendOtp"
      variant="outlined"
      size="small"
      inline
      loading={sending}
      disabled={disabled || !value}
      onClick={onSendOtp}
    />

    {/* Validate OTP */}
    <HButton
      label="label.qde.button.validateOtp"
      variant="contained"
      size="small"
      inline
      loading={validating}
      disabled={disabled || !otpSent || !otpValue}
      onClick={onValidateOtp}
    />

    {/* Status */}
    <HLabel
      value={statusLabelKey(status)}
      align="left"
      colon={false}
    />
  </HBox>
);

const IndividualKyc = ({
  form,
  setField,
  verifying,
  handlers,
}) => (
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
      maxLength={10}
      placeholder="ABCDE1234F"
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
      maxLength={12}
      placeholder="12-digit Aadhaar number"
      disabled={!form.aadhaar}
    />

    {/* PAN - Aadhaar Link */}
    <FieldRow labelKey="label.qde.field.panAadhaarLink">
      <HBox
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <HButton
          label="label.qde.button.verify"
          variant="outlined"
          size="small"
          inline
          loading={verifying.panAadhaar}
          disabled={!form.pan || !form.aadhaar}
          onClick={handlers.onCheckPanAadhaarLink}
        />

        <HLabel
          value={statusLabelKey(form.panAadhaarLinked)}
          align="left"
          colon={false}
        />
      </HBox>
    </FieldRow>

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
    />

    {/* DigiLocker */}
    <FieldRow labelKey="label.qde.field.digilocker">
      <HBox
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
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

        <HLabel
          value={statusLabelKey(form.digiStatus)}
          align="left"
          colon={false}
        />
      </HBox>
    </FieldRow>
  </>
);

const NonIndividualKyc = ({
  form,
  setField,
  verifying,
  handlers,
}) => (
  <>
    {/* Business PAN */}
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
      maxLength={10}
      placeholder="AAACX1234K"
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
    <HBox sx={{ display: "flex", alignItems: "center", width: "100%", gap: 1, mb: 0.2 }} >
      <HBox sx={{ width: "280px", minWidth: "280px", flexShrink: 0 }} >
        <HLabel value="label.qde.field.cin" align="left" colon={false} />
      </HBox>

      {/* CIN TextField */}
      <HTextField
        value={form.cin}
        onChange={(e) =>
          setField("cin", e.target.value.toUpperCase())
        }
        editable
        length={21}
        width="330px"
      />

      {/* Reference text */}
      <HLabel value="For reference only" align="left" colon={false} />
    </HBox>

    {/* Shop Act */}
    <KycVerifyRow
      labelKey="label.qde.field.shopAct"
      value={form.shopAct}
      onChange={(e) =>
        setField("shopAct", e.target.value)
      }
      status={form.shopActStatus}
      verifying={verifying.shopAct}
      onVerify={handlers.onVerifyShopAct}
      maxLength={30}
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
      buttonLabelKey="label.qde.button.trigger"
    />
  </>
);

const KycCheckSection = ({
  form,
  setField,
  isNonIndividual,
  verifying = {},
  ...handlers
}) => (
  <SectionBlock
    sectionKey="kycCheck"
    titleKey="label.qde.section.kyc"
  >
    {isNonIndividual ? (
      <NonIndividualKyc
        form={form}
        setField={setField}
        verifying={verifying}
        handlers={handlers}
      />
    ) : (
      <IndividualKyc
        form={form}
        setField={setField}
        verifying={verifying}
        handlers={handlers}
      />
    )}
  </SectionBlock>
);

export default KycCheckSection;