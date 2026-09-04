import React, { useRef } from "react";
import {
  Box,
  DialogContent,
  DialogActions,
  Typography,
  useTheme,
} from "@mui/material";
import { useIntl } from "react-intl";
import { TitleBar, HButton, HDialog } from "@helix/component-library";

import BatchProcessGridPanel from "./BatchProcessGridPanel";

const BatchProcessDialog = ({ open, onClose, row }) => {
  const intl = useIntl();
  const theme = useTheme();
  const panelRef = useRef(null);

  const paperRadius = theme.shape.borderRadius;
  const topRadius =
    typeof paperRadius === "number" ? `${paperRadius}px` : paperRadius ?? "4px";

  const batchCodeTrim =
    row?.batchCode != null && String(row.batchCode).trim() !== ""
      ? String(row.batchCode).trim()
      : "";

  return (
    <HDialog disableContentWrapper open={open} onClose={onClose} maxWidth="xl" fullWidth aria-labelledby="batch-process-dialog-title" slotProps={{ paper: {
        sx: {
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          overflow: "hidden",
          p: 0,
          width: { xs: "98vw", sm: "min(98vw, 1200px)" },
          maxWidth: "1200px !important",
          maxHeight: "101vh",
          display: "flex",
          flexDirection: "column",
        },
      } }}>
      <Box
        id="batch-process-dialog-title"
        sx={{
          width: "100%",
          flexShrink: 0,
          "& .title-bar-container": {
            marginTop: 0,
            marginBottom: 0,
            borderTopLeftRadius: topRadius,
            borderTopRightRadius: topRadius,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
      >
        <TitleBar title="label.batchmaster.batchProcessDialog" width="100%" />
      </Box>
      <Box
        role="status"
        aria-live="polite"
        sx={{
          px: 3,
          py: 1.25,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor:
            theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : theme.palette.grey[50],
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "nowrap",
            gap: 2,
            width: "100%",
            minWidth: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flexWrap: "nowrap", gap: 0.75, flexShrink: 0 }}>
            <Typography
              component="span"
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: theme.palette.text.secondary,
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              {intl.formatMessage({
                id: "label.batchmaster.code",
                defaultMessage: "Batch code",
              })}
              :
            </Typography>
            <Typography
              component="span"
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: theme.palette.text.primary,
                fontFamily: "ui-monospace, 'Cascadia Code', monospace",
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
              }}
            >
              {batchCodeTrim ||
                intl.formatMessage({
                  id: "batchmaster.schedule.batchCodeEmpty",
                  defaultMessage: "Not set",
                })}
            </Typography>
          </Box>
          <Typography
            component="span"
            sx={{
              color: theme.palette.divider,
              flexShrink: 0,
              userSelect: "none",
            }}
            aria-hidden
          >
            |
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "nowrap",
              gap: 0.75,
              minWidth: 0,
              flex: "1 1 auto",
              overflow: "hidden",
            }}
          >
            <Typography
              component="span"
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: theme.palette.text.secondary,
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {intl.formatMessage({
                id: "label.batchmaster.desc",
                defaultMessage: "Description",
              })}
              :
            </Typography>
            <Typography
              component="span"
              title={
                row?.batchDesc != null && String(row.batchDesc).trim() !== ""
                  ? String(row.batchDesc).trim()
                  : undefined
              }
              sx={{
                fontSize: 13,
                fontWeight: 500,
                color: theme.palette.text.primary,
                fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: 1.4,
              }}
            >
              {row?.batchDesc != null && String(row.batchDesc).trim() !== ""
                ? String(row.batchDesc).trim()
                : intl.formatMessage({
                    id: "batchmaster.schedule.batchCodeEmpty",
                    defaultMessage: "Not set",
                  })}
            </Typography>
          </Box>
        </Box>
      </Box>
      <DialogContent
        sx={{
          px: 3,
          pt: 1,
          pb: 2,
          flex: "1 1 auto",
          overflow: "auto",
          minHeight: 0,
        }}
      >
        {open && row ? (
          <BatchProcessGridPanel
            ref={panelRef}
            key={`bp-${String(row.gridRowId ?? "")}-${batchCodeTrim || "new"}`}
            batchCode={batchCodeTrim}
            gridMinHeight="min(52vh, 520px)"
            hideInternalSaveButton
          />
        ) : null}
      </DialogContent>
      <DialogActions
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          px: 2,
          py: 1.5,
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, width: "100%" }}>
          <Box sx={{ width: "auto" }}>
            <HButton
              label="common.save"
              variant="contained"
              onClick={() => panelRef.current?.submitChanges?.()}
            />
          </Box>
          <Box sx={{ width: "auto" }}>
            <HButton label="common.close" variant="contained" onClick={onClose} />
          </Box>
        </Box>
      </DialogActions>
    </HDialog>
  );
};

export default BatchProcessDialog;
