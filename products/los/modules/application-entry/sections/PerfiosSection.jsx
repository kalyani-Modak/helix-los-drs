import { useRef, useState } from "react";
import { Grid } from "@mui/material";
import {
  HBox,
  HButton,
  HLabel,
  HTextField,
  useDrsTheme,
} from "@helix/component-library";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ".pdf,.xls,.xlsx";

const PerfiosSection = ({ form, setField, expanded }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const { colors, text, border, action } = useDrsTheme();
  const isExpanded = expanded !== false;

  const handleFile = (file) => {
    if (!file) return;

    if (!/\.(pdf|xls|xlsx)$/i.test(file.name)) {
      setFileError("label.dde.perfios.invalidFileType");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError("label.dde.perfios.fileTooLarge");
      return;
    }

    setFileError("");
    setField("perfiosFileName", file.name);
    setField("perfiosUploaded", true);
  };

  const handleInputChange = (event) => {
    handleFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  return (
    <HBox
      sx={{
        width: "100%",
        mb: 2,
        border: `1px solid ${border.control}`,
        borderRadius: 2,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <HBox
        sx={{
          minHeight: 36,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: 2,
          py: 1,
          backgroundColor: action.hover,
          boxSizing: "border-box",
        }}
      >
        <HBox sx={{ display: "flex", flexDirection: "column",backgroundColor: "transparent" }}>
          <HLabel
            value="label.dde.section.perfios"
            align="left"
            colon={false}
            sx={{ color: text.primary, fontWeight: 600,fontSize: 15 }}
          />
        </HBox>
        <HLabel
          value="label.dde.perfios.fileTypes"
          align="right"
          colon={false}
          sx={{ color: text.secondary, fontSize: 11, whiteSpace: "nowrap" }}
        />
      </HBox>
      {isExpanded ? (
        <HBox sx={{ p: 2, boxSizing: "border-box" }}>
          <Grid container spacing={1.4}>
            <Grid size={12}>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_FILE_TYPES}
                onChange={handleInputChange}
                hidden
              />
              <HBox
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                sx={{
                  minHeight: 126,
                  width: "100%",
                  border: `1px dashed ${isDragging ? colors.primary : border.control}`,
                  borderRadius: 2,
                  backgroundColor: action.hover,
                  color: text.primary,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  boxSizing: "border-box",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <FileUploadOutlinedIcon sx={{ color: colors.primary }} />
                <HLabel
                  value="label.dde.perfios.dropPrompt"
                  align="center"
                  colon={false}
                  sx={{ color: colors.primary }}
                />
                <HLabel
                  value="label.dde.perfios.acceptedFiles"
                  align="center"
                  colon={false}
                  sx={{ color: text.secondary, fontSize: 12 }}
                />
              </HBox>
              {fileError ? (
                <HLabel
                  value={fileError}
                  align="left"
                  colon={false}
                  sx={{ color: "error.main", mt: 0.75 }}
                />
              ) : null}
            </Grid>
            {form.perfiosFileName ? (
              <>
                <Grid size={8}>
                  <HLabel value="label.dde.field.perfiosFileName" align="left" colon={false} />
                  <HTextField
                    value={form.perfiosFileName}
                    editable={false}
                    width="100%"
                  />
                </Grid>
                <Grid size={4} sx={{ display: "flex", alignItems: "flex-end" }}>
                  <HButton
                    label="label.dde.perfios.analyse"
                    variant="outlined"
                    size="small"
                    inline
                    onClick={() => setField("perfiosUploaded", true)}
                  />
                </Grid>
              </>
            ) : null}
          </Grid>
        </HBox>
      ) : null}
    </HBox>
  );
};

export default PerfiosSection;
