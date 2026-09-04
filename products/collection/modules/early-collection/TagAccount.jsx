import React from "react";
import { Box } from "@mui/material";
import { useIntl } from "react-intl";
import FunctionLayout from "./FunctionLayout.jsx";
import TagAccountDetails from "./tag-account/TagAccountDetails.jsx";

const TagAccount = () => {
  const intl = useIntl();

  return (
    <FunctionLayout
      breadcrumbMid={intl.formatMessage({
        id: "label.functionLayout.breadcrumb.collection",
        defaultMessage: "Collection",
      })}
      title={intl.formatMessage({
        id: "label.tagaccount.header",
        defaultMessage: "Tag Account",
      })}
    >
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <TagAccountDetails />
      </Box>
    </FunctionLayout>
  );
};

export default TagAccount;
