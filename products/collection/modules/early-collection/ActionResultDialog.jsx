import React, { useMemo, useRef, useEffect, useCallback } from "react";
import { useIntl } from "react-intl";
import { Typography, Box, IconButton, Tooltip,} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

import { HAgGrid, HDialog } from "@helix/component-library";
const ActionResultDialog = ({
  open,
  parentType,
  parentData,
  mappingList = [],
  onClose,
  onSave,
}) => {
  const theme = useTheme();
  const gridRef = useRef(null);
  const intl = useIntl();
  const selectionAppliedRef = useRef(false);

  useEffect(() => {
    if (!open || !mappingList.length) {
      selectionAppliedRef.current = false;
      return;
    }

    const applySelection = () => {
      const api = gridRef.current?.api;
      if (!api) return false;

      const rowsCount = api.getDisplayedRowCount();
      if (rowsCount === 0 && mappingList.length > 0) {
        return false;
      }

      api.deselectAll();

      const nodesToSelect = [];
      api.forEachNode((node) => {
        if (node.data.chSelected === "Y") {
          nodesToSelect.push(node);
        }
      });

      if (nodesToSelect.length) {
        api.setNodesSelected({ nodes: nodesToSelect, newValue: true });
      }

      selectionAppliedRef.current = true;
      return true;
    };

    if (selectionAppliedRef.current) return;

    if (applySelection()) return;

    const delays = [50, 100, 200];
    let attempts = 0;
    let timeoutId;

    const tryAgain = () => {
      if (applySelection()) return;
      attempts++;
      if (attempts < delays.length) {
        timeoutId = setTimeout(tryAgain, delays[attempts]);
      }
    };

    timeoutId = setTimeout(tryAgain, delays[0]);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [open, mappingList]);

  const columnDefs = useMemo(() => {
    if (parentType === "ACTION") {
      return [
        {
          headerName: intl.formatMessage({
            id: "label.ActionResultDialog.ResultCode",
            defaultMessage: "Result Code",
          }),
          field: "szResultCode",
          width: 150,
          filter: false,
        },
        {
          headerName: intl.formatMessage({
            id: "label.ActionResultDialog.ResultName",
            defaultMessage: "Result Name",
          }),
          field: "szResultName",
          flex: 1,
          filter: false,
        },
      ];
    }

    return [
      {
        headerName: intl.formatMessage({
          id: "label.ActionResultDialog.ActionCode",
          defaultMessage: "Action Code",
        }),
        field: "szActionCode",
        width: 150,
        filter: false,
      },
      {
        headerName: intl.formatMessage({
          id: "label.ActionResultDialog.ActionDescription",
          defaultMessage: "Action Description",
        }),
        field: "szActionDesc",
        flex: 1,
        filter: false,
      },
    ];
  }, [parentType, intl.locale]);

  const handleSave = () => {
    const selectedRows = gridRef.current?.api.getSelectedRows() || [];
    const selectedCodes = selectedRows.map((row) =>
      parentType === "ACTION" ? row.szResultCode : row.szActionCode,
    );

    if (parentType === "ACTION") {
      onSave({
        szActionCode: parentData.szActionCode,
        selectedResults: selectedCodes,
      });
    } else {
      onSave({
        szResultCode: parentData.szResultCode,
        selectedActions: selectedCodes,
      });
    }
  };

  if (!parentData) return null;

  const dialogTitle =
    parentType === "ACTION"
            ? intl.formatMessage({
                id: "label.ActionResultDialog.PossibleResults",
              })
            : intl.formatMessage({
                id: "label.ActionResultDialog.AvailableActions",
        });

  return (
    <HDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      header={
        <div className="title-bar-container" sx={{ py: 1 }}>
          <span className="title-bar-text">{dialogTitle}</span>
        </div>
      }
      contentProps={{ dividers: true }}
      actions={
        <Box sx={{ mr: "20px", display: "flex", alignItems: "center" }}>
          <Tooltip title="Cancel">
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Save">
            <IconButton onClick={handleSave}>
              <SaveIcon />
            </IconButton>
          </Tooltip>
        </Box>
      }
    >
        <Box
          className="title-bar-container"
          sx={{display: "flex", alignItems: "center", gap: 4, mb: 1, px: 1.5, py: 0.75,borderRadius: "4px",}}
        >
          <Typography
            variant="subtitle2"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <Box
              component="span"
              className="title-bar-text"
              sx={{ fontWeight: 600 }} // Keep fontWeight if you want to ensure it's bold; CSS already has bold
            >
              {parentType === "ACTION"
                ? intl.formatMessage({
                    id: "label.ActionResultDialog.ActionCode",
                  })
                : intl.formatMessage({
                    id: "label.ActionResultDialog.ResultCode",
                  })}
              :
            </Box>
            <Box component="span" sx={{ color: theme.palette.text.secondary }}>
              {parentType === "ACTION"
                ? parentData.szActionCode
                : parentData.szResultCode}
            </Box>
          </Typography>

          <Typography
            variant="subtitle2"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <Box
              component="span"
              className="title-bar-text"
              sx={{ fontWeight: 600 }}
            >
              {intl.formatMessage({
                id: "label.ActionResultDialog.Description",
              })}
              :
            </Box>
            <Box component="span" sx={{ color: theme.palette.text.secondary }}>
              {parentType === "ACTION"
                ? parentData.szActionDesc
                : parentData.szResultName}
            </Box>
          </Typography>
        </Box>

        <HAgGrid
          ref={gridRef}
          rowData={mappingList}
          columnDefs={columnDefs}
          addCheckBoxes={true}
          pagination={true}
          paginationPageSize={5}
          sort={true}
          allowAdd={false}
          allowDelete={false}
          allowUpdate={false}
          hideInternalSaveButton={true}
          gridStyle={{ width: "100%", height: "250px" }}
        />
    </HDialog>
  );
};

export default ActionResultDialog;
