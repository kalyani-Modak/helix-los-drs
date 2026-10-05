import { useState } from "react";
import { Grid } from "@mui/material";
import { HAccordion, HBox, useDrsTheme, HLabel } from "@helix/component-library";
import { useIntl } from "react-intl";

const SectionBlock = ({ sectionKey, titleKey, subTitleKey, count, defaultExpanded = true, expanded: expandedProp, onExpandedChange, icon, noAccordion = false, showHeaderMeta = false, sx, headerStatusLabel, headerStatus, children }) => {
  const [expanded, setExpanded] = useState({ [sectionKey]: defaultExpanded });
  const { colors, text, border, action } = useDrsTheme();
  const intl = useIntl();
  const isExpanded = expandedProp ?? expanded[sectionKey] ?? defaultExpanded;

  if (noAccordion) {
    return (
      <HBox sx={{ mb: 2, border: "1px solid #ddd", borderRadius: "4px", overflow: "hidden", ...sx }}>
        {titleKey && (
          <HBox sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 0.75,
            px: 2,
            py: 1,
            width: "100%",
            boxSizing: "border-box",
          }}>
            {showHeaderMeta && icon && (
              <HBox sx={{ color: colors.primary, display: "flex", alignItems: "center" }}>
                {icon}
              </HBox>
            )}
            <HBox sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1, minWidth: 0 }}>
              <HLabel
                sx={{ color: text.primary, fontWeight: 600, whiteSpace: "nowrap" }}
                value={titleKey}
                align="left"
                colon={false}
              />
              {showHeaderMeta && subTitleKey && (
                <HLabel
                  sx={{ color: text.secondary, fontSize: "11px", whiteSpace: "nowrap" }}
                  value={subTitleKey}
                  align="left"
                  colon={false}
                />
              )}
            </HBox>
          </HBox>
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

        ...(count !== undefined && count !== 0 && {
          "& .MuiAccordionSummary-content": {
            position: "relative",
            width: "100%",
          },

          "& .MuiAccordionSummary-content .MuiTypography-root::before": {
            content: `"${count} added"`,
            position: "absolute",
            right: "0",
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
      {headerStatusLabel && (
        <HBox
          sx={{
            position: "absolute",
            right: "64px",
            top: "10px",
            display: "flex",
            alignItems: "center",
            gap: 1,
            zIndex: 3,
            backgroundColor:"transparent"
          }}
        >
          <HLabel
            value={headerStatusLabel}
            align="left"
            colon={false}
            sx={{
              fontSize: "11px",
              color: text.secondary,
            }}
          />

          <HLabel
            value={
              headerStatus === "VERIFIED"
                ? "Verified"
                : headerStatus === "FAILED"
                  ? "Failed"
                  : "Pending"
            }
            align="center"
            colon={false}
            sx={{
              fontSize: "11px",
              fontWeight: 600,
              padding: "3px 10px",
              borderRadius: "12px",

              color:
                headerStatus === "VERIFIED"
                  ? "#2e7d32"
                  : headerStatus === "FAILED"
                    ? "#d32f2f"
                    : "#757575",

              backgroundColor:
                headerStatus === "VERIFIED"
                  ? "#e8f5e9"
                  : headerStatus === "FAILED"
                    ? "#ffebee"
                    : "#f5f5f5",

              border:
                headerStatus === "VERIFIED"
                  ? "1px solid #a5d6a7"
                  : headerStatus === "FAILED"
                    ? "1px solid #ef9a9a"
                    : "1px solid #d6d6d6",
            }}
          />
        </HBox>
      )}

      <HAccordion
        id={`qde-section-${sectionKey}`}
        title={titleKey}
        childKeyProp={sectionKey}
        isExpandedChildrenProp={{ [sectionKey]: isExpanded }}
        onChangeEvent={() => {
          const nextExpanded = !isExpanded;
          if (onExpandedChange) {
            onExpandedChange(nextExpanded);
          } else {
            setExpanded((prev) => ({
              ...prev,
              [sectionKey]: nextExpanded,
            }));
          }
        }}
      >
        <Grid container spacing={1.4} alignItems="flex-start">
          {children}
        </Grid>
      </HAccordion>
    </HBox>
  );
};

export default SectionBlock;
