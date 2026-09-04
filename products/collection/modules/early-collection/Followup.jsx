import React, { useState } from "react";
import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import FunctionLayout from "./FunctionLayout";
import FollowupDetails from "./followup/FollowupDetails";
import FollowupHistory from "./FollowupHistory";
import PtpHistoryGrid from "./followup/PtpHistoryGrid";

import { HBox, HPaper } from "@helix/component-library";
const Followup = () => {
  const intl = useIntl();
  const [reloadFlag, setReloadFlag] = useState(false);

  return (
    <FunctionLayout
      title={intl.formatMessage({ id: "label.followup.title" })}
      breadcrumbMid={intl.formatMessage({
        id: "label.functionLayout.breadcrumb.collection",
        defaultMessage: "Collection",
      })}
      contentPaddingTop={0}
    >
      <HBox
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 1.5, sm: 2 },
          pt: 1,
          width: "100%",
          boxSizing: "border-box",
          background: "var(--drs-bg-page)",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          position: "relative",
        }}
      >
        {/* Disposition strip + Record Follow Up card (all in FollowupDetails) */}
        <FollowupDetails onSaved={() => setReloadFlag((v) => !v)} />

        {/* PTP History + Follow Up History */}
        <Grid container spacing={2} alignItems="stretch">
          <Grid size={{ xs: 12, md: 6 }}>
            <PtpHistoryGrid reloadFlag={reloadFlag} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FollowupHistory reloadFlag={reloadFlag} />
          </Grid>
        </Grid>
      </HBox>
    </FunctionLayout>
  );
};

export default Followup;
