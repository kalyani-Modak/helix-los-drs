import React, { useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useToast, TitleBar, HBox, HButtonBar, HPaper, HButton, SearchCommonBox, HBreadCrumb } from "@helix/component-library";
import { useNavigate } from "react-router-dom";
import { SEARCH_API_ENDPOINTS } from "@shared/config/apiConstants.jsx";

import { gridBatchCodeDefObj } from "../../../common/components/SearchGridDefObj";
import { Box } from "@mui/material";
import BatchProcessGridPanel from "./BatchProcessGridPanel";

const BatchProcessMaster = () => {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [batchCode, setBatchCode] = useState("");
  const [loadedCode, setLoadedCode] = useState("");

  const loadBatchProcesses = (selectedCode = batchCode) => {
    const code = String(selectedCode ?? "").trim();
    if (!code) {
      toast.warning(
        intl.formatMessage({
          id: "batchframework.toast.enterBatchCode",
          defaultMessage: "Enter a batch code",
        })
      );
      return;
    }
    setBatchCode(code);
    setLoadedCode(code);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <HBreadCrumb />
      <TitleBar
        title={intl.formatMessage({
          id: "label.BatchProcessMaster.title",
          defaultMessage: "Batch processes",
        })}
      />
      <HBox sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <HPaper sx={{ p: 2, width: "100%" }}>
          <HBox sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 1 }}>
            <SearchCommonBox
              apiEndpoint={SEARCH_API_ENDPOINTS.BATCH_FRAMEWORK()}
              searchCode="BATCHCODE"
              setSelectedValue={(value) => {
                const selectedCode = value || "";
                setBatchCode(selectedCode);
                if (selectedCode) {
                  loadBatchProcesses(selectedCode);
                }
              }}
              selectedValue={batchCode}
              selectedColumn="szBatchCode"
              gridDefObj={gridBatchCodeDefObj}
              gridWidth={300}
              gridHeight={300}
              gridNoOfRowsPerPage={5}
              searchBoxWidth="280px"
              searchBoxHeight={30}
              searchBoxFontSize={12}
              placeholder={intl.formatMessage({
                id: "label.batchprocess.batchCode",
                defaultMessage: "Batch code",
              })}
              translate={false}
            />

          </HBox>
          <BatchProcessGridPanel ref={panelRef} batchCode={loadedCode} />
        </HPaper>
        <HButtonBar
          onSave={() => panelRef.current?.submitChanges?.()}
          onReset={() => panelRef.current?.reload?.()}
          onClose={() => navigate("/homelayout/welcomepage")}
          disableToast={{ save: true, reset: true, close: true }}
        />
      </HBox>
    </Box>
  );
};

export default BatchProcessMaster;
