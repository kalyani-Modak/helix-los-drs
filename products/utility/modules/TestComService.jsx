import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HAxiosService, HDialog } from '@helix/component-library'
import { Alert, Box, Grid, Divider, IconButton, Stack, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, Chip, InputAdornment, Table, TableHead, TableRow, TableCell,
  TableBody } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useIntl } from "react-intl";
import { utilityAPI } from "./apiEndpoints";
import { idmLayoutColors, idmFontFamily } from "./userScreenTokens";
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from '@mui/icons-material/Send';
import CodeIcon from '@mui/icons-material/Code';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import TableChartIcon from '@mui/icons-material/TableChart';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { HBox, HButton, HLabel, HPaper, HTextField, HDropdown, useToast } from "@helix/component-library";

const dialogPaperProps = {
  sx: {
    borderRadius: "16px",
    border: `1px solid ${idmLayoutColors.border}`,
    boxShadow: `0 12px 30px ${idmLayoutColors.primary}30`,
  },
};

function templateTypesEqual(a, b) {
  return (a ?? "").trim().toLowerCase() === (b ?? "").trim().toLowerCase();
}

function isTextChannel(channel, textChannels) {
  const v = (channel || "").trim().toUpperCase();
  return textChannels.includes(v);
}

function getSelectableTemplateTypes(
  channel,
  allTypes,
  textChannels,
  channelTemplateTypes
) {
  const ch = (channel || "").trim().toUpperCase();
  const perChannel = ch && channelTemplateTypes?.[ch];
  if (perChannel && perChannel.length > 0) {
    return perChannel;
  }
  if (!channel || !isTextChannel(channel, textChannels)) {
    return allTypes;
  }
  return allTypes.length > 0 ? [allTypes[0]] : [];
}

function splitPrimaryAndSecondaryTypes(allowed) {
  if (!allowed.length) return { primary: "", secondary: [] };
  return { primary: allowed[0], secondary: allowed.slice(1) };
}

const StyledDivider = ({ children, color = "primary" }) => (
  <Divider
    sx={{
      "&::before, &::after": { borderColor: idmLayoutColors.border },
      mt: 3,
      mb: 3,
    }}
  >
    <Chip
      label={children}
      color={color}
      variant="outlined"
      size="small"
      sx={{ fontWeight: 600, fontFamily: idmFontFamily, fontSize: 11 }}
    />
  </Divider>
);

function normalizeChannelParam(raw) {
  return (raw ?? "").trim().toUpperCase();
}

export default function TestComService() {
  const { channel } = useParams();
  const channelKey = normalizeChannelParam(channel);
  const navigate = useNavigate();
  const toast = useToast();
  const theme = useTheme();
  const intl = useIntl();

  const [modules, setModules] = useState([]);
  const [templateTypes, setTemplateTypes] = useState([]);
  const [textChannels, setTextChannels] = useState([]);
  const [channelTemplateTypes, setChannelTemplateTypes] = useState({});
  const [selectedModule, setSelectedModule] = useState("");
  const [templates, setTemplates] = useState([]);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [payloadPreview, setPayloadPreview] = useState(null);
  const [sending, setSending] = useState(false);
  const [lastCorrelationId, setLastCorrelationId] = useState(null);

  const [bodyData, setBodyData] = useState({ templateId: "", vars: {}, headers: [], items: [] });
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    HAxiosService.GET(utilityAPI.getChannelsModulesAndTypes())
      .then((res) => {
        const ok = (res.data.status || "").toLowerCase() === "success";
        const data = res.data.data;
        if (!ok || !data) return;
        setModules(data.modules || []);
        setTemplateTypes(data.templateTypes || []);
        setTextChannels((data.textChannels || []).map((c) => (c || "").trim().toUpperCase()));
        setChannelTemplateTypes(data.channelTemplateTypes || {});
        if (data.modules?.[0]) setSelectedModule(data.modules[0].moduleId);
      })
      .catch(() => {
        setModules([]);
        setTemplateTypes([]);
        setTextChannels([]);
        setChannelTemplateTypes({});
      });
  }, []);

  const allowedTemplateTypes = useMemo(
    () => getSelectableTemplateTypes(channelKey, templateTypes, textChannels, channelTemplateTypes),
    [channelKey, templateTypes, textChannels, channelTemplateTypes]
  );

  const { primary: primaryTemplateType, secondary: secondaryTemplateTypes } = useMemo(
    () => splitPrimaryAndSecondaryTypes(allowedTemplateTypes),
    [allowedTemplateTypes]
  );

  const supportsAttachments = secondaryTemplateTypes.length > 0;
  const showSubjectField = channelKey === 'EMAIL';

  const bodyTemplates = useMemo(() => {
    if (!primaryTemplateType) return templates;
    return templates.filter((t) => templateTypesEqual(t.templateType, primaryTemplateType));
  }, [templates, primaryTemplateType]);

  const attachmentTemplates = useMemo(
    () =>
      templates.filter((t) =>
        secondaryTemplateTypes.some((st) => templateTypesEqual(t.templateType, st))
      ),
    [templates, secondaryTemplateTypes]
  );

  useEffect(() => {
    setLastCorrelationId(null);
  }, [to, selectedModule, bodyData.templateId, attachments]);

  useEffect(() => {
    setLastCorrelationId(null);
    setBodyData({ templateId: "", vars: {}, headers: [], items: [] });
    setAttachments([]);
    setTemplates([]);
  }, [channelKey]);

  useEffect(() => {
    if (!selectedModule || !channelKey) return;

    HAxiosService.GET(utilityAPI.getTemplatesByModuleChannel(selectedModule, channelKey))
      .then(res => {
        setTemplates(res.data.data || []);
      })
      .catch(() => setTemplates([]));
  }, [selectedModule, channelKey]);

  const getFinalPayload = () => {
    const body = {
      templateId: bodyData.templateId,
      data: {
        ...bodyData.vars,
        ...(bodyData.items.length > 0 ? { items: bodyData.items } : {}),
      },
    };

    const payload = showSubjectField
      ? { to, subject, body }
      : { to, body };

    if (supportsAttachments && attachments.length > 0) {
      payload.attachments = attachments.map((att) => ({
        templateId: att.templateId,
        data: {
          ...att.vars,
          ...(att.items.length > 0 ? { items: att.items } : {}),
        },
      }));
    }

    return payload;
  };

  const handleSend = async () => {
    if (!channelKey) {
      toast.error(intl.formatMessage({ id: "utility.testComService.noChannel", defaultMessage: "No channel in the URL." }));
      return;
    }
    if (!to || !bodyData.templateId) {
      toast.error("Please fill in the recipient and select a body template.");
      return;
    }

    setSending(true);
    setLastCorrelationId(null);

    try {
      const payload = getFinalPayload();
      const res = await HAxiosService.POST(utilityAPI.testSendCommunication(channelKey), payload);

      const { status, message, correlationId, data } = res.data;
      setLastCorrelationId(correlationId || null);

      const isSuccess = status?.toLowerCase() === "processing";

      let validationError = "";
      if (!isSuccess && data) {
        validationError = Object.values(data)
          .map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
          .join("; ");
      }

      toast(
        <HBox sx={{ minWidth: "250px", flexDirection: "column" }}>
          <HLabel
            value={message || (isSuccess ? "Request accepted" : "Failed to send")}
            translate={false}
            colon={false}
            sx={{ fontWeight: "bold", mb: 0.5 }}
          />
          {validationError ? (
            <HLabel
              value={`Details: ${validationError}`}
              translate={false}
              colon={false}
              sx={{ color: "error.main", fontSize: 11, mb: 0.5 }}
            />
          ) : null}
          <HLabel
            value={`Status: ${status}`}
            translate={false}
            colon={false}
            sx={{ fontSize: 11 }}
          />
        </HBox>,
        { duration: 8000, color: isSuccess ? "green" : "red" }
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending communication");
    } finally {
      setSending(false);
    }
  };

  if (!channelKey) {
    return (
        <HBox
          sx={{
            minHeight: "calc(100vh - 64px)",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            py: 2,
            boxSizing: "border-box",
          }}
        >
            <HPaper elevation={2} sx={{ p: 3, borderRadius: "16px", border: `1px solid ${idmLayoutColors.border}` }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <IconButton onClick={() => navigate("/homelayout/templatelist")} size="small">
                  <ArrowBackIcon />
                </IconButton>
                <HLabel
                  value={intl.formatMessage({ id: "utility.testComService.title", defaultMessage: "Communication tester" })}
                  translate={false}
                  colon={false}
                  variant="h6"
                  sx={{ fontFamily: idmFontFamily, fontWeight: 700 }}
                />
              </Stack>
              <Alert severity="warning">
                {intl.formatMessage({ id: "utility.testComService.noChannel", defaultMessage: "No channel in the URL." })}
              </Alert>
            </HPaper>
        </HBox>
    );
  }

  return (
      <HBox
        sx={{
          minHeight: "calc(100vh - 64px)",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          py: 2,
          boxSizing: "border-box",
        }}
      >
            <HPaper
              elevation={2}
              sx={{
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <HBox
                sx={{
                  backgroundSize: "300% 300%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 1.5,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
                  <IconButton
                    onClick={() => navigate("/homelayout/templatelist")}
                    size="small"
                    sx={{ color: theme.palette.text.primary }}
                  >
                    <ArrowBackIcon fontSize="small" />
                  </IconButton>
                  <HBox
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <SettingsSuggestIcon sx={{ fontSize: 18, color: theme.palette.text.primary }} />
                  </HBox>
                  <HLabel
                    value={intl.formatMessage({ id: "utility.testComService.title", defaultMessage: "Communication tester" })}
                    translate={false}
                    colon={false}
                    sx={{
                      fontWeight: 700,
                      fontFamily: idmFontFamily,
                      fontSize: 16,
                      color: theme.palette.text.primary,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  />
                </Stack>
                {channelKey ? (
                  <Chip
                    label={channelKey}
                    size="small"
                    sx={{
                      color: theme.palette.text.primary,
                      fontFamily: idmFontFamily,
                      fontWeight: 600,
                      fontSize: 11,
                      mr: 3
                    }}
                  />
                ) : null}
              </HBox>

              <HBox sx={{ px: { xs: 2, md: 3 }, py: 2.5, flexDirection: "column" }}>
                <HPaper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: "12px", border: `1px solid ${idmLayoutColors.border}` }}>
                  <Grid container spacing={3} mb={2}>
                    <Grid item xs={12} md={12}>
                      <HDropdown
                        options={modules.map((m) => ({ value: m.moduleId, label: m.moduleName }))}
                        value={selectedModule}
                        onChange={(e) => setSelectedModule(e.target.value)}
                        name="selectedModule"
                        placeholder={intl.formatMessage({ id: "utility.testComService.module", defaultMessage: "Module" })}
                        width="100%"
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <HTextField
                        fullWidth
                        editable
                        label={
                          channelKey === "EMAIL"
                            ? intl.formatMessage({ id: "utility.testComService.recipientEmail", defaultMessage: "Recipient (email / address)" })
                            : intl.formatMessage({ id: "utility.testComService.recipientPhone", defaultMessage: "Recipient (phone / messaging address)" })
                        }
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {isTextChannel(channelKey, textChannels) ? (
                                <PhoneIphoneIcon />
                              ) : (
                                <MailOutlineIcon />
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    {showSubjectField ? (
                      <Grid item xs={12} md={12}>
                        <HTextField
                          fullWidth
                          editable
                          placeholder={intl.formatMessage({ id: "utility.testComService.subject", defaultMessage: "Subject" })}
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                        />
                      </Grid>
                    ) : null}
                  </Grid>

                  <StyledDivider>
                    {primaryTemplateType ? `${channelKey} — ${primaryTemplateType}` : channelKey}
                  </StyledDivider>

                  <TemplateDataEditor
                    data={bodyData}
                    setData={setBodyData}
                    templates={bodyTemplates}
                    label={primaryTemplateType ? `Select template (${primaryTemplateType})` : "Select template"}
                  />

                  {supportsAttachments ? (
                    <>
                      <StyledDivider color="secondary">
                        {intl.formatMessage({ id: "utility.testComService.attachmentsHeader", defaultMessage: "ATTACHMENTS ({count})" }, { count: attachments.length })}
                      </StyledDivider>
                      {attachments.map((att, index) => (
                        <HPaper key={index} elevation={0} sx={{ p: 3, mb: 4, borderRadius: "12px", border: `1px solid ${idmLayoutColors.border}` }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <HLabel
                              value={intl.formatMessage({ id: "utility.testComService.attachmentTitle", defaultMessage: "Attachment Template #{index}" }, { index: index + 1 })}
                              translate={false}
                              colon={false}
                              variant="subtitle1"
                              sx={{ fontFamily: idmFontFamily, fontWeight: 700, color: theme.palette.text.primary }}
                            />
                            <IconButton size="small" onClick={() => setAttachments(attachments.filter((_, i) => i !== index))} sx={{ color: idmLayoutColors.accent, "&:hover": { bgcolor: `${idmLayoutColors.accent}12` } }}>
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                          <TemplateDataEditor
                            data={att}
                            setData={(val) => {
                              const newAtts = [...attachments];
                              newAtts[index] = val;
                              setAttachments(newAtts);
                            }}
                            templates={attachmentTemplates}
                            label={
                              secondaryTemplateTypes.length
                                ? `Select template (${secondaryTemplateTypes.join(", ")})`
                                : "Select template"
                            }
                          />
                        </HPaper>
                      ))}

                      <HButton
                        variant="outlined"
                        startIcon={<AddIcon sx={{ fontSize: "18px !important" }} />}
                        onClick={() => setAttachments([...attachments, { templateId: "", vars: {}, headers: [], items: [] }])}
                        label="utility.testComService.addAttachment"
                      />
                    </>
                  ) : null}

                  <HBox sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mt: 5, alignItems: 'center', flexWrap: 'wrap' }}>
                    <HButton
                      variant="outlined"
                      size="medium"
                      startIcon={<CodeIcon sx={{ fontSize: "18px !important" }} />}
                      onClick={() => setPayloadPreview(getFinalPayload())}
                      label="utility.testComService.viewPayload"
                    />

                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                      <HButton
                        variant="contained"
                        size="medium"
                        startIcon={sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon sx={{ fontSize: "18px !important" }} />}
                        onClick={handleSend}
                        disabled={sending}
                        label={sending ? "utility.testComService.sending" : "utility.testComService.send"}
                      />

                      {lastCorrelationId && (
                        <Stack
                          direction="row"
                          alignItems="center"
                          sx={{
                            bgcolor: idmLayoutColors.hover,
                            p: 1,
                            borderRadius: "10px",
                            border: `1px dashed ${idmLayoutColors.border}`,
                          }}
                        >
                          <HLabel
                            value={`Ack ID: ${lastCorrelationId}`}
                            translate={false}
                            colon={false}
                            variant="body2"
                            sx={{ fontFamily: "monospace", fontWeight: 600, color: theme.palette.text.secondary, fontSize: 12 }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => {
                              navigator.clipboard.writeText(lastCorrelationId);
                              toast.success("Copied to clipboard", { duration: 1000 });
                            }}
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      )}
                    </Stack>
                  </HBox>
                </HPaper>
              </HBox>
            </HPaper>

          <HDialog
            disableContentWrapper
            open={!!payloadPreview}
            onClose={() => setPayloadPreview(null)}
            maxWidth="md"
            fullWidth
            PaperProps={dialogPaperProps}
            title={intl.formatMessage({ id: "utility.testComService.payloadTitle", defaultMessage: "Final API Payload Structure" })}
            titleSx={{ fontFamily: idmFontFamily, fontWeight: 700, fontSize: 16, color: theme.palette.text.primary, borderBottom: `1px solid ${idmLayoutColors.border}` }}
          >
            <DialogContent dividers >
              <pre style={{ fontSize: 13, whiteSpace: "pre-wrap", fontFamily: "ui-monospace, monospace", margin: 0, color: theme.palette.text.primary }}>
                {JSON.stringify(payloadPreview, null, 2)}
              </pre>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
              <HButton
                onClick={() => setPayloadPreview(null)}
                variant="contained"
                label="utility.testComService.close"
              />
            </DialogActions>
          </HDialog>
      </HBox>
  );
}

function TemplateDataEditor({ data, setData, templates, label }) {
  const intl = useIntl();
  const theme = useTheme();
  const [col, setCol] = useState("");

  const safeTemplates = useMemo(() => {
    return Array.isArray(templates) ? templates : [];
  }, [templates]);

  const update = (field, value) => setData({ ...data, [field]: value });

  const setVarValue = (key, value) => {
    update("vars", { ...data.vars, [key]: value });
  };

  const removeVarKey = (key) => {
    const next = { ...data.vars };
    delete next[key];
    update("vars", next);
  };

  const sortedVarKeys = Object.keys(data.vars || {}).sort();

  const fetchTemplateAttributes = async (id) => {
    const res = await HAxiosService.GET(utilityAPI.getTemplateAttributes(id));
    const attr = res.data?.data || {};

    return {
      vars: attr.variables || {},
      items: attr.items || []
    };
  };

  return (
    <Stack spacing={4}>
      <HDropdown
        options={
          safeTemplates.map((t) => ({
            value: t.id,
            label: `${t.templateName} (${t.templateType})`,
          }))
        }
        value={data.templateId}
        onChange={async (e) => {
          const id = e.target.value;
          try {
            const { vars, items } = await fetchTemplateAttributes(id);
            const headers =
              items.length > 0
                ? Array.from(new Set(items.flatMap((r) => Object.keys(r))))
                : [];

            setData({
              templateId: id,
              vars,
              headers,
              items
            });
          } catch (err) {
            console.error(err);
            setData({
              templateId: id,
              vars: {},
              headers: [],
              items: []
            });
          }
        }}
        name="templateId"
        placeholder={
          safeTemplates.length === 0
            ? intl.formatMessage({ id: "utility.testComService.selectTemplates", defaultMessage: "Select Template" })
            : label
        }
        width="100%"
      />

      <HPaper variant="outlined" sx={{ p: 2, borderRadius: "12px" }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <TextFieldsIcon sx={{ color: theme.palette.text.primary }} />
          <HLabel
            value={intl.formatMessage({ id: "utility.testComService.variablesTitle", defaultMessage: "Variables" })}
            translate={false}
            colon={false}
            sx={{ fontFamily: idmFontFamily, fontWeight: 700, color: theme.palette.text.primary }}
          />
        </Stack>
        <HLabel
          value={intl.formatMessage({ id: "utility.testComService.variablesSubtitle", defaultMessage: "Keys from the selected template appear below; enter values for each." })}
          translate={false}
          colon={false}
          align="left"
          variant="caption"
          sx={{ color: theme.palette.text.secondary, display: "block", mb: 2 }}
        />
        <Stack spacing={1.5}>
          {sortedVarKeys.map((k) => (
            <Grid container spacing={1} alignItems="center" key={k}>
              <Grid item xs={12} sm={5}>
                <HTextField fullWidth size="small" label="Key" editable value={k} InputProps={{ readOnly: true }} variant="filled" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <HTextField
                  fullWidth
                  editable
                  size="small"
                  label="Value"
                  value={data.vars[k] ?? ""}
                  onChange={(e) => setVarValue(k, e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={1} sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "center" } }}>
                <IconButton size="small" color="error" onClick={() => removeVarKey(k)} aria-label={`Remove ${k}`}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </Stack>
      </HPaper>

      <HPaper variant="outlined" sx={{ p: 2, borderRadius: "12px" }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <TableChartIcon sx={{ color: theme.palette.text.primary }} />
          <HLabel
            value={intl.formatMessage({ id: "utility.testComService.tableTitle", defaultMessage: "Table Items (Dynamic Rows)" })}
            translate={false}
            colon={false}
            sx={{ fontFamily: idmFontFamily, fontWeight: 700, color: theme.palette.text.primary }}
          />
        </Stack>
        <Stack direction="row" spacing={1} mb={2}>
          <HTextField
            size="small"
            editable
            placeholder={intl.formatMessage({ id: "utility.testComService.newColName", defaultMessage: "New Column Name" })}
            value={col}
            onChange={(e) => setCol(e.target.value)}
          />
          <HButton
            variant="outlined"
            onClick={() => {
              if (!col) return;
              update('headers', [...data.headers, col]);
              setCol("");
            }}
            label="utility.testComService.addCol"
            size="small"
          />
          <HButton
            variant="contained"
            color="secondary"
            onClick={() => update('items', [...data.items, {}])}
            label="utility.testComService.addRow"
            size="small"
          />
        </Stack>
        <HBox sx={{ overflowX: 'auto', border: `1px solid ${idmLayoutColors.border}`, borderRadius: '10px' }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: idmLayoutColors.hover }}>
              <TableRow>
                {data.headers.map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 'bold' }}>
                    <HLabel value={h} translate={false} colon={false} sx={{ fontWeight: 'bold' }} />
                  </TableCell>
                ))}
                {data.headers.length > 0 && <TableCell sx={{ width: 50 }} />}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.items.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {data.headers.map((h) => (
                    <TableCell key={h}>
                      <HTextField
                        variant="standard"
                        editable
                        fullWidth
                        value={row[h] || ""}
                        onChange={(e) => {
                          const newItems = [...data.items];
                          newItems[rowIndex][h] = e.target.value;
                          update('items', newItems);
                        }}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <IconButton size="small" color="error" onClick={() => update('items', data.items.filter((_, i) => i !== rowIndex))}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </HBox>
      </HPaper>
    </Stack>
  );
}
