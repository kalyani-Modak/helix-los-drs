import React from "react";
import { Box, Grid } from "@mui/material";
import { HDropdown, HLabel } from "@helix/component-library";
import FieldRow from "../components/FieldRow";
import SectionBlock from "../components/SectionBlock";
import { OCR_DOC_TYPES } from "../constants/qdeOptions";

/**
 * Document upload feeding the OCR extraction service. The native file input is
 * used deliberately — the library file picker is not part of the approved set
 * for this screen.
 */
const OcrUploadSection = ({ form, setField, onFileSelect, ocrFileName, ocrStatusKey }) => (
  <SectionBlock sectionKey="ocrUpload" titleKey="label.qde.section.ocr">
    <FieldRow labelKey="label.qde.field.docType">
      <HDropdown
        name="ocrDocType"
        options={OCR_DOC_TYPES}
        value={form.ocrDocType}
        onChange={(e) => setField("ocrDocType", e.target.value)}
        width="100%"
      />
    </FieldRow>

    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
        <HLabel value="label.qde.field.uploadFile" align="left" colon={false} />
        <input
          id="qde-ocr-file"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.tiff"
          onChange={(e) => onFileSelect?.(e.target.files?.[0] || null)}
        />
        <HLabel
          value={ocrFileName || "label.qde.ocr.noFile"}
          translate={!ocrFileName}
          align="left"
          colon={false}
        />
      </Box>
    </Grid>

    <FieldRow labelKey="label.qde.field.ocrStatus">
      <HLabel value={ocrStatusKey || "label.qde.status.notStarted"} align="left" colon={false} />
    </FieldRow>
  </SectionBlock>
);

export default OcrUploadSection;
