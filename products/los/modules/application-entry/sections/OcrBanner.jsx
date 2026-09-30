import React, { useRef } from "react";
import { Box } from "@mui/material";
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import { HButton, HLabel, useDrsTheme } from "@helix/component-library";
import { OCR_ACCEPT, OCR_MAX_SIZE_BYTES, UPLOAD_STATUS } from "../constants/ddeOptions";

const STATUS_TEXT = {
  [UPLOAD_STATUS.IDLE]: "Upload a scanned application form to auto-populate fields below.",
  [UPLOAD_STATUS.UPLOADING]: "Uploading...",
  [UPLOAD_STATUS.PROCESSING]: "Extracting data...",
  [UPLOAD_STATUS.SUCCESS]: "Extraction completed. Review the highlighted fields below.",
  [UPLOAD_STATUS.FAILED]: "Extraction failed. You can retry or continue manually.",
};

/**
 * OCR / Application Form banner. Deliberately uses a native file input the
 * same way `../../sections/OcrUploadSection.jsx` does — the library upload
 * widget is reserved for the drag-and-drop Perfios section — kept behind two
 * clean integration points: `onUpload(file)` and `onExtract()`.
 */
const OcrBanner = ({ uploadState, onUpload, onExtract, busy }) => {
  const { colors } = useDrsTheme?.() || {};
  const inputRef = useRef(null);
  const { status, fileName, error } = uploadState;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > OCR_MAX_SIZE_BYTES) {
      onUpload(null, "File exceeds the maximum allowed size of 10 MB");
      return;
    }
    onUpload(file);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        flexWrap: "wrap",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1.5,
        p: 2,
        mb: 2,
        backgroundColor: colors?.infoSurface || "rgba(99, 91, 255, 0.04)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <DocumentScannerOutlinedIcon color="primary" />
        <Box>
          <HLabel value="OCR — Application Form" translate={false} align="left" colon={false} sx={{ fontWeight: 600 }} />
          <HLabel
            value="Upload a scanned/printed application form (image or PDF) and extract applicant data automatically."
            translate={false}
            align="left"
            colon={false}
            sx={{ color: "text.secondary", fontSize: 13 }}
          />
          <HLabel
            value={error || STATUS_TEXT[status]}
            translate={false}
            align="left"
            colon={false}
            sx={{ fontSize: 12, mt: 0.5, color: error || status === UPLOAD_STATUS.FAILED ? "error.main" : "text.secondary" }}
          />
          {fileName ? (
            <HLabel value={fileName} translate={false} align="left" colon={false} sx={{ fontSize: 12, fontStyle: "italic" }} />
          ) : null}
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <input ref={inputRef} type="file" accept={OCR_ACCEPT} style={{ display: "none" }} onChange={handleFileChange} />
        <HButton
          label="Upload & Extract"
          translate={false}
          variant="contained"
          inline
          loading={busy}
          onClick={() => {
            if (fileName && status !== UPLOAD_STATUS.FAILED) {
              onExtract();
            } else {
              inputRef.current?.click();
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default OcrBanner;