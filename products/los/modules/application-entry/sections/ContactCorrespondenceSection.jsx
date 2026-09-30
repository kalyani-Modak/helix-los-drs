import { HBox, HLabel, HTextField } from "@helix/component-library";
import { useIntl } from "react-intl";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SectionBlock from "../components/SectionBlock";

const ContactCorrespondenceSection = ({
  form,
  setField,
  errors = {},
  defaultExpanded = true,
}) => {
  const intl = useIntl();

  const err = (name) => Boolean(errors[name]);

  return (
    <SectionBlock
      sectionKey="contact"
      titleKey="label.qde.section.contact.title"
      icon={<DescriptionOutlinedIcon fontSize="small" />}
      defaultExpanded={defaultExpanded}
    >
      <HBox
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          boxSizing: "border-box",
          padding: "12px 16px 8px 16px",
          rowGap: "8px",
        }}
      >
        {/* ====================================================
            ROW 1
            Home Phone | Office Phone | Alternate Mobile
           ==================================================== */}

        {/* Home Phone */}
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
              id: "label.qde.field.homePhone",
              defaultMessage: "Home Phone",
            })}
            align="left"
            colon={false}
          />

          <HTextField
            value={form.homePhone || ""}
            onChange={(e) => setField("homePhone", e.target.value)}
            editable
            type="phone"
            length={10}
            placeholder="0112345678"
            error={err("homePhone")}
            width="100%"
          />
        </HBox>

        {/* Office Phone */}
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
              id: "label.qde.field.officePhone",
              defaultMessage: "Office Phone",
            })}
            align="left"
            colon={false}
          />

          <HTextField
            value={form.officePhone || ""}
            onChange={(e) => setField("officePhone", e.target.value)}
            editable
            type="phone"
            length={10}
            placeholder="0112345678"
            error={err("officePhone")}
            width="100%"
          />
        </HBox>

        {/* Alternate Mobile */}
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
              id: "label.qde.field.alternateMobile",
              defaultMessage: "Alternate Mobile",
            })}
            align="left"
            colon={false}
          />

          <HTextField
            value={form.alternateMobile || ""}
            onChange={(e) => setField("alternateMobile", e.target.value)}
            editable
            type="phone"
            length={10}
            placeholder="07XXXXXXXX"
            error={err("alternateMobile")}
            width="100%"
          />
        </HBox>

        {/* ====================================================
            ROW 2
            Office Email | Personal Email
           ==================================================== */}

        {/* Office Email */}
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
              id: "label.qde.field.officeEmail",
              defaultMessage: "Office Email",
            })}
            align="left"
            colon={false}
          />

          <HTextField
            value={form.officeEmail || ""}
            onChange={(e) => setField("officeEmail", e.target.value)}
            editable
            error={err("officeEmail")}
            width="100%"
          />
        </HBox>

        {/* Personal Email */}
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
              id: "label.qde.field.personalEmail",
              defaultMessage: "Personal Email",
            })}
            align="left"
            colon={false}
          />

          <HTextField
            value={form.personalEmail || ""}
            onChange={(e) => setField("personalEmail", e.target.value)}
            editable
            error={err("personalEmail")}
            width="100%"
          />
        </HBox>
      </HBox>
    </SectionBlock>
  );
};

export default ContactCorrespondenceSection;
