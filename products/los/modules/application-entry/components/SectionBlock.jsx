import { useState } from "react";
import { Grid } from "@mui/material";
import { HAccordion, HBox, useDrsTheme, HLabel } from "@helix/component-library";
import { useIntl } from "react-intl";

const SectionBlock = ({ sectionKey, titleKey, subTitleKey, defaultExpanded = true, icon, noAccordion = false, children }) => {
  const [expanded, setExpanded] = useState({ [sectionKey]: defaultExpanded });
  const { colors, text, border, action } = useDrsTheme();
  const intl = useIntl();

 if (noAccordion) {
    return (
      <HBox sx={{ mb: 2, border: "1px solid #ddd", borderRadius: "4px", overflow: "hidden" }}>
        {titleKey && (
          <HLabel
            sx={{ color: text.primary, fontWeight: 600 }}
            value={titleKey}
            align="left"
            colon={false}
          />
        )}
        <Grid container spacing={1.4} alignItems="flex-start" sx={{ p: 2 }} >
          {children}
        </Grid>
      </HBox>
    );
  }

  return (
    <HBox
      sx={{
        mb: 2,
        position: "relative",

        "& .MuiAccordion-root": {
          borderLeft: `3px solid ${text.secondary}`,
          borderRadius: "8px !important",
        },
        "& .MuiAccordionSummary-content .MuiTypography-root": {
          background: "none !important",
          WebkitBackgroundClip: "unset !important",
          WebkitTextFillColor: text.primary,
          backgroundClip: "unset !important",
          color: text.primary,
          display: "flex",
          alignItems: "center",

          ...(icon && {
            paddingLeft: "38px",
          }),
        },

        ...(icon && {
          "& .qde-section-icon": {
            position: "absolute",
            left: "18px",
            top: "7px",
            zIndex: 2,
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "6px",
            backgroundColor: action.hover,
            border: `1px solid ${border.control}`,
            color: colors.primary,

            "& svg": {
              color: colors.primary,
              fontSize: "18px",
            },
          },
        }),

        ...(subTitleKey && {
          "& .MuiAccordionSummary-content .MuiTypography-root::after": {
            content: `" | ${intl.formatMessage({
              id: subTitleKey,
              defaultMessage: subTitleKey,
            })}"`,
            marginLeft: "8px",
            fontSize: "12px",
            fontWeight: 400,
            color: text.secondary,
            WebkitTextFillColor: text.secondary,
          },
        }),
      }}
    >
      {icon && (
        <HBox className="qde-section-icon">
          {icon}
        </HBox>
      )}

      <HAccordion
        id={`qde-section-${sectionKey}`}
        title={titleKey}
        childKeyProp={sectionKey}
        isExpandedChildrenProp={expanded}
        onChangeEvent={() =>
          setExpanded((prev) => ({
            ...prev,
            [sectionKey]: !prev[sectionKey],
          }))
        }
      >
        <Grid container spacing={1.4} alignItems="flex-start">
          {children}
        </Grid>
      </HAccordion>
    </HBox>
  );
};

export default SectionBlock;
