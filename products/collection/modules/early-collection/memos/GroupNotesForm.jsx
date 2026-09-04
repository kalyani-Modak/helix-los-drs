import React, { useCallback, useState } from "react";
import { useIntl } from "react-intl";
import { useTheme } from "@mui/material/styles";
import { alpha, Typography } from "@mui/material";
import { useToast, HAxiosService, HBox, HButtonBar, HPaper, HLabel, HDropdown, HCheckBox, HTextarea, useDrsTheme } from "@helix/component-library";


import { MemosAPI } from "../apiEndpoints.jsx";
import { handleValidationErrors } from "../ValidationUtils.jsx";
import { memosFontFamily, memosTextSx } from "./memosStyles";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { useColorTheme } from "../../../../../apps/debt-recovery-shell/src/themeSelectionConfig.jsx";
import { mixColors, withAlpha } from "../../../../../apps/debt-recovery-shell/src/colors";
import { useLocation } from "react-router-dom";

const transparentSurface = {
  bgcolor: "transparent",
  background: "transparent",
  backgroundColor: "transparent",
  boxShadow: "none",
};

function getNoteTypeValue(item) {
  if (item == null) return "";
  if (typeof item === "string" || typeof item === "number") return String(item);
  return String(
    item.szCondition ||
      item.code ||
      item.szNoteType ||
      item.szCode ||
      item.value ||
      item.label ||
      ""
  );
}

function getNoteTypeLabel(item, value, intl) {
  if (item && typeof item === "object") {
    const label =
      item.szi18nDesc ||
      item.szi18nDescription ||
      item.szI18nDesc ||
      item.szI18nDescription ||
      item.szDesc ||
      item.szDescription ||
      item.description ||
      item.label ||
      item.szNoteType ||
      value;
    return intl.messages?.[label]
      ? intl.formatMessage({ id: label, defaultMessage: label })
      : String(label);
  }
  return value;
}

function mapCustomerNotesTypes(payload, intl) {
  const rows = Array.isArray(payload)
    ? payload
    : payload?.customerNotesTypes ||
      payload?.customerNotesTypeList ||
      payload?.notesTypes ||
      payload?.data ||
      payload?.rows ||
      [];

  if (!Array.isArray(rows)) return [];

  return rows
    .map((item) => {
      const value = getNoteTypeValue(item).trim();
      if (!value) return null;
      return {
        value,
        label: getNoteTypeLabel(item, value, intl),
      };
    })
    .filter(Boolean);
}

export default function GroupMemoForm({
  selectedAccounts = [],
  onSuccess,
  onCancel,
  gridApiRef,
}) {
  const intl = useIntl();
  const theme = useTheme();
  const toast = useToast();
  const { themeVars, surfaces, text, border } = useDrsTheme();
  const { colors } = useColorTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [accountCustLevel, setAccountCustLevel] = useState("A");
  const [interactionType, setInteractionType] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [interactionOptions, setInteractionOptions] = useState([]);

  const userCode = sessionStorage.getItem("SEC_USERNAME") || "SYSTEM";
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  // Panel theme variables for dark mode
  const panelThemeVars = useCallback(() => {
    if (!isDarkMode) return {};

    return {
      "--drs-bg-panel": mixColors(mixColors("#1f2937", colors.secondaryDark, 0.52), colors.primaryDark, 0.3),
      "--drs-bg-input": mixColors(mixColors("#111827", colors.secondaryDark, 0.3), colors.primaryDark, 0.18),
      "--drs-border-divider": mixColors("#334155", colors.primary, 0.28),
      "--drs-control-border": withAlpha(colors.primaryLight, 0.38),
      "--drs-control-hover-border": colors.primaryLight,
      "--drs-hover-bg": withAlpha(colors.primary, 0.18),
      "--drs-button-outline-bg": withAlpha(colors.primary, 0.12),
      "--drs-button-outline-hover": withAlpha(colors.primary, 0.2),
      "--drs-button-outline-text": colors.primaryLight,
      "--drs-text-secondary": mixColors("#cbd5e1", colors.secondaryLight, 0.42),
      "--drs-text-tertiary": mixColors("#94a3b8", colors.secondaryLight, 0.35),
    };
  }, [colors, isDarkMode]);

  // Fetch interaction types
  React.useEffect(() => {
    let active = true;

    HAxiosService.GET(`${MemosAPI.MemosApi(screenMenuId)}/getCustomerNotesTypes`)
      .then((res) => {
        if (!active) return;
        const payload = res?.data?.responseJson ?? res?.data;
        setInteractionOptions(mapCustomerNotesTypes(payload, intl));
      })
      .catch(() => {
        if (active) setInteractionOptions([]);
      });

    return () => {
      active = false;
    };
  }, [intl.locale]);

  const levelOptions = [
    {
      value: "A",
      label: intl.formatMessage({ id: "label.memos.level.account" }),
      Icon: AccountCircleOutlinedIcon,
    },
    {
      value: "C",
      label: intl.formatMessage({ id: "label.memos.level.customer" }),
      Icon: GroupsOutlinedIcon,
    },
  ];

  const optionsBoxSx = {
    ...themeVars,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
    flexWrap: "wrap",
    minHeight: 32,
    px: 0.75,
    border: 1,
    borderColor: border.divider,
    borderRadius: "5px",
    bgcolor: surfaces.input,
    "&:hover": {
      borderColor: border.hover,
    },
  };

  const stickyHintSx = {
    display: "flex",
    alignItems: "center",
    gap: 0.4,
    mt: 0.5,
    color: theme.palette.warning.dark,
    ...memosTextSx,
    lineHeight: 1.2,
    "& .MuiSvgIcon-root": {
      fontSize: 13,
      color: theme.palette.warning.main,
    },
  };

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

    return {
      commonRequestDto,
      customerNotesDto: {
        szNoteType: interactionType,
        szNotes: notes.trim(),
        szIsStickyNote: isSticky ? "Y" : "N",
        szAccountCustLevel: accountCustLevel,
        szCreatedBy: userCode,
      },
    };
  }, [selectedAccounts, interactionType, notes, isSticky, accountCustLevel, userCode]);

  // Submit group memo
  const handleSubmit = useCallback(async () => {
    const trimmedNotes = (notes || "").trim();
    const trimmedType = (interactionType || "").trim();

    if (!trimmedType) {
      toast.error(intl.formatMessage({ id: "error.memos.requiredInteraction" }));
      return;
    }
    if (!trimmedNotes) {
      toast.error(intl.formatMessage({ id: "error.memos.requiredNote" }));
      return;
    }

    if (!selectedAccounts || selectedAccounts.length === 0) {
      toast.error(intl.formatMessage({ id: "error.memos.noAccounts" }));
      return;
    }

    setSaving(true);

    try {
      const payload = buildBulkPayload();
      
      const response = await HAxiosService.POST(
        `${MemosAPI.MemosApi(screenMenuId)}/group-Notes`,
        payload
      );

      const objResData = response?.data;
      const status = objResData?.status ?? response?.status;
      const message = objResData?.message ?? objResData?.responseMessage;

      const isSuccess =
        status === 200 ||
        status === "200" ||
        String(status).trim().toLowerCase() === "success" ||
        (typeof message === "string" && String(message).trim().toLowerCase() === "success");

      if (isSuccess) {
        toast.success(
          objResData.message ||
            intl.formatMessage(
              {
                id: "message.memos.groupSaveSuccess",
                defaultMessage: "Memo added to {count} account(s)",
              },
              { count: selectedAccounts.length }
            )
        );

        const processedAccounts = selectedAccounts.map((acc) => ({
          ...acc,
          memos: [
            ...(acc.memos || []),
            {
              szNoteType: trimmedType,
              szNotes: trimmedNotes,
              szIsStickyNote: isSticky ? "Y" : "N",
              szAccountCustLevel: accountCustLevel,
              szCreatedBy: userCode,
              dtCreated: new Date().toISOString(),
            },
          ],
        }));

        if (onSuccess) {
          onSuccess(processedAccounts);
        }

        setNotes("");
        setInteractionType("");
        setIsSticky(false);
        setAccountCustLevel("A");
      } else if (status === "Failure" || message === "Validation Failed") {
        handleValidationErrors(intl, toast, objResData?.responseJson);
      } else {
        toast.error(
          objResData?.message ||
            intl.formatMessage({ id: "error.memos.groupSaveFailed" })
        );
      }
    } catch (error) {
      console.error("Error saving group memo:", error);
      toast.error(
        error?.response?.data?.message ||
          intl.formatMessage({ id: "error.saving.groupMemos" })
      );
    } finally {
      setSaving(false);
    }
  }, [
    notes,
    interactionType,
    isSticky,
    accountCustLevel,
    selectedAccounts,
    buildBulkPayload,
    toast,
    intl,
    onSuccess,
    userCode,
  ]);

  // Reset form
  const resetForm = useCallback(() => {
    setAccountCustLevel("A");
    setInteractionType("");
    setIsSticky(false);
    setNotes("");
  }, []);

  // Handle cancel
  const handleCancel = useCallback(() => {
    resetForm();
    if (onCancel) onCancel();
  }, [onCancel, resetForm]);

  // Section label style
  const sectionLabelSx = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: isDarkMode ? colors.primaryLight : "text.secondary",
  };

  return (
    <HBox
      sx={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        bgcolor: isDarkMode ? colors.primaryDark : "background.default",
        ...panelThemeVars(),
      }}
    >
      {/* Main content wrapper */}
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
        <HPaper
          elevation={0}
          sx={{
            ...themeVars,
            borderRadius: "8px",
            border: 1,
            borderColor: isDarkMode ? "var(--drs-border-divider, #334155)" : "divider",
            bgcolor: surfaces.paper,
            width: "100%",
            overflow: "hidden",
          }}
        >
          <HBox sx={{ ...transparentSurface, px: 2, py: 2.25, width: "100%" }}>
            <HBox
              sx={{
                ...transparentSurface,
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 2.25,
                width: "100%",
              }}
            >
              {/* Row 1: Level + Interaction Type */}
              <HBox
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                  width: "100%",
                }}
              >
                {/* Level - Removed the hint text below */}
                <HBox
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    minWidth: 0,
                  }}
                >
                  <HLabel
                    value="label.memos.field.level"
                    translate
                    colon={false}
                    align="left"
                    required
                    sx={{
                      color: isDarkMode ? "var(--drs-text-secondary, #94a3b8)" : undefined,
                    }}
                  />
                  <HDropdown
                    name="accountCustLevel"
                    value={accountCustLevel}
                    onChange={(e) => setAccountCustLevel(e.target.value)}
                    options={levelOptions}
                    placeholder={intl.formatMessage({ id: "label.memos.level.placeholder" })}
                    width="100%"
                    StartIcon={AccountCircleOutlinedIcon}
                    sx={{
                      "& .MuiInputBase-root": {
                        backgroundColor: isDarkMode ? "var(--drs-bg-input, #1a1a1a)" : undefined,
                        color: isDarkMode ? "var(--drs-text-primary, #ffffff)" : undefined,
                      },
                    }}
                  />
                </HBox>

                {/* Interaction Type */}
                <HBox
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    minWidth: 0,
                  }}
                >
                  <HLabel
                    value="label.Memos.Interaction Type"
                    translate
                    colon={false}
                    align="left"
                    required
                    sx={{
                      color: isDarkMode ? "var(--drs-text-secondary, #94a3b8)" : undefined,
                    }}
                  />
                  <HDropdown
                    name="interactionType"
                    value={interactionType}
                    onChange={(e) => setInteractionType(e.target.value)}
                    options={interactionOptions}
                    placeholder={intl.formatMessage({ id: "label.memos.interaction.placeholder" })}
                    width="100%"
                    sx={{
                      "& .MuiInputBase-root": {
                        backgroundColor: isDarkMode ? "var(--drs-bg-input, #1a1a1a)" : undefined,
                        color: isDarkMode ? "var(--drs-text-primary, #ffffff)" : undefined,
                      },
                    }}
                  />
                </HBox>
              </HBox>

              {/* Row 2: Options (Sticky) + Notes */}
              <HBox
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
                  gap: 2,
                  width: "100%",
                }}
              >
                {/* Options - Sticky Note */}
                <HBox
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    minWidth: 0,
                  }}
                >
                  <HLabel
                    value="label.memos.options"
                    translate
                    colon={false}
                    align="left"
                    sx={{
                      color: isDarkMode ? "var(--drs-text-secondary, #94a3b8)" : undefined,
                    }}
                  />
                  <HBox sx={optionsBoxSx}>
                    <HCheckBox
                      id="memosStickyNote"
                      label="label.memos.markStickyNote"
                      checked={isSticky}
                      onChange={(e) => setIsSticky(e.target.checked)}
                      Icon={DescriptionOutlinedIcon}
                      labelGap="4px"
                    />
                  </HBox>
                  {isSticky ? (
                    <HBox component="p" sx={{ m: 0, ...stickyHintSx }}>
                      <BoltOutlinedIcon />
                      {intl.formatMessage({ id: "label.memos.stickyPinnedHint" })}
                    </HBox>
                  ) : null}
                </HBox>

                {/* Notes */}
                <HBox
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    minWidth: 0,
                  }}
                >
                  <HLabel
                    value="label.Memos.Notes"
                    translate
                    colon={false}
                    align="left"
                    required
                    sx={{
                      color: isDarkMode ? "var(--drs-text-secondary, #94a3b8)" : undefined,
                    }}
                  />
                  <HTextarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      isSticky
                        ? intl.formatMessage({ id: "label.memos.notes.placeholder.sticky" })
                        : intl.formatMessage({ id: "label.memos.notes.placeholder" })
                    }
                    width="100%"
                    maxLines={4}
                    sx={{
                      "& .MuiInputBase-root": {
                        backgroundColor: isDarkMode ? "var(--drs-bg-input, #1a1a1a)" : undefined,
                        color: isDarkMode ? "var(--drs-text-primary, #ffffff)" : undefined,
                      },
                      "& .MuiInputBase-input": {
                        color: isDarkMode ? "var(--drs-text-primary, #ffffff)" : undefined,
                      },
                    }}
                  />
                </HBox>
              </HBox>

              {/* Info about number of accounts */}
              <HBox sx={{ ...transparentSurface, width: "100%" }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    p: 1.5,
                    bgcolor: isDarkMode 
                      ? alpha(colors.primary, 0.08) 
                      : alpha(theme.palette.info.main, 0.04),
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: isDarkMode 
                      ? alpha(colors.primaryLight, 0.15) 
                      : alpha(theme.palette.info.main, 0.15),
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    width: "100%",
                    color: isDarkMode ? "var(--drs-text-secondary, #94a3b8)" : "text.secondary",
                  }}
                >
                  <span style={{ fontSize: 16 }}>ℹ️</span>
                  {intl.formatMessage(
                    {
                      id: "label.memo.bulk.info",
                      defaultMessage: "The memo will be added to all {count} selected account(s).",
                    },
                    { count: selectedAccounts.length }
                  )}
                </Typography>
              </HBox>
            </HBox>
          </HBox>
        </HPaper>
      </HBox>
        <HButtonBar
          onSave={handleSubmit}
          onReset={resetForm}
          onClose={onCancel}
          saveLabel={
            saving
              ? intl.formatMessage({
                  id: "button.saving",
                  defaultMessage: "Saving...",
                })
              : intl.formatMessage(
                  {
                    id: "button.addMemo",
                    defaultMessage: "Add Memo",
                  }
                )
          }
          saveDisabled={saving || !notes.trim() || !interactionType}
          saveLoading={saving}
        />
      </HBox>
  );
}
