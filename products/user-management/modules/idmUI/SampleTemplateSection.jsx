import DownloadIcon from "@mui/icons-material/Download";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { HBox, HButton, HLabel, useDrsTheme, withAlpha } from "@helix/component-library";
import { useIntl } from "react-intl";

/**
 * Highlighted sample-template row shown above file upload controls.
 */
const SampleTemplateSection = ({
  fileName,
  onDownload,
  description = "Download the sample Excel template, fill in the required details, then upload the file below.",
  templateLabel,
}) => {
  const { text, colors } = useDrsTheme();
  const displayName = templateLabel || fileName;
  const intl = useIntl();

  return (
    <HBox
      sx={{
        display: "flex",
        alignItems: { xs: "stretch", sm: "center" },
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        p: 2,
        mb: 2.5,
        borderRadius: "10px",
        border: `1px dashed ${withAlpha(colors.primary, 0.35)}`,
        bgcolor: withAlpha(colors.primary, 0.04),
      }}
    >
      <HBox
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
          flex: 1,
          minWidth: 0,
          background: "transparent",
        }}
      >
        <HBox
          sx={{
            width: 36,
            height: 36,
            borderRadius: "8px",
            bgcolor: withAlpha(colors.primary, 0.1),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            mt: 0.25,
          }}
        >
          <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />
        </HBox>
        <HBox sx={{ minWidth: 0, flexDirection: "column", background: "transparent" }}>
          <HLabel
            value={intl.formatMessage({ id: "label.uploadUsers.sampleTemplate", defaultMessage: "Sample Template" })}
            colon={false}
            translate={false}
            align="left"
            sx={{ mb: 0.5, fontSize: "14px", fontWeight: 700, color: text.primary }}
          />
          <HLabel
            value={description}
            colon={false}
            translate={false}
            align="left"
            sx={{
              color: text.secondary,
              lineHeight: 1.5,
            }}
          />
          <HLabel
            value={displayName}
            colon={false}
            translate={false}
            align="left"
            sx={{
              fontSize: "12px",
              color: "text.disabled",
              mt: 0.75,
              fontStyle: "italic",
              wordBreak: "break-all",
            }}
          />
        </HBox>
      </HBox>

      <HButton
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={() => onDownload(fileName)}
        label="label.uploadUsers.downloadTemplate"
      />
    </HBox>
  );
};

export default SampleTemplateSection;
