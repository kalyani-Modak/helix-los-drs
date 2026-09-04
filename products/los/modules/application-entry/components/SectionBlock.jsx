import { useState } from "react";
import { Grid } from "@mui/material";
import { HAccordion,HBox, useDrsTheme } from "@helix/component-library";

const SectionBlock = ({ sectionKey, titleKey, defaultExpanded = true, children }) => {
  const [expanded, setExpanded] = useState({ [sectionKey]: defaultExpanded });
  const { text } = useDrsTheme();

  return (
    <HBox
      sx={{mb:2,
        "& .MuiAccordionSummary-content .MuiTypography-root": {
          background: "none !important",
          WebkitBackgroundClip: "unset !important",
          WebkitTextFillColor: text.primary,
          backgroundClip: "unset !important",
          color: text.primary,
        },
      }}
    >
    <HAccordion
      id={`qde-section-${sectionKey}`}
      title={titleKey}
      childKeyProp={sectionKey}
      isExpandedChildrenProp={expanded}
      onChangeEvent={() => setExpanded((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }))}
    >
      <Grid container spacing={1.4} alignItems="flex-start">
        {children}
      </Grid>
    </HAccordion>
    </HBox>
  );
};

export default SectionBlock;
