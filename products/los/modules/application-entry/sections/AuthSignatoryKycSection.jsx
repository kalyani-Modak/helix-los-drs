import { HButton, HLabel, HTextField, HBox } from "@helix/component-library";
import KycVerifyRow from "../components/KycVerifyRow";
import SectionBlock from "../components/SectionBlock";
import { statusLabelKey } from "../constants/qdeOptions";

const AuthSignatoryKycSection = ({
  form,
  setField,
  verifying = {},
  onVerifyAsPan,
  onSendAsAadhaarOtp,
  onValidateAsAadhaarOtp,
  onCheckAsPanAadhaarLink,
  noAccordion,
}) => (
  <SectionBlock sectionKey="authSignatoryKyc" titleKey="label.qde.section.authSignatoryKyc" noAccordion={noAccordion}>
    <KycVerifyRow
      labelKey="label.qde.field.pan"
      value={form.asPan}
      onChange={(e) => setField("asPan", e.target.value.toUpperCase())}
      status={form.asPanStatus}
      verifying={verifying.asPan}
      onVerify={onVerifyAsPan}
      required
      maxLength={10}
      placeholder="ABCDE1234F"
    />

    <KycVerifyRow
      labelKey="label.qde.field.aadhaar"
      value={form.asAadhaar}
      onChange={(e) => setField("asAadhaar", e.target.value)}
      status={form.asAadhaarStatus}
      verifying={verifying.asAadhaarSend}
      onVerify={onSendAsAadhaarOtp}
      required
      maxLength={12}
      buttonLabelKey="label.qde.button.sendOtp"
    />

    <HBox sx={{ display: "flex", flexDirection: "row", alignItems: "flex-start", width: "100%", mb: 0.2 }}>
      <HBox sx={{ width: "280px", minWidth: "280px", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5 }}>
        <HLabel value="label.qde.field.aadhaarOtp" align="left" colon={false} />
      </HBox>

      <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
        <HBox sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <HTextField
            value={form.asAadhaarOtp}
            onChange={(e) => setField("asAadhaarOtp", e.target.value)}
            editable={Boolean(form.asAadhaar)}
            disabled={!form.asAadhaar}
            type="number"
            length={6}
            width="120px"
          />
          <HButton
            label="label.qde.button.validateOtp"
            variant="contained"
            size="small"
            inline
            loading={verifying.asAadhaarValidate}
            disabled={!form.asAadhaarOtp}
            onClick={onValidateAsAadhaarOtp}
          />
        </HBox>
        <HLabel value={statusLabelKey(form.asAadhaarStatus)} align="left" colon={false} />
      </HBox>
    </HBox>

    <HBox sx={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%", mb: 0.2 }}>
      <HBox sx={{ width: "280px", minWidth: "280px", flexShrink: 0 }}>
        <HLabel value="label.qde.field.panAadhaarLink" align="left" colon={false} />
      </HBox>

      <HBox sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <HButton
          label="label.qde.button.verify"
          variant="outlined"
          size="small"
          inline
          loading={verifying.asPanAadhaar}
          disabled={!form.asPan || !form.asAadhaar}
          onClick={onCheckAsPanAadhaarLink}
        />
        <HLabel value={statusLabelKey(form.asPanAadhaarLinked)} align="left" colon={false} />
      </HBox>
    </HBox>
  </SectionBlock>
);

export default AuthSignatoryKycSection;