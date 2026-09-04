import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { useIntl } from "react-intl";
import { HBox, HButton, HLabel, HPaper } from "@helix/component-library";

/** Single-column tab body: children cannot grow wider than the content pane. */
export function DmsTabColumn({ children }) {
  return (
    <HBox
      sx={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr)",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        gap: 3,
        boxSizing: "border-box",
        overflow: "hidden",
        background: "transparent",
      }}
    >
      {children}
    </HBox>
  );
}

/** Horizontal clip for AG Grid / wide content; height stays auto. */
export function DmsGridFrame({ children }) {
  return (
    <HBox
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        overflowX: "auto",
        overflowY: "hidden",
        contain: "inline-size",
        background: "transparent",
                }}
              >
      {children}
    </HBox>
  );
}

export function DmsPanel({ title, description, children }) {
  return (
    <HPaper elevation={0} sx={{ width: "100%", maxWidth: "100%", minWidth: 0, overflow: "hidden", boxSizing: "border-box" }}>
      <HBox sx={{ flexDirection: "column", background: "transparent", minWidth: 0, maxWidth: "100%" }}>
        <HLabel
          value={title}
          translate={false}
          colon={false}
          align="left"
          sx={{ fontWeight: 800, fontSize: { xs: "1.1rem", sm: "1.22rem" } }}
        />
        {description ? (
          <HLabel
            value={description}
            translate={false}
            colon={false}
            align="left"
            sx={{ lineHeight: 1.75, fontSize: "0.875rem", wordBreak: "break-word" }}
          />
        ) : null}
      </HBox>
      <HBox sx={{ py: 2, background: "transparent", minWidth: 0, maxWidth: "100%", overflow: "hidden", boxSizing: "border-box" }}>{children}</HBox>
    </HPaper>
  );
}

export function DmsSubSectionHeading({ title }) {
  return (
      <HLabel
        value={title}
        align="left"
        colon={false}
      sx={{ fontWeight: 800 }}
      />
  );
}

export function DmsFormSection({ title, description, children }) {
  return (
    <HBox
      sx={{
        width: "100%",
        p: 2,
        borderRadius: 1,
        border: "1px solid var(--drs-border-divider)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        overflow: "hidden",
        bgcolor: "var(--drs-bg-paper)",
      }}
    >
      <HLabel
        value={title}
        translate={false}
        colon={false}
        align="left"
        sx={{
          display: "block",
          width: "100%",
          fontWeight: 800,
          fontSize: { xs: "0.85rem", sm: "0.95rem" },
          lineHeight: 1.35,
        }}
      />
      {description ? (
        <HLabel
          value={description}
          translate={false}
          colon={false}
          align="left"
          sx={{
            display: "block", 
            width: "100%",
            fontSize: 13,
            lineHeight: 1.5,
            mt: -0.5,
          }}
        />
      ) : null}
      <HBox sx={{ width: "100%", flexDirection: "column", gap: 1.5, background: "transparent" }}>
      {children}
    </HBox>
    </HBox>
  );
}

export function DmsFileDropZone({
  file,
  onFileChange,
  idleLabel,
  disabled,
}) {
  const intl = useIntl();
  const [dragOver, setDragOver] = React.useState(false);

  const defaultIdleLabel = idleLabel || intl.formatMessage({ id: "utility.dms.dropZone.idle", defaultMessage: "Choose or drop a file" });
  const handleFiles = (files) => onFileChange(files?.[0] ?? null);

  return (
    <HBox
      component="label"
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { sm: "center" },
        gap: 2,
        px: 2.5,
        py: 2.5,
        borderRadius: 1,
        cursor: disabled ? "not-allowed" : "pointer",
        border: "1px dashed var(--drs-border-divider)",
        outline: dragOver ? "1px solid var(--drs-color-primary)" : "none",
        opacity: disabled ? 0.55 : 1,
        flex: 1,
        minWidth: { xs: "100%", sm: 280 },
        maxWidth: "100%",
        bgcolor: "transparent",
      }}
    >
      <HBox
        sx={{
          width: 56,
          height: 56,
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {file ? <InsertDriveFileOutlinedIcon sx={{ fontSize: 28 }} /> : <CloudUploadOutlinedIcon sx={{ fontSize: 28 }} />}
      </HBox>
      <HBox sx={{ flex: 1, minWidth: 0, textAlign: { xs: "center", sm: "left" }, flexDirection: "column" }}>
        <HLabel
          value={file ? file.name : defaultIdleLabel}
          align="left"
          colon={false}
          sx={{ fontWeight: 800 }}
        />
        <HLabel
          value={file
            ? intl.formatMessage({ id: "utility.dms.dropZone.replaceHint", defaultMessage: "{size} KB · Click or drop to replace" }, { size: (file.size / 1024).toFixed(file.size < 10240 ? 1 : 0) })
            : intl.formatMessage({ id: "utility.dms.dropZone.supportedHint", defaultMessage: "PDF, images, Office docs — drag & drop supported" })}
          align="left"
          colon={false}
          sx={{ display: "block", mt: 0.35 }}
        />
      </HBox>
      {file && !disabled ? (
        <HButton
          variant="outlined"
            size="small"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFileChange(null);
            }}
          label="utility.dms.dropZone.clearTooltip"
        />
      ) : null}
      <input type="file" hidden disabled={disabled} onChange={(e) => handleFiles(e.target.files)} />
    </HBox>
  );
}

export function DmsEmptyState({ icon, title, description }) {
  return (
    <HBox
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        py: 6,
        px: 3,
        textAlign: "center",
        background: "transparent",
      }}
    >
      <HBox
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "& .MuiSvgIcon-root": { fontSize: 34 },
        }}
      >
        {icon}
      </HBox>
      <HBox sx={{ flexDirection: "column", alignItems: "center" }}>
        <HLabel
          value={title}
          align="center"
          colon={false}
          sx={{ fontWeight: 800, mb: 0.75 }}
        />
        <HLabel
          value={description}
          align="center"
          colon={false}
          sx={{ maxWidth: 400, lineHeight: 1.75, mx: "auto" }}
        />
      </HBox>
    </HBox>
  );
}

export function DmsProcessingStatusChip({ status }) {
  return (
    <HLabel
      value={status}
      translate={false}
      colon={false}
      align="left"
      sx={{ fontSize: 11, fontWeight: 700, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
    />
  );
}

export function DmsCollapsibleSection({
  expanded,
  onToggle,
  title,
  caption,
  chipLabel,
  headerId,
  panelId,
  headerActions,
  children,
}) {
  return (
    <HPaper variant="outlined" sx={{ width: "100%", maxWidth: "100%", minWidth: 0, overflow: "hidden", boxSizing: "border-box" }}>
      <HBox
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { sm: "center" },
          gap: 1,
          px: 2,
          py: 1.35,
          borderBottom: expanded ? "1px solid var(--drs-border-divider)" : "none",
          background: "transparent",
        }}
      >
        <HBox
          role="button"
          tabIndex={0}
          aria-expanded={expanded}
          aria-controls={panelId}
          id={headerId}
          onClick={onToggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggle();
            }
          }}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
            flex: 1,
            minWidth: 0,
            cursor: "pointer",
            userSelect: "none",
            py: 0.25,
          }}
        >
          <HBox
            sx={{
              mt: 0.2,
              width: 28,
              height: 28,
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ExpandMoreIcon
              fontSize="small"
              sx={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
              aria-hidden
            />
          </HBox>
          <HBox sx={{ flex: 1, minWidth: 0, flexDirection: "column", background: "transparent" }}>
            <HBox sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1, flexWrap: "wrap", background: "transparent" }}>
              <HLabel
                value={title}
                align="left"
                colon={false}
                sx={{ fontWeight: 800 }}
              />
              {chipLabel ? (
                <HLabel
                  value={chipLabel}
                  translate={false}
                  colon={false}
                  align="left"
                  sx={{ fontSize: 11 }}
                />
              ) : null}
            </HBox>
            <HLabel
              value={caption}
              align="left"
              colon={false}
              sx={{ display: "block", mt: 0.35 }}
            />
          </HBox>
        </HBox>
        {headerActions ? (
          <HBox onClick={(e) => e.stopPropagation()} sx={{ flexShrink: 0, alignSelf: { xs: "flex-start", sm: "center" }, background: "transparent" }}>
            {headerActions}
          </HBox>
        ) : null}
      </HBox>
      {expanded ? (
        <HBox
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          sx={{ width: "100%", maxWidth: "100%", minWidth: 0, overflowX: "auto", boxSizing: "border-box", background: "transparent" }}
        >
        {children}
        </HBox>
      ) : null}
    </HPaper>
  );
}

export function DmsNotice({ children }) {
  return (
    <HPaper variant="outlined" sx={{ p: 2, mt: 2, width: "100%", maxWidth: "100%", minWidth: 0, overflow: "auto", boxSizing: "border-box" }}>
      <pre style={{ fontFamily: "inherit", fontSize: 11, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {children}
      </pre>
    </HPaper>
  );
}

export function DmsJsonBody({ children }) {
  return (
    <HBox sx={{ p: 2, pt: 1.5, width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box", overflow: "hidden", contain: "inline-size" }}>
      <HPaper
        variant="outlined"
        sx={{ p: 2, maxHeight: 280, overflow: "auto", width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" }}
    >
        <pre
          style={{
            margin: 0,
            fontFamily: "inherit",
            fontSize: 12,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
            maxWidth: "100%",
        }}
        >
          {children}
        </pre>
      </HPaper>
    </HBox>
  );
}

export function DmsViewerFrame({ children, fileName, hasContent }) {
  const intl = useIntl();
  const fallbackName = intl.formatMessage({ id: "utility.dms.viewer.preview", defaultMessage: "Preview" });

  return (
    <HPaper variant="outlined" sx={{ width: "100%", minHeight: 420, overflow: "hidden" }}>
      {hasContent ? (
        <HBox
          sx={{
            px: 2,
            py: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <HLabel
            value={fileName || fallbackName}
            align="left"
            colon={false}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          />
        </HBox>
      ) : null}
      {children}
    </HPaper>
  );
}

export function DmsTabPanel({ active, children }) {
  if (!active) return null;
  return (
    <HBox sx={{ width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box", overflow: "hidden" }}>
      {children}
    </HBox>
  );
}
