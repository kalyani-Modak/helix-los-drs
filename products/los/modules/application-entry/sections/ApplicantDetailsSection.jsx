import { HBox, HRadio, HCheckBox, HDatePicker, HDropdown, HLabel, HTextField } from "@helix/component-library";
import SectionBlock from "../components/SectionBlock";
import FieldError from "../components/FieldError";
import { BORROWER_CATEGORIES, ENTITY_TYPES, GENDERS } from "../constants/qdeOptions";
import { fromPickerValue, toPickerValue } from "../dateHelpers";
import { useIntl } from "react-intl";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const ApplicantDetailsSection = ({
  form,
  setField,
  isNonIndividual,
  onVerifyMobile,
  onVerifyEmail,
  errors = {},
  genderOptions = GENDERS,
  entityTypeOptions = ENTITY_TYPES,
  borrowerCategoryOptions = BORROWER_CATEGORIES,
}) => {
  const intl = useIntl();
  const err = (name) => errors[name];

  const isValidMobile = (value) => /^[6-9]\d{9}$/.test(value || "");
  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "");

  const mobileError =
    form.mobile && !isValidMobile(form.mobile)
      ? "Enter 10-digit mobile starting 6-9."
      : err("mobile");

  const emailError =
    form.email && !isValidEmail(form.email)
      ? "Invalid email format (RFC 5322)."
      : err("email");

  return (
    <SectionBlock sectionKey="applicant"
      titleKey={isNonIndividual ? "label.qde.section.applicant.nonIndividual" : "label.qde.section.applicant.individual"}
      subTitleKey="label.qde.section.applicant.subtitle"
      icon={<PersonOutlineOutlinedIcon fontSize="small" />}
    >
      <HBox sx={{ width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {isNonIndividual ? (
          <>
            {/* ---- Non-Individual fields ---- */}
            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", pr: 1, mb: 1 }}>
              <HLabel
                value={intl.formatMessage({
                  id: "label.qde.field.entityName",
                  defaultMessage: "Entity Name"
                })}
                required
                align="left"
                colon={false}
              />
              <HTextField
                value={form.entityName}
                onChange={(e) => setField("entityName", e.target.value)}
                editable
                required
                error={Boolean(err("entityName"))}
                width="100%"
                placeholder="Enter entity name"
              />
              <FieldError message={err("entityName")}  sx={{ mt: 1.5 }} />
            </HBox>

            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", pr: 1, mb: 1 }}>
              <HLabel
                value={intl.formatMessage({
                  id: "label.qde.field.entityType",
                  defaultMessage: "Entity Type"
                })}
                required
                align="left"
                colon={false}
              />
              <HDropdown
                name="entityType"
                options={entityTypeOptions}
                value={form.entityType}
                onChange={(e) => setField("entityType", e.target.value)}
                required
                error={Boolean(err("entityType"))}
                width="100%"
                placeholder="Search entity type"
              />
              <FieldError message={err("entityType")} />
            </HBox>

            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", pr: 1, mb: 1 }}>
              <HLabel
                value={intl.formatMessage({
                  id: "label.qde.field.doi",
                  defaultMessage: "Date of Incorporation"
                })}
                align="left"
                colon={false}
              />
              <HDatePicker
                value={toPickerValue(form.doi)}
                onChange={(value) => setField("doi", fromPickerValue(value))}
                width="100%"
              />
            </HBox>
          </>
        ) : (
          <>
            {/* ---- Individual fields ---- */}
            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", alignItems: "flex-start", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", pr: 1, mb: 2.5 }}>
              <HLabel
                value={intl.formatMessage({
                  id: "label.qde.field.firstName",
                  defaultMessage: "First Name"
                })}
                required
                align="left"
                colon={false}
              />
              <HTextField
                value={form.firstName}
                onChange={(e) => setField("firstName", e.target.value)}
                editable
                required
                type="name"
                error={Boolean(err("firstName"))}
                width="100%"
              />
              <FieldError message={err("firstName")} sx={{ mt: 1.5 }} />
            </HBox>

            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", pr: 1, mb: 1 }}>
              <HLabel
                value={intl.formatMessage({
                  id: "label.qde.field.middleName",
                  defaultMessage: "Middle Name"
                })}
                align="left"
                colon={false}
              />
              <HTextField
                value={form.middleName}
                onChange={(e) => setField("middleName", e.target.value)}
                editable
                type="name"
                width="100%"
              />
            </HBox>

            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", pr: 1, mb: 1 }}>
              <HLabel
                value={intl.formatMessage({
                  id: "label.qde.field.lastName",
                  defaultMessage: "Last Name"
                })}
                required
                align="left"
                colon={false}
              />
              <HTextField
                value={form.lastName}
                onChange={(e) => setField("lastName", e.target.value)}
                editable
                required
                type="name"
                error={Boolean(err("lastName"))}
                width="100%"
              />
              <FieldError message={err("lastName")} sx={{ mt: 1.5 }} />
            </HBox>

            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", pr: 1, mb: 1 }}>
              <HLabel
                value={intl.formatMessage({
                  id: "label.qde.field.gender",
                  defaultMessage: "Gender"
                })}
                required
                align="left"
                colon={false}
              />
              <HDropdown
                name="gender"
                options={genderOptions}
                value={form.gender}
                onChange={(e) => setField("gender", e.target.value)}
                required
                error={Boolean(err("gender"))}
                width="100%"
              />
              <FieldError message={err("gender")} />
            </HBox>

              <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", pr: 1, mb: 1 }}>
                <HLabel
                  value={intl.formatMessage({
                    id: "label.qde.field.dob",
                    defaultMessage: "Date of Birth"
                  })}
                  required
                  align="left"
                  colon={false}
                />

                <HDatePicker
                  value={toPickerValue(form.dob)}
                  onChange={(value) => setField("dob", fromPickerValue(value))}
                  required
                  error={Boolean(err("dob"))}
                  width="100%"
                />
                <FieldError message={err("dob")} />
              </HBox>

              <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", pr: 1, mb: 1 }}>
                <HLabel
                  value={intl.formatMessage({
                    id: "label.qde.field.borrowerCategory",
                    defaultMessage: "Borrower Category"
                })}
                align="left"
                colon={false}
              />
              <HDropdown
                name="profile"
                options={borrowerCategoryOptions}
                value={form.profile || "SAL" }
                onChange={(e) => setField("profile", e.target.value)}
                width="100%"
              />
            </HBox>

            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", pr: 1, mb: 1 }}>
              <HLabel
                value={intl.formatMessage({
                  id: "label.qde.field.fatherName",
                  defaultMessage: "Father's Name"
                })}
                align="left"
                colon={false}
              />
              <HTextField
                value={form.fatherName}
                onChange={(e) => setField("fatherName", e.target.value)}
                editable
                type="name"
                width="100%"
              />
            </HBox>

            {/* Mother's Name — required by IndividualDetailsDto, now validated */}
            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", pr: 1, mb: 1 }}>
              <HLabel
                value={intl.formatMessage({
                  id: "label.qde.field.motherName",
                  defaultMessage: "Mother's Name"
                })}
                required
                align="left"
                colon={false}
              />
              <HTextField
                value={form.motherName}
                onChange={(e) => setField("motherName", e.target.value)}
                editable
                required
                type="name"
                error={Boolean(err("motherName"))}
                width="100%"
              />
              <FieldError message={err("motherName")} sx={{ mt: 1.5 }} />
            </HBox>
          </>
        )}

        {/* ---- Common fields (both Individual & Non-Individual) ---- */}

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", pr: 1, mb: 1, }}>
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.mobile",
              defaultMessage: "Mobile Number",
            })}
            required
            align="left"
            colon={false}
          />

          <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <HBox sx={{ display: "flex", alignItems: "flex-start", gap: 1, flexWrap: "nowrap" }}>
              <HTextField
                value={form.mobile || ""}
                onChange={(e) => {
                  const value = e.target.value;

                  setField("mobile", value);

                  if (value !== form.mobile && form.mobileVerified) {
                    setField("mobileVerified", false);
                  }
                }}
                editable
                required
                type="phone"
                length={10}
                error={Boolean(mobileError)}
                width="90%"
              />

              {form.mobileVerified ? (
                <HBox sx={{ display: "flex", alignItems: "center", gap: 0.5, whiteSpace: "nowrap", }}>
                  <CheckCircleOutlineIcon
                    fontSize="small"
                    sx={{ color: "success.main" }}
                  />

                  <HLabel
                    value="Verified"
                    colon={false}
                  />
                </HBox>
              ) : (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();

                    if (isValidMobile(form.mobile)) {
                      onVerifyMobile();
                    }
                  }}
                  style={{
                    pointerEvents: isValidMobile(form.mobile) ? "auto" : "none",
                    opacity: isValidMobile(form.mobile) ? 1 : 0.5,
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                  }}
                >
                  Verify
                </a>
              )}
            </HBox>

            <FieldError message={mobileError} sx={{ mt: 0.5 }} />
          </HBox>
        </HBox>

        <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0, boxSizing: "border-box", pr: 1, mb: 1, }}>
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.email",
              defaultMessage: "Email",
            })}
            align="left"
            colon={false}
            required
          />

          <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <HBox
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
                flexWrap: "nowrap",
              }}
            >
              <HTextField
                value={form.email || ""}
                onChange={(e) => {
                  const value = e.target.value;

                  setField("email", value);

                  if (value !== form.email && form.emailVerified) {
                    setField("emailVerified", false);
                  }
                }}
                editable
                error={Boolean(emailError)}
                width="90%"
              />

              {form.emailVerified ? (
                <HBox sx={{ display: "flex", alignItems: "center", gap: 0.5, whiteSpace: "nowrap" }}>
                  <CheckCircleOutlineIcon
                    fontSize="small"
                    sx={{ color: "success.main" }}
                  />

                  <HLabel
                    value="Verified"
                    colon={false}
                  />
                </HBox>
              ) : (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();

                    if (isValidEmail(form.email)) {
                      onVerifyEmail();
                    }
                  }}
                  style={{
                    pointerEvents: isValidEmail(form.email) ? "auto" : "none",
                    opacity: isValidEmail(form.email) ? 1 : 0.5,
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                  }}
                >
                  Verify
                </a>
              )}
            </HBox>

            <FieldError message={emailError} sx={{ mt: 0.5 }} />
          </HBox>
        </HBox>

        {!isNonIndividual ? (<HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "row", alignItems: "center", gap: 2, boxSizing: "border-box", pr: 1, mt: 1 }}>
          <HCheckBox
            sx={{ width: "3%" }}
            checked={form.staff}
            onChange={(e) => setField("staff", e.target.checked)}
          />
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.staff",
              defaultMessage: "Staff"
            })}
            colon={false}
          />

          <HCheckBox
            sx={{ width: "3%" }}
            checked={form.preApproved}
            onChange={(e) => setField("preApproved", e.target.checked)}
          />
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.preApproved",
              defaultMessage: "Pre Approved"
            })}
            colon={false}
          />
        </HBox>) :
          <>
            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", minWidth: 0, boxSizing: "border-box", pr: 1, mt: 1 }}>
              <HLabel
                value={intl.formatMessage({
                  id: "label.qde.field.GSTRegistered",
                  defaultMessage: "GST Registered"
                })}
                required
                align="left"
                colon={false}
              />

              <HBox sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                <HRadio
                  label="label.qde.option.yes"
                  checked={form.GSTRegistered === "Y"}
                  onChange={() => setField("GSTRegistered", "Y")}
                />

                <HRadio
                  label="label.qde.option.no"
                  checked={form.GSTRegistered === "N"}
                  onChange={() => setField("GSTRegistered", "N")}
                />
              </HBox>
            </HBox>
            
            <HBox sx={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", minWidth: 0, boxSizing: "border-box" }}>
              <HLabel sx={{ ml: 2 }}
                value={intl.formatMessage({
                  id: "label.qde.field.MSMERegistered",
                  defaultMessage: "MSME Registered"
                })}
                required
                align="left"
                colon={false}
              />

              <HBox sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                <HRadio
                  label="label.qde.option.yes"
                  checked={form.MSMERegistered === "Y"}
                  onChange={() => setField("MSMERegistered", "Y")}
                />

                <HRadio
                  label="label.qde.option.no"
                  checked={form.MSMERegistered === "N"}
                  onChange={() => setField("MSMERegistered", "N")}
                />
              </HBox>
            </HBox>
          </>
   
        }

      </HBox>
    </SectionBlock>
  );
};

export default ApplicantDetailsSection;