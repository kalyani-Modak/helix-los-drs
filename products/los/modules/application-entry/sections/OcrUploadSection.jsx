import { HBox, HDropdown, HLabel } from "@helix/component-library";
import SectionBlock from "../components/SectionBlock";
import CropFreeOutlinedIcon from "@mui/icons-material/CropFreeOutlined";

const OcrUploadSection = ({ form, setField, onFileSelect, ocrFileName, ocrStatusKey, docTypeOptions = [] }) => (
  <SectionBlock sectionKey="ocrUpload" titleKey="label.qde.section.ocr" subTitleKey="label.qde.section.ocr.subtitle" icon={<CropFreeOutlinedIcon fontSize="small" />}>
    <HBox sx={{ width: "100%", display: "flex", flexDirection: "row", flexWrap: "nowrap" }}>
      <HBox sx={{ width: "30%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
        <HLabel value="label.qde.field.docType" align="left" colon={false} sx={{color: "text.primary" }} />
        <HDropdown
          name="ocrDocType"
          options={docTypeOptions}
          value={form.ocrDocType || "APPFORM" }
          onChange={(e) => setField("ocrDocType", e.target.value)}
          width="80%"
        />
      </HBox>

      <HBox sx={{ width: "40%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
        <HLabel value="label.qde.field.uploadFile" align="left" colon={false} sx={{color: "text.primary" }} />
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
          sx={{ fontSize: "10px"}}
        />
      </HBox>

      <HBox sx={{ width: "30%", flexShrink: 0, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
        <HLabel value="label.qde.field.ocrStatus" align="left" colon={false} sx={{color: "text.primary" }} />
        <HLabel
          value={ocrStatusKey || "label.qde.status.noFile"}
          align="left"
          colon={false}
        />
      </HBox>
    </HBox>
  </SectionBlock>
);

export default OcrUploadSection;
