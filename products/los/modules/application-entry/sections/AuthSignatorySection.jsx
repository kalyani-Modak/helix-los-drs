import { HButton, HDatePicker, HLabel, HTextField, HBox } from "@helix/component-library";
import SectionBlock from "../components/SectionBlock";
import { fromPickerValue, toPickerValue } from "../dateHelpers";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

const AuthSignatorySection = ({
  form,
  setField,
  onVerifyAsMobile,
  onVerifyAsEmail,
  verifyingMobile = false,
  noAccordion,
  errors = {},
}) => {
  const err = (name) => errors[name];

  return (
    <SectionBlock sectionKey="authSignatory" titleKey="label.qde.section.authSignatory" noAccordion={noAccordion} icon={<PersonOutlineOutlinedIcon fontSize="small" />} >
      <HBox sx={{ width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap",gap:0.5 }}>
        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 1.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.firstName" required align="left" colon={false} />
          <HTextField
            value={form.asFirstName}
            onChange={(e) => setField("asFirstName", e.target.value)}
            editable
            required
            type="name"
            error={Boolean(err("asFirstName"))}
            width="100%"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 1.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.middleName" align="left" colon={false} />
          <HTextField
            value={form.asMiddleName}
            onChange={(e) => setField("asMiddleName", e.target.value)}
            editable
            type="name"
            width="100%"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 1.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.lastName" required align="left" colon={false} />
          <HTextField
            value={form.asLastName}
            onChange={(e) => setField("asLastName", e.target.value)}
            editable
            required
            type="name"
            error={Boolean(err("asLastName"))}
            width="100%"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 1.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px", mt: 1 }}>
          <HLabel value="label.qde.field.dob" required align="left" colon={false} />
          <HDatePicker
            value={toPickerValue(form.asDob)}
            onChange={(value) => setField("asDob", fromPickerValue(value))}
            required
            error={Boolean(err("asDob"))}
            width="100%"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 1.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px", mt: 1 }}>
          <HLabel value="label.qde.field.designation" required align="left" colon={false} />
          <HTextField
            value={form.asDesignation}
            onChange={(e) => setField("asDesignation", e.target.value)}
            editable
            required
            error={Boolean(err("asDesignation"))}
            width="100%"
            placeholder="Director / Partner / Proprietor"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column",  minWidth: 0, boxSizing: "border-box", gap: 0, paddingRight: "8px", marginBottom: "8px", mt: 1 }}>
          <HLabel value="label.qde.field.mobile" required align="left" colon={false} />
            <HBox sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <HTextField
                value={form.asMobile}
                onChange={(e) => setField("asMobile", e.target.value)}
                editable
                required
                type="phone"
                length={10}
                error={Boolean(err("asMobile"))}
                width="330px"
              />
              <HButton
                label="label.qde.button.verify"
                variant="outlined"
                size="small"
                inline
                loading={verifyingMobile}
                disabled={!form.asMobile}
                onClick={onVerifyAsMobile}
                sx={{mt:1}}
              />
            </HBox>
           
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", minWidth: 0,gap:0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.email"  align="left" colon={false} />
            <HBox sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "wrap" }}>
              <HTextField
                value={form.asEmail}
                onChange={(e) => setField("asEmail", e.target.value)}
                editable
                error={Boolean(err("asEmail"))}
                width="330px"
              />
              <HButton
                label="label.qde.button.verify"
                variant="outlined"
                size="small"
                inline
                disabled={!form.asEmail}
                onClick={onVerifyAsEmail}
                sx={{mt:1}}
              />
            </HBox>
        </HBox>
      </HBox>
    </SectionBlock>
  );
};

export default AuthSignatorySection;