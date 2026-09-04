import React, { useCallback, useState } from "react";
import { Button, Chip,Stack,Typography,alpha,useTheme,IconButton,CircularProgress,} from "@mui/material";
import { useIntl } from "react-intl";
import Tag from "@mui/icons-material/Tag";
import Add from "@mui/icons-material/Add";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { useToast, HAxiosService, ALIGNMENT, HBox, HButtonBar, HLabel, HPaper, HTextField } from "@helix/component-library";


import { TagAccountAPI } from "../apiEndpoints.jsx";
import { handleValidationErrors } from "../ValidationUtils.jsx";

// Suggested tags - matching TagAccountDetails
const SUGGESTED_TAGS = [
  "VIP",
  "Dispute",
  "Legal Review",
  "Skip Trace",
  "Hardship",
  "Fraud",
  "Deceased",
  "Bankruptcy",
  "Settlement",
];

function makeRowId(prefix, idx) {
  return `${prefix}-${idx}-${Math.random().toString(36).slice(2, 9)}`;
}

function isSuccessPayload(data) {
  if (!data) return false;
  const s = data.status;
  return s === "Success" || s === 200 || s === "200";
}

export default function GroupTagForm({
  selectedAccounts = [],
  onSuccess,
  onCancel,
  gridApiRef,
}) {
  const theme = useTheme();
  const intl = useIntl();
  const toast = useToast();

  const [tagsToApply, setTagsToApply] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [newRemark, setNewRemark] = useState("");
  const [saving, setSaving] = useState(false);

  const userCode = sessionStorage.getItem("SEC_USERNAME") || "SYSTEM";

  // Get used suggestions - exclude tags that are already added
  const usedSuggestions = React.useMemo(() => {
    const taken = new Set(tagsToApply.map((t) => t.szTag.trim().toLowerCase()));
    return SUGGESTED_TAGS.filter((s) => !taken.has(s.toLowerCase()));
  }, [tagsToApply]);

  // Add tag to apply list - using toast for errors like TagAccountDetails
  const addTagToApply = useCallback((tagName) => {
    const value = (tagName ?? newTag).trim();
    if (!value) {
      toast.error(
        intl.formatMessage({
          id: "label.tag.tagRequired",
          defaultMessage: "Tag Name is required to add a tag.",
        })
      );
      return;
    }

    // Check for duplicates
    if (tagsToApply.some((t) => t.szTag.toLowerCase() === value.toLowerCase())) {
      toast.warn(
        intl.formatMessage({
          id: "label.tag.duplicate",
          defaultMessage: "This tag has already been added",
        })
      );
      return;
    }

    setTagsToApply((prev) => [
      ...prev,
      {
        id: makeRowId("new", prev.length),
        szTag: value,
        szRemark: newRemark.trim(),
        szCollectorCode: userCode,
        szMode: "N",
      },
    ]);
    setNewTag("");
    setNewRemark("");
  }, [newTag, newRemark, tagsToApply, toast, intl, userCode]);

  // Remove tag from apply list
  const removeTagFromApply = useCallback((id) => {
    setTagsToApply((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Build bulk payload
  const buildBulkPayload = useCallback(() => {
    const commonRequestDto = selectedAccounts.map((account) => ({
      custSeqNo: account.CUST_SEQNO ?? account.custSeqNo ?? null,
      acctSeqNo: account.ACNT_SEQNO ?? account.acctSeqNo ?? account.lnAccountSeqNo ?? null,
      caseSeqNo: account.CASE_SEQNO ?? account.caseSeqNo ?? account.lnCaseSeqNo ?? null,
      allocSeqNo: account.ALLOC_SEQNO ?? account.allocSeqNo ?? account.lnAllocSeqNo ?? null,
      partitionCode: account.PARTITION_CODE ?? account.partitionCode ?? account.szPartitionCode ?? "001",
      userCode: account.userCode ?? account.szUserCode ?? "SYSTEM",
      portfolioCode: account.PRTFL ?? account.portfolioCode ?? account.szPortfolioCode ?? "",
    }));

    const lstTagDetails = tagsToApply.map((tag) => ({
      szTag: tag.szTag,
      szRemark: tag.szRemark || "",
      szCollectorCode: userCode,
      szMode: "N",
    }));

    return {
      lstTagDetails,
      commonRequestDto,
    };
  }, [selectedAccounts, tagsToApply, userCode]);

  // Submit tags
  const persistTags = useCallback(async () => {
    if (tagsToApply.length === 0) {
      toast.info(
        intl.formatMessage({
          id: "label.tag.noTagsToApply",
          defaultMessage: "No tags to apply. Please add at least one tag.",
        })
      );
      return;
    }

    setSaving(true);

    try {
      const payload = buildBulkPayload();
      
      const response = await HAxiosService.POST(
        TagAccountAPI.submitGroupTagDetails(),
        payload
      );

      const objResData = response?.data;

      if (
        objResData?.status === "Failure" &&
        objResData?.message === "Validation Failed"
      ) {
        handleValidationErrors(intl, toast, objResData.responseJson);
        setSaving(false);
        return;
      }

      if (isSuccessPayload(objResData)) {
        toast.success(
          objResData.message ||
            intl.formatMessage(
              {
                id: "message.tags.applySuccess",
                defaultMessage: "{count} tag(s) applied to {accounts} account(s)",
              },
              {
                count: tagsToApply.length,
                accounts: selectedAccounts.length,
              }
            )
        );

        const processedAccounts = selectedAccounts.map((acc) => ({
          ...acc,
          tags: [
            ...(acc.tags || []),
            ...tagsToApply.map((tag) => ({
              szTag: tag.szTag,
              szRemark: tag.szRemark || "",
              szCollectorCode: userCode,
              dtModifiedOn: new Date().toISOString(),
            })),
          ],
        }));

        if (onSuccess) {
          onSuccess(processedAccounts);
        }

        setTagsToApply([]);
        setNewTag("");
        setNewRemark("");
      } else {
        const errMsg =
          objResData?.message ||
          intl.formatMessage({
            id: "error.tags.applyFailed",
            defaultMessage: "Failed to apply tags to selected accounts",
          });
        toast.error(errMsg);
      }
    } catch (error) {
      console.error("Error applying tags:", error);
      toast.error(
        error?.response?.data?.message ||
          intl.formatMessage({
            id: "error.tags.applyNetwork",
            defaultMessage: "Error while applying tags.",
          })
      );
    } finally {
      setSaving(false);
    }
  }, [selectedAccounts, tagsToApply, buildBulkPayload, toast, intl, onSuccess, userCode]);

  // Reset form
  const resetForm = useCallback(() => {
    setTagsToApply([]);
    setNewTag("");
    setNewRemark("");
  }, []);

  // Handle cancel
  const handleCancel = useCallback(() => {
    resetForm();
    if (onCancel) onCancel();
  }, [onCancel, resetForm]);

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTagToApply();
    }
  };

  // Section label style - matching TagAccountDetails
  const sectionLabelSx = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: "text.secondary",
  };

  return (
    <HBox
      sx={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        position: "relative",
      }}
    >
      {/* Loading overlay */}
      {saving && (
        <HBox
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(255, 255, 255, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            borderRadius: 1,
          }}
        >
          <CircularProgress />
        </HBox>
      )}

      {/* Main content wrapper - matching TagAccountDetails structure */}
      <HBox
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
          pb: 2,
        }}
      >
        <Stack spacing={2} sx={{ maxWidth: 1320, mx: "auto", width: "100%" }}>
          {/* Add New Tag Section - Matching TagAccountDetails style */}
          <Stack spacing={0.5}>
            <HLabel
              value={intl.formatMessage({
                id: "label.tag.addNewTag",
                defaultMessage: "ADD NEW TAG",
              })}
              colon={false}
              translate={false}
              align="left"
              component="div"
              color={theme.palette.primary.main}
              sx={sectionLabelSx}
            />
            
            {/* Input row - Tag, Remark, and Add button aligned in same row */}
            <HBox
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1,
                alignItems: { xs: "stretch", sm: "center" },
              }}
            >
              <HBox sx={{ flex: 2 }}>
                <HTextField
                  value={newTag}
                  onChange={(e) => {
                    setNewTag(e.target.value);
                  }}
                  onKeyDown={handleKeyPress}
                  editable
                  width="100%"
                  placeholder={intl.formatMessage({
                    id: "label.tag.tagPlaceholder",
                    defaultMessage: "Enter tag name",
                  })}
                />
              </HBox>
              <HBox sx={{ flex: 2 }}>
                <HTextField
                  value={newRemark}
                  onChange={(e) => setNewRemark(e.target.value)}
                  onKeyDown={handleKeyPress}
                  editable
                  width="100%"
                  placeholder={intl.formatMessage({
                    id: "label.tag.remarkPlaceholder",
                    defaultMessage: "Remark (optional)",
                  })}
                />
              </HBox>
              <HBox sx={{ flexShrink: 0 }}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Add sx={{ fontSize: 12 }} />}
                  onClick={() => addTagToApply()}
                  disabled={saving}
                  sx={{
                    height: 40,
                    minWidth: 80,
                    textTransform: "none",
                  }}
                >
                  {intl.formatMessage({
                    id: "button.add",
                    defaultMessage: "Add",
                  })}
                </Button>
              </HBox>
            </HBox>

            {/* Suggestions - with proper spacing above */}
            {usedSuggestions.length > 0 && (
              <HBox sx={{ mt: 1 }}>
                <Typography
                  sx={{
                    fontSize: 10,
                    color: "text.secondary",
                    mb: 0.5,
                  }}
                >
                  {intl.formatMessage({
                    id: "label.tag.suggestions",
                    defaultMessage: "Suggestions:",
                  })}
                </Typography>
                <HBox
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.75,
                  }}
                >
                  {usedSuggestions.map((s) => (
                    <Chip
                      key={s}
                      size="small"
                      variant="outlined"
                      label={
                        <HBox
                          component="span"
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.25,
                            fontSize: 11,
                          }}
                        >
                          <Add sx={{ fontSize: 12 }} />
                          {s}
                        </HBox>
                      }
                      onClick={() => addTagToApply(s)}
                      sx={{
                        borderStyle: "dashed",
                        height: 26,
                        cursor: "pointer",
                        "& .MuiChip-label": { px: 1 },
                      }}
                    />
                  ))}
                </HBox>
              </HBox>
            )}
          </Stack>

          {/* Tags to Apply List - Matching TagAccountDetails tag rows */}
          <Stack spacing={0.5}>
            <HLabel
              value={intl.formatMessage(
                {
                  id: "label.tag.tagsToApply",
                  defaultMessage: "TAGS TO APPLY ({count})",
                },
                { count: tagsToApply.length }
              )}
              colon={false}
              translate={false}
              align="left"
              component="div"
              color={theme.palette.primary.main}
              sx={sectionLabelSx}
            />

            {tagsToApply.length === 0 ? (
              <HPaper
                variant="outlined"
                sx={{
                  py: 3,
                  px: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  bgcolor: alpha(theme.palette.text.primary, 0.02),
                  borderColor: alpha(theme.palette.text.primary, 0.12),
                  borderStyle: "dashed",
                  borderRadius: 2,
                }}
              >
                <Tag
                  sx={{
                    fontSize: 32,
                    color: alpha(theme.palette.text.secondary, 0.2),
                    mb: 1,
                  }}
                />
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                  {intl.formatMessage({
                    id: "label.tag.noTagsToApply",
                    defaultMessage: "No tags added yet. Enter a tag name above.",
                  })}
                </Typography>
              </HPaper>
            ) : (
              <Stack spacing={0.75}>
                {tagsToApply.map((t) => (
                  <HPaper
                    key={t.id}
                    variant="outlined"
                    sx={{
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.06),
                      borderColor: alpha(theme.palette.primary.main, 0.25),
                    }}
                  >
                    <Chip
                      label={t.szTag}
                      size="small"
                      color="primary"
                      sx={{
                        "& .MuiChip-label": { fontSize: 11, fontWeight: 600 },
                      }}
                    />
                    <Typography
                      sx={{
                        flex: 1,
                        fontSize: 11,
                        color: "text.secondary",
                        minWidth: 0,
                      }}
                      noWrap
                    >
                      {t.szRemark || "—"}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 10,
                        fontFamily: "ui-monospace, monospace",
                        color: "text.secondary",
                        opacity: 0.7,
                        flexShrink: 0,
                        ml: "auto",
                      }}
                    >
                      {t.szCollectorCode || userCode}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => removeTagFromApply(t.id)}
                      disabled={saving}
                      sx={{ color: "error.main", opacity: 0.85 }}
                    >
                      <DeleteOutline sx={{ fontSize: 18 }} />
                    </IconButton>
                  </HPaper>
                ))}
              </Stack>
            )}
          </Stack>

          {/* Info about number of accounts - Matching TagAccountDetails info style */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mt: 1,
              p: 1.5,
              bgcolor: alpha(theme.palette.info.main, 0.04),
              borderRadius: 1,
              border: "1px solid",
              borderColor: alpha(theme.palette.info.main, 0.15),
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <span style={{ fontSize: 16 }}>ℹ️</span>
            {intl.formatMessage(
              {
                id: "label.tag.bulk.info",
                defaultMessage: "The tag(s) will be applied to all {count} selected account(s).",
              },
              { count: selectedAccounts.length }
            )}
          </Typography>
        </Stack>
      </HBox>

      {/* Footer Buttons - Using HButtonBar like TagAccountDetails */}
      <HButtonBar
        onSave={persistTags}
        onReset={resetForm}
        onClose={onCancel}
        saveLabel={
          saving
            ? intl.formatMessage({
                id: "button.applying",
                defaultMessage: "Applying...",
              })
            : intl.formatMessage(
                {
                  id: "button.applyTags",
                  defaultMessage: "Apply {count} Tag(s)",
                },
                { count: tagsToApply.length }
              )
        }
        saveDisabled={tagsToApply.length === 0 || saving}
        saveLoading={saving}
      />
    </HBox>
  );
}
