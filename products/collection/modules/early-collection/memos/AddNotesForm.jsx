import React, { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useTheme } from "@mui/material/styles";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { HBox, HCheckBox, HDropdown, HLabel, HPaper, HTextarea, useDrsTheme, HAxiosService } from "@helix/component-library";

import { MemosAPI } from "../apiEndpoints";

import { memosFontFamily, memosTextSx } from "./memosStyles";
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

/**
 * @param {object} props
 * @param {string} props.accountCustLevel
 * @param {(v: string) => void} props.setAccountCustLevel
 * @param {string} props.interactionType
 * @param {(v: string) => void} props.setInteractionType
 * @param {boolean} props.isSticky
 * @param {(v: boolean) => void} props.setIsSticky
 * @param {string} props.notes
 * @param {(v: string) => void} props.setNotes
 * @param {string | null} props.stickyPreviewText
 */
export default function AddNotesForm({
  accountCustLevel,
  setAccountCustLevel,
  interactionType,
  setInteractionType,
  isSticky,
  setIsSticky,
  notes,
  setNotes,
  stickyPreviewText,
}) {
  const intl = useIntl();
  const theme = useTheme();
  const { themeVars, surfaces, text, border } = useDrsTheme();
  const [interactionOptions, setInteractionOptions] = useState([]);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  const stickyBannerSx = useMemo(
    () => ({
      mb: 0,
      mt: 0.25,
      px: 1.25,
      py: 0.75,
      width: "100%",
      borderRadius: "5px",
      border: 1,
      borderColor: theme.palette.warning.main,
      bgcolor: theme.palette.mode === "dark" ? surfaces.paper : "#fff",
      boxShadow: "none",
    }),
    [surfaces.paper, theme]
  );

  const levelOptions = useMemo(
    () => [
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
    ],
    [intl]
  );

  useEffect(() => {
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

  const levelHint =
    accountCustLevel === "A"
      ? intl.formatMessage({ id: "label.memos.levelHint.account" })
      : intl.formatMessage({ id: "label.memos.levelHint.customer" });
  const stickyNoteText =
    stickyPreviewText || intl.formatMessage({ id: "label.memos.noLatestStickyNote" });

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

  const formGridSx = {
    ...transparentSurface,
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
    columnGap: 2,
    rowGap: 2.25,
    width: "100%",
  };

  const fieldStackSx = {
    ...transparentSurface,
    display: "flex",
    flexDirection: "column",
    gap: 0.5,
    minWidth: 0,
  };

  return (
    <HPaper
      elevation={0}
      sx={{
        ...themeVars,
        borderRadius: "8px",
        border: 1,
        borderColor: "divider",
        bgcolor: surfaces.paper,
        width: "100%",
        overflow: "hidden",
      }}
    >
      <HBox sx={{ ...transparentSurface, px: 2, py: 2.25, width: "100%" }}>
        <HBox sx={formGridSx}>
          <HBox sx={fieldStackSx}>
            <HLabel
              value="label.memos.field.level"
              translate
              colon={false}
              align="left"
              required
            />
            <HDropdown
              name="accountCustLevel"
              value={accountCustLevel}
              onChange={(e) => setAccountCustLevel(e.target.value)}
              options={levelOptions}
              placeholder={intl.formatMessage({ id: "label.memos.level.placeholder" })}
              width="100%"
              StartIcon={AccountCircleOutlinedIcon}
            />
            <HBox component="p" sx={{ m: 0, mt: 0.25, ...memosTextSx, color: text.secondary }}>
              {levelHint}
            </HBox>
          </HBox>

          <HBox sx={fieldStackSx}>
            <HLabel
              value="label.Memos.Interaction Type"
              translate
              colon={false}
              align="left"
            />
            <HDropdown
              name="interactionType"
              value={interactionType}
              onChange={(e) => setInteractionType(e.target.value)}
              options={interactionOptions}
              placeholder={intl.formatMessage({ id: "label.memos.interaction.placeholder" })}
              width="100%"
            />
          </HBox>

          <HBox sx={fieldStackSx}>
            <HLabel value="label.memos.options" translate colon={false} align="left" />
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

          <HBox sx={{ ...transparentSurface, gridColumn: "1 / -1", minWidth: 0 }}>
            <HBox
              sx={{
                ...transparentSurface,
                width: "100%",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >

              {isSticky ? (
                <HPaper elevation={0} sx={stickyBannerSx}>
                  <HBox sx={{ ...transparentSurface, flexDirection: "column", alignItems: "stretch", gap: 0.5 }}>
                    <HBox
                      component="p"
                      sx={{
                        fontSize: "11px",
                        fontFamily: memosFontFamily,
                        fontWeight: 600,
                        m: 0,
                        color: theme.palette.warning.dark,
                      }}
                    >
                      {intl.formatMessage({ id: "label.memos.latestStickyTitle" })}
                    </HBox>
                    <HBox
                      component="p"
                      sx={{
                        fontSize: "11px",
                        fontFamily: memosFontFamily,
                        m: 0,
                        fontStyle: "italic",
                        color: theme.palette.warning.dark,
                      }}
                    >
                      &quot;{stickyNoteText}&quot;
                    </HBox>
                  </HBox>
                </HPaper>
              ) : null}
            </HBox>
          </HBox>
          <HBox sx={{ ...transparentSurface, gridColumn: "1 / -1", minWidth: 0 }}>
            <HBox sx={{ ...transparentSurface, width: "100%" }}>
              <HLabel
                value="label.Memos.Notes"
                translate
                colon={false}
                align="left"
                required
              />
              <HTextarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isSticky ? "label.memos.notes.placeholder.sticky" : "label.memos.notes.placeholder"}
                width="100%"
                maxLines={4}
              />
            </HBox>
          </HBox>
        </HBox>
      </HBox>
    </HPaper>
  );
}
