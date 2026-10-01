import { HDatePicker, HLabel, HTextField, HBox } from "@helix/component-library";
import SectionBlock from "../components/SectionBlock";
import FieldError from "../components/FieldError";
import { fromPickerValue, toPickerValue } from "../dateHelpers";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const AuthSignatorySection = ({
  form,
  setField,
  onVerifyAsMobile,
  onVerifyAsEmail,
  noAccordion,
  errors = {},
}) => {
  const err = (name) => errors[name];
  const isValidMobile = (value) => /^[6-9]\d{9}$/.test(value || "");
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "");
  const mobileError = form.asMobile && !isValidMobile(form.asMobile)
    ? "Enter 10-digit mobile starting 6-9."
    : err("asMobile");
  const emailError = form.asEmail && !isValidEmail(form.asEmail)
    ? "Invalid email format (RFC 5322)."
    : err("asEmail");

  return (
    <SectionBlock sectionKey="authSignatory" titleKey="label.qde.section.authSignatory" noAccordion={noAccordion} icon={<PersonOutlineOutlinedIcon fontSize="small" />} >
      <HBox sx={{ width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap",gap:0.5 }}>
        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
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
          <FieldError message={err("asFirstName")} sx={{ mt: 1.5 }} />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.middleName" align="left" colon={false} />
          <HTextField
            value={form.asMiddleName}
            onChange={(e) => setField("asMiddleName", e.target.value)}
            editable
            type="name"
            width="100%"
          />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
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
          <FieldError message={err("asLastName")} sx={{ mt: 1.5 }} />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px", mt: 1 }}>
          <HLabel value="label.qde.field.dob" required align="left" colon={false} />
          <HDatePicker
            value={toPickerValue(form.asDob)}
            onChange={(value) => setField("asDob", fromPickerValue(value))}
            required
            error={Boolean(err("asDob"))}
            width="100%"
          />
          <FieldError message={err("asDob")} />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap:0.5, minWidth: 0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px", mt: 1 }}>
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
          <FieldError message={err("asDesignation")}  sx={{ mt: 1.5 }}/>
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column",  minWidth: 0, boxSizing: "border-box", gap: 0, paddingRight: "8px", marginBottom: "8px", mt: 1 }}>
          <HLabel value="label.qde.field.mobile" required align="left" colon={false} />
            <HBox sx={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap",flexDirection: "row", }}>
              <HTextField
                value={form.asMobile || ""}
                onChange={(e) => {
                  setField("asMobile", e.target.value);
                  if (e.target.value !== form.asMobile && form.asMobileVerified) {
                    setField("asMobileVerified", false);
                  }
                }}
                editable
                required
                type="phone"
                length={10}
                error={Boolean(mobileError)}
                width="80%"
              />
              {form.asMobileVerified ? (
                <HBox sx={{ display: "flex", alignItems: "center", whiteSpace: "nowrap",mt:1 }}>
                  <CheckCircleOutlineIcon fontSize="small" sx={{ color: "success.main" }} />
                  <HLabel value="Verified" colon={false} />
                </HBox>
              ) : (
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    if (isValidMobile(form.asMobile)) onVerifyAsMobile();
                  }}
                  style={{
                    pointerEvents: isValidMobile(form.asMobile) ? "auto" : "none",
                    opacity: isValidMobile(form.asMobile) ? 1 : 0.5,
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                  }}
                >
                  Verify
                </a>
              )}
            </HBox>
            <FieldError message={mobileError}  sx={{ mt: 1 }} />
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", minWidth: 0,gap:0, boxSizing: "border-box", paddingRight: "8px", marginBottom: "8px" }}>
          <HLabel value="label.qde.field.email"  align="left" colon={false} />
            <HBox sx={{ display: "flex", alignItems: "flex-start", gap: 0.5, flexWrap: "wrap" }}>
              <HTextField
                value={form.asEmail || ""}
                onChange={(e) => {
                  setField("asEmail", e.target.value);
                  if (e.target.value !== form.asEmail && form.asEmailVerified) {
                    setField("asEmailVerified", false);
                  }
                }}
                editable
                error={Boolean(emailError)}
                width="80%"
              />
              {form.asEmailVerified ? (
                <HBox sx={{ display: "flex", alignItems: "center", gap: 0.5, whiteSpace: "nowrap", mt:1}}>
                  <CheckCircleOutlineIcon fontSize="small" sx={{ color: "success.main" }} />
                  <HLabel value="Verified" colon={false} />
                </HBox>
              ) : (
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    if (isValidEmail(form.asEmail)) onVerifyAsEmail();
                  }}
                  style={{
                    pointerEvents: isValidEmail(form.asEmail) ? "auto" : "none",
                    opacity: isValidEmail(form.asEmail) ? 1 : 0.5,
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                  }}
                >
                  Verify
                </a>
              )}
            </HBox>
            <FieldError message={emailError}  sx={{ mt: 1 }} />
        </HBox>
      </HBox>
    </SectionBlock>
  );
};

export default AuthSignatorySection;