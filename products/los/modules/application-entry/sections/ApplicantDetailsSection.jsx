import {
  HBox,
  HButton,
  HCheckBox,
  HDatePicker,
  HDropdown,
  HLabel,
  HTextField
} from "@helix/component-library";
import SectionBlock from "../components/SectionBlock";
import {
  BORROWER_CATEGORIES,
  ENTITY_TYPES,
  GENDERS
} from "../constants/qdeOptions";
import { fromPickerValue, toPickerValue } from "../dateHelpers";
import { useIntl } from "react-intl";

const DEFAULT_FIELD_WIDTH = {
  xs: "100%",
  sm: "50%",
  md: "33.333%"
};

const FieldContainer = ({ children }) => (
  <HBox
    sx={{
      width: DEFAULT_FIELD_WIDTH,
      display: "flex",
      flexDirection: "column",
      gap: 0.5,
      minWidth: 0,
      boxSizing: "border-box",
      px: 1
    }}
  >
    {children}
  </HBox>
);

const VerifiedFlag = ({ verified }) => (
  <HLabel
    value={
      verified
        ? "label.qde.status.verified"
        : "label.qde.status.pending"
    }
    align="left"
    colon={false}
  />
);

const ApplicantDetailsSection = ({
  form,
  setField,
  isNonIndividual,
  onVerifyMobile,
  onVerifyEmail,
  verifyingMobile = false,
}) => {
  const intl = useIntl();

  return (
    <SectionBlock
      sectionKey="applicant"
      titleKey="label.qde.section.applicant"
    >
      <HBox
        sx={{
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        {isNonIndividual ? (
          <>
            {/* Entity Name */}
            <FieldContainer>
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
                onChange={(e) =>
                  setField("entityName", e.target.value)
                }
                editable
                required
                width="100%"
              />
            </FieldContainer>

            {/* Entity Type */}
            <FieldContainer>
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
                options={ENTITY_TYPES}
                value={form.entityType}
                onChange={(e) =>
                  setField("entityType", e.target.value)
                }
                required
                width="100%"
              />
            </FieldContainer>

            {/* DOI */}
            <FieldContainer>
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
                onChange={(value) =>
                  setField("doi", fromPickerValue(value))
                }
                width="100%"
              />
            </FieldContainer>
          </>
        ) : (
          <>
            {/* First Name */}
            <FieldContainer>
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
                onChange={(e) =>
                  setField("firstName", e.target.value)
                }
                editable
                required
                type="name"
                width="100%"
              />
            </FieldContainer>

            {/* Middle Name */}
            <FieldContainer>
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
                onChange={(e) =>
                  setField("middleName", e.target.value)
                }
                editable
                type="name"
                width="100%"
              />
            </FieldContainer>

            {/* Last Name */}
            <FieldContainer>
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
                onChange={(e) =>
                  setField("lastName", e.target.value)
                }
                editable
                required
                type="name"
                width="100%"
              />
            </FieldContainer>

            {/* Gender */}
            <FieldContainer>
              <HLabel
                value={intl.formatMessage({
                  id: "label.qde.field.gender",
                  defaultMessage: "Gender"
                })}
                required
                align="left"
                colon={false}
                sx={{mt: 2}}
              />

              <HDropdown
                name="gender"
                options={GENDERS}
                value={form.gender}
                onChange={(e) =>
                  setField("gender", e.target.value)
                }
                required
                width="100%"
              />
            </FieldContainer>

            {/* DOB */}
            <FieldContainer>
              <HLabel
                value={intl.formatMessage({
                  id: "label.qde.field.dob",
                  defaultMessage: "Date of Birth"
                })}
                required
                align="left"
                colon={false}
                sx={{mt: 2}}
              />

              <HDatePicker
                value={toPickerValue(form.dob)}
                onChange={(value) =>
                  setField("dob", fromPickerValue(value))
                }
                required
                width="100%"
              />
            </FieldContainer>

            {/* Borrower Category */}
            <FieldContainer>
              <HLabel
                value={intl.formatMessage({
                  id: "label.qde.field.borrowerCategory",
                  defaultMessage: "Borrower Category"
                })}
                align="left"
                colon={false}
                sx={{mt: 2}}
              />

              <HDropdown
                name="profile"
                options={BORROWER_CATEGORIES}
                value={form.profile}
                onChange={(e) =>
                  setField("profile", e.target.value)
                }
                width="100%"
              />
            </FieldContainer>

            {/* Father Name */}
            <FieldContainer>
              <HLabel
                value={intl.formatMessage({
                  id: "label.qde.field.fatherName",
                  defaultMessage: "Father Name"
                })}
                align="left"
                colon={false}
                sx={{mt: 0.5}}
              />

              <HTextField
                value={form.fatherName}
                onChange={(e) =>
                  setField("fatherName", e.target.value)
                }
                editable
                type="name"
                width="100%"
              />
            </FieldContainer>

            {/* Mother Name */}
            <FieldContainer>
              <HLabel
                value={intl.formatMessage({
                  id: "label.qde.field.motherName",
                  defaultMessage: "Mother Name"
                })}
                align="left"
                colon={false}
                sx={{mt: 0.5}}
              />

              <HTextField
                value={form.motherName}
                onChange={(e) =>
                  setField("motherName", e.target.value)
                }
                editable
                type="name"
                width="100%"
              />
            </FieldContainer>
          </>
        )}

        {/* Mobile */}
        <FieldContainer>
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.mobile",
              defaultMessage: "Mobile"
            })}
            required
            align="left"
            colon={false}
            sx={{mt: 0.5}}
          />

          <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.5,  }}>
            <HBox sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }} >
              <HTextField
                value={form.mobile}
                onChange={(e) =>
                  setField("mobile", e.target.value)
                }
                editable
                required
                type="phone"
                length={10}
                width="160px"
              />

              <HButton
                label="label.qde.button.verify"
                variant="outlined"
                size="small"
                inline
                loading={verifyingMobile}
                disabled={!form.mobile}
                onClick={onVerifyMobile}
              />
            </HBox>

            <VerifiedFlag verified={form.mobileVerified} />
          </HBox>
        </FieldContainer>

        {/* Email */}
        <FieldContainer>
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.email",
              defaultMessage: "Email"
            })}
            align="left"
            colon={false}
          />

          <HBox
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5
            }}
          >
            <HBox
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap"
              }}
            >
              <HTextField
                value={form.email}
                onChange={(e) =>
                  setField("email", e.target.value)
                }
                editable
                width="200px"
              />

              <HButton
                label="label.qde.button.verify"
                variant="outlined"
                size="small"
                inline
                disabled={!form.email}
                onClick={onVerifyEmail}
              />
            </HBox>

            <VerifiedFlag verified={form.emailVerified} />
          </HBox>
        </FieldContainer>

        {/* Staff / Pre Approved */}
        <HBox
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 2,
            height: "100%",
            mt: 1
          }}
        >
          <HCheckBox
            sx={{ width: "3%" }}
            checked={form.staff}
            onChange={(e) =>
              setField("staff", e.target.checked)
            }
          />

          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.staff",
              defaultMessage: "Staff"
            })}
          />

          <HCheckBox
            sx={{ width: "3%" }}
            checked={form.preApproved}
            onChange={(e) =>
              setField("preApproved", e.target.checked)
            }
          />

          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.preApproved",
              defaultMessage: "Pre Approved"
            })}
          />
        </HBox>
      </HBox>
    </SectionBlock>
  );
};

export default ApplicantDetailsSection;