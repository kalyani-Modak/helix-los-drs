import React from "react";
import { Box } from "@mui/material";
import { useIntl } from "react-intl";
import FunctionLayout from "./FunctionLayout.jsx";
import AddThirdPartyDetails from "./add-third-party/AddThirdPartyDetails.jsx";
const AddThirdParty = () => {
  const intl = useIntl();

  return (
    <FunctionLayout
      title={intl.formatMessage({
        id: "label.Add Third Party",
        defaultMessage: "Add Third Party",
      })}
    >
      <Box
        className="drs-page-container"
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <AddThirdPartyDetails />
      </Box>
    </FunctionLayout>
  );
};

export default AddThirdParty;
