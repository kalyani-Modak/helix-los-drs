import { useMemo } from "react";
import {
  HBox,
  HDatePicker,
  HDropdown,
  HLabel,
  HTextField,
} from "@helix/component-library";
import { useIntl } from "react-intl";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SectionBlock from "../components/SectionBlock";
import {
  EDUCATION_LEVELS,
  GENDERS,
  MARITAL_STATUSES,
  NATIONALITIES,
  RELIGIONS,
  RESIDENCE_STATUSES,
  TITLES,
} from "../constants/qdeOptions";
import { fromPickerValue, toPickerValue } from "../dateHelpers";

const calcAge = (dob) => {
  if (!dob) return "";
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) {
    return "";
  }
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDifference = today.getMonth() - birth.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birth.getDate())
  ) {
    age -= 1;
  }

  return age >= 0 ? String(age) : "";
};

const PersonalDetailsSection = ({ form, setField, errors = {} }) => {
  const intl = useIntl();
  const err = (name) => Boolean(errors[name]);
  const age = useMemo(() => calcAge(form.dob), [form.dob]);

  return (
    <SectionBlock
      sectionKey="personal"
      titleKey="label.qde.section.personal.title"
      icon={<DescriptionOutlinedIcon fontSize="small" />}
    >
      <HBox
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          boxSizing: "border-box",
          padding: "12px 16px 8px 16px",
        }}
      >
        <HBox
          sx={{
            width: "33.333%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 0,
            boxSizing: "border-box",
            pr: 1,
            mb: 1,
          }}
        >
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.title",
              defaultMessage: "Title",
            })}
            required
            align="left"
            colon={false}
          />

          <HDropdown
            name="title"
            options={TITLES}
            value={form.title || ""}
            onChange={(e) => setField("title", e.target.value)}
            required
            error={err("title")}
            width="100%"
          />
        </HBox>

        {/* First Name */}
        <HBox
          sx={{
            width: "33.333%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 0,
            boxSizing: "border-box",
            pr: 1,
            mb: 1,
          }}
        >
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.firstName",
              defaultMessage: "First Name",
            })}
            required
            align="left"
            colon={false}
          />

          <HTextField
            value={form.firstName || ""}
            onChange={(e) => setField("firstName", e.target.value)}
            editable
            required
            type="name"
            error={err("firstName")}
            width="100%"
          />
        </HBox>

        {/* Middle Name */}
        <HBox
          sx={{
            width: "33.333%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 0,
            boxSizing: "border-box",
            pr: 1,
            mb: 1,
          }}
        >
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.middleName",
              defaultMessage: "Middle Name",
            })}
            align="left"
            colon={false}
          />

          <HTextField
            value={form.middleName || ""}
            onChange={(e) => setField("middleName", e.target.value)}
            editable
            type="name"
            error={err("middleName")}
            width="100%"
          />
        </HBox>


        {/* Last Name */}
        <HBox
          sx={{
            width: "33.333%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 0,
            boxSizing: "border-box",
            pr: 1,
            mb: 1,
          }}
        >
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.lastName",
              defaultMessage: "Last Name",
            })}
            required
            align="left"
            colon={false}
          />

          <HTextField
            value={form.lastName || ""}
            onChange={(e) => setField("lastName", e.target.value)}
            editable
            required
            type="name"
            error={err("lastName")}
            width="100%"
          />
        </HBox>

        {/* Aadhaar */}
        <HBox
          sx={{
            width: "33.333%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 0,
            boxSizing: "border-box",
            pr: 1,
            mb: 1,
          }}
        >
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.aadhaar",
              defaultMessage: "Aadhaar (UIDAI)",
            })}
            align="left"
            colon={false}
          />

          <HTextField
            value={form.aadhaar || ""}
            onChange={(e) => setField("aadhaar", e.target.value)}
            editable
            length={12}
            placeholder="12-digit Aadhaar"
            error={err("aadhaar")}
            width="100%"
          />

          <HBox
            sx={{
              fontSize: "10px",
              color: "text.secondary",
              lineHeight: 1.5,
              mt: 1
            }}
          >
          
            {intl.formatMessage({
              id: "label.qde.helper.kycAutoPopulated",
              defaultMessage:
                "Auto-populated from Quick Data Entry KYC Check Grid — Individual",
            })}
          </HBox>
        </HBox>

        {/* PAN */}
        <HBox
          sx={{
            width: "33.333%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 0,
            boxSizing: "border-box",
            pr: 1,
            mb: 1,
          }}
        >
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.pan",
              defaultMessage: "PAN",
            })}
            align="left"
            colon={false}
          />

          <HTextField
            value={form.pan || ""}
            onChange={(e) => setField("pan", e.target.value)}
            editable
            length={10}
            placeholder="AAAAA9999A"
            error={err("pan")}
            width="100%"
          />

          <HBox
            sx={{
              fontSize: "10px",
              color: "text.secondary",
              lineHeight: 1.3,
              mt: 1,
            }}
          >
            {intl.formatMessage({
              id: "label.qde.helper.kycAutoPopulated",
              defaultMessage:
                "Auto-populated from Quick Data Entry KYC Check Grid — Individual",
            })}
          </HBox>
        </HBox>

        {/* ====================================================
            ROW 3
            Passport | DOB | Age
           ==================================================== */}

        {/* Passport Number */}
        <HBox
          sx={{
            width: "33.333%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 0,
            boxSizing: "border-box",
            pr: 1,
            mb: 1,
          }}
        >
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.passportNo",
              defaultMessage: "Passport No",
            })}
            align="left"
            colon={false}
          />

          <HTextField
            value={form.passportNo || ""}
            onChange={(e) => setField("passportNo", e.target.value)}
            editable
            placeholder="N1234567"
            error={err("passportNo")}
            width="100%"
          />
        </HBox>

        {/* Date of Birth */}
        <HBox
          sx={{
            width: "33.333%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 0,
            boxSizing: "border-box",
            pr: 1,
            mb: 1,
          }}
        >
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.dob",
              defaultMessage: "Date of Birth",
            })}
            required
            align="left"
            colon={false}
          />

          <HDatePicker
            value={toPickerValue(form.dob)}
            onChange={(value) => setField("dob", fromPickerValue(value))}
            required
            error={err("dob")}
            width="100%"
          />
        </HBox>

        {/* Age */}
        <HBox
          sx={{
            width: "33.333%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 0,
            boxSizing: "border-box",
            pr: 1,
            mb: 1,
          }}
        >
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.age",
              defaultMessage: "Age",
            })}
            align="left"
            colon={false}
          />

          <HTextField value={age} editable={false} width="100%" />
        </HBox>

        {/* ====================================================
            ROW 4
            Gender | Marital Status | Spouse Name
           ==================================================== */}

        {/* Gender */}
        <HBox
          sx={{
            width: "33.333%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 0,
            boxSizing: "border-box",
            pr: 1,
            mb: 1,
          }}
        >
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.gender",
              defaultMessage: "Gender",
            })}
            required
            align="left"
            colon={false}
          />

          <HDropdown
            name="gender"
            options={GENDERS}
            value={form.gender || ""}
            onChange={(e) => setField("gender", e.target.value)}
            required
            error={err("gender")}
            width="100%"
          />
        </HBox>

        {/* Marital Status */}
        <HBox
          sx={{
            width: "33.333%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 0,
            boxSizing: "border-box",
            pr: 1,
            mb: 1,
          }}
        >
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.maritalStatus",
              defaultMessage: "Marital Status",
            })}
            required
            align="left"
            colon={false}
          />

          <HDropdown
            name="maritalStatus"
            options={MARITAL_STATUSES}
            value={form.maritalStatus || ""}
            onChange={(e) => setField("maritalStatus", e.target.value)}
            required
            error={err("maritalStatus")}
            width="100%"
          />
        </HBox>

        {/* Spouse Name */}
        <HBox
          sx={{
            width: "33.333%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 0,
            boxSizing: "border-box",
            pr: 1,
            mb: 1,
          }}
        >
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.spouseName",
              defaultMessage: "Spouse Name",
            })}
            align="left"
            colon={false}
          />

          <HTextField
            value={form.spouseName || ""}
            onChange={(e) => setField("spouseName", e.target.value)}
            editable
            type="name"
            error={err("spouseName")}
            width="100%"
          />
        </HBox>

        {/* ====================================================
            ROW 5
            Dependents | Nationality | Country of Birth
           ==================================================== */}

        {/* No. of Dependents */}
        <HBox
          sx={{
            width: "33.333%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 0,
            boxSizing: "border-box",
            pr: 1,
            mb: 1,
          }}
        >
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.dependents",
              defaultMessage: "No. of Dependents",
            })}
            align="left"
            colon={false}
          />

          <HTextField
            value={form.dependents || ""}
            onChange={(e) => setField("dependents", e.target.value)}
            editable
            type="number"
            length={2}
            error={err("dependents")}
            width="100%"
          />
        </HBox>

        {/* Nationality */}
        <HBox
          sx={{
            width: "33.333%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 0,
            boxSizing: "border-box",
            pr: 1,
            mb: 1,
          }}
        >
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.nationality",
              defaultMessage: "Nationality",
            })}
            required
            align="left"
            colon={false}
          />

          <HDropdown
            name="nationality"
            options={NATIONALITIES}
            value={form.nationality || ""}
            onChange={(e) => setField("nationality", e.target.value)}
            required
            error={err("nationality")}
            width="100%"
          />
        </HBox>

        {/* Country of Birth */}
        <HBox
          sx={{
            width: "33.333%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 0,
            boxSizing: "border-box",
            pr: 1,
            mb: 1,
          }}
        >
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.countryOfBirth",
              defaultMessage: "Country of Birth",
            })}
            align="left"
            colon={false}
          />

          <HTextField
            value={form.countryOfBirth || ""}
            onChange={(e) => setField("countryOfBirth", e.target.value)}
            editable
            error={err("countryOfBirth")}
            width="100%"
          />
        </HBox>

        {/* ====================================================
            ROW 6
            Religion | Education Level | Residence Status
           ==================================================== */}

        {/* Religion */}
        <HBox
          sx={{
            width: "33.333%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 0,
            boxSizing: "border-box",
            pr: 1,
            mb: 1,
          }}
        >
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.religion",
              defaultMessage: "Religion",
            })}
            align="left"
            colon={false}
          />

          <HDropdown
            name="religion"
            options={RELIGIONS}
            value={form.religion || ""}
            onChange={(e) => setField("religion", e.target.value)}
            error={err("religion")}
            width="100%"
          />
        </HBox>

        {/* Education Level */}
        <HBox
          sx={{
            width: "33.333%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 0,
            boxSizing: "border-box",
            pr: 1,
            mb: 1,
          }}
        >
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.educationLevel",
              defaultMessage: "Education Level",
            })}
            required
            align="left"
            colon={false}
          />

          <HDropdown
            name="educationLevel"
            options={EDUCATION_LEVELS}
            value={form.educationLevel || ""}
            onChange={(e) => setField("educationLevel", e.target.value)}
            required
            error={err("educationLevel")}
            width="100%"
          />
        </HBox>

        {/* Residence Status */}
        <HBox
          sx={{
            width: "33.333%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 0,
            boxSizing: "border-box",
            pr: 1,
            mb: 1,
          }}
        >
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.residenceStatus",
              defaultMessage: "Residence Status",
            })}
            required
            align="left"
            colon={false}
          />

          <HDropdown
            name="residenceStatus"
            options={RESIDENCE_STATUSES}
            value={form.residenceStatus || ""}
            onChange={(e) => setField("residenceStatus", e.target.value)}
            required
            error={err("residenceStatus")}
            width="100%"
          />
        </HBox>

        {/* ====================================================
            ROW 7
            Mobile | Email | Empty
           ==================================================== */}

        {/* Mobile Number */}
        <HBox
          sx={{
            width: "33.333%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 0,
            boxSizing: "border-box",
            pr: 1,
            mb: 1,
          }}
        >
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.mobile",
              defaultMessage: "Mobile Number",
            })}
            required
            align="left"
            colon={false}
          />

          <HTextField
            value={form.mobile || ""}
            onChange={(e) => setField("mobile", e.target.value)}
            editable
            required
            type="phone"
            length={10}
            placeholder="07XXXXXXXX"
            error={err("mobile")}
            width="100%"
          />
        </HBox>

        {/* Email */}
        <HBox
          sx={{
            width: "33.333%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            minWidth: 0,
            boxSizing: "border-box",
            pr: 1,
            mb: 1,
          }}
        >
          <HLabel
            value={intl.formatMessage({
              id: "label.qde.field.email",
              defaultMessage: "Email",
            })}
            required
            align="left"
            colon={false}
          />

          <HTextField
            value={form.email || ""}
            onChange={(e) => setField("email", e.target.value)}
            editable
            required
            error={err("email")}
            width="100%"
          />
        </HBox>
      </HBox>
    </SectionBlock>
  );
};

export default PersonalDetailsSection;
