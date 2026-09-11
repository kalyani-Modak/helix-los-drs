import { HBox, HDropdown, HLabel } from "@helix/component-library";
import SectionBlock from "../components/SectionBlock";
import { OCR_DOC_TYPES } from "../constants/qdeOptions";

const OcrUploadSection = ({ form, setField, onFileSelect, ocrFileName, ocrStatusKey }) => (
  <SectionBlock sectionKey="ocrUpload" titleKey="label.qde.section.ocr">
    <HBox sx={{ width: "100%", display: "flex", flexDirection: "row", flexWrap: "nowrap" }}>
      <HBox sx={{ width: "30%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
        <HLabel value="label.qde.field.docType" align="left" colon={false} />
        <HDropdown
          name="ocrDocType"
          options={OCR_DOC_TYPES}
          value={form.ocrDocType}
          onChange={(e) => setField("ocrDocType", e.target.value)}
          width="80%"
        />
      </HBox>

      <HBox sx={{ width: "40%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
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
      </HBox>

      <HBox sx={{ width: "30%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
        <HLabel value="label.qde.field.ocrStatus" align="left" colon={false} />
        <HLabel
          value={ocrStatusKey || "label.qde.status.notStarted"}
          align="left"
          colon={false}
        />
      </HBox>
    </HBox>
  </SectionBlock>
);

export default OcrUploadSection;
