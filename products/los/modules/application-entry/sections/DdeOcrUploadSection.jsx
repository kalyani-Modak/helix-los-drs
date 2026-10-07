import { useRef, useState } from "react";
import { HBox, HButton, HLabel } from "@helix/component-library";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import CropFreeOutlinedIcon from "@mui/icons-material/CropFreeOutlined";

const DdeOcrUploadSection = () => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    setFileName(event.target.files?.[0]?.name || "");
  };

  return (
    <HBox
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        width: "100%",
        p: 1.5,
        mb: 2,
        border: "1px solid #c7d2fe",
        borderRadius: 2,
        backgroundColor: "transparent",
        boxSizing: "border-box",
      }}
    >
      <HBox sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.5, minWidth: 0 }}>
        <HBox
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            flexShrink: 0,
            borderRadius: 1.5,
            backgroundColor: "#e0e7ff",
            color: "#4338ca",
          }}
        >
          <CropFreeOutlinedIcon fontSize="small" />
        </HBox>
        <HBox sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <HLabel
            value="label.dde.ocr.title"
            align="left"
            colon={false}
            sx={{ color: "#1e1b4b", fontWeight: 600 }}
          />
          <HLabel
            value="label.dde.ocr.description"
            align="left"
            colon={false}
            sx={{ color: "#4338ca", fontSize: 12 }}
          />
          {fileName ? (
            <HLabel
              value={fileName}
              translate={false}
              align="left"
              colon={false}
              sx={{ color: "#4338ca", fontSize: 12 }}
            />
          ) : null}
        </HBox>
      </HBox>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.tiff"
        onChange={handleFileChange}
        hidden
      />
      <HButton
        label="label.dde.ocr.uploadExtract"
        variant="contained"
        size="small"
        inline
        startIcon={<FileUploadOutlinedIcon fontSize="small" />}
        onClick={() => fileInputRef.current?.click()}
        sx={{ flexShrink: 0, backgroundColor: "#4f3cff" }}
      />
    </HBox>
  );
};

export default DdeOcrUploadSection;
