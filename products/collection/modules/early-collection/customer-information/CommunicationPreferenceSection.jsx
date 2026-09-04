import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { HBox, HButtonBar, HDropdown, HTextField, HCheckBox, HLabel, HPaper, HAxiosService, useToast } from "@helix/component-library";

import Notifications from "@mui/icons-material/Notifications";
import { useIntl } from "react-intl";

import { useSelector } from "react-redux";

import { CommunicationpreferencesAPI } from "../apiEndpoints";
import { handleValidationErrors } from "../ValidationUtils.jsx";
import { useLocation } from "react-router-dom";

// ========================================
// HARDCODED CHANNELS (Similar to hardcoded languages)
// Display Name ↔ API Code mapping
// ========================================

// ✓ CORRECTED: API codes match actual backend response
const HARDCODED_CHANNELS = [
  { displayName: "Email", apiCode: "E" },              // API returns "E"
  { displayName: "SMS", apiCode: "S" },                // API returns "S"
  { displayName: "Call", apiCode: "C" },               // API returns "C"
  { displayName: "Voice Broadcast", apiCode: "B" },    // API returns "B"
];

// Map display name to API code
const displayNameToApiCode = (displayName) => {
  const channel = HARDCODED_CHANNELS.find(
    (ch) => String(ch.displayName).toLowerCase() === String(displayName).toLowerCase()
  );
  return channel ? channel.apiCode : String(displayName).toUpperCase();
};

// Map API code to display name
const apiCodeToDisplayName = (apiCode) => {
  const channel = HARDCODED_CHANNELS.find(
    (ch) => String(ch.apiCode).toUpperCase() === String(apiCode).toUpperCase()
  );
  return channel ? channel.displayName : apiCode;
};

// ========================================
// LANGUAGE MAPPING (Same as before - hardcoded)
// ========================================

const LANGUAGE_CODE_MAP = {
  english: "E",
  hindi: "H",
  marathi: "M",
};

const LANGUAGE_DESC_MAP = {
  english: "English",
  hindi: "Hindi",
  marathi: "Marathi",
};

const serializeLanguageCode = (language) => LANGUAGE_CODE_MAP[String(language).toLowerCase()] || "";
const serializeLanguageDesc = (language) => LANGUAGE_DESC_MAP[String(language).toLowerCase()] || "";

// ========================================
// TIME & DAYS FORMATTING
// ========================================

const formatBestTimeForInput = (value) => {
  if (!value) return "";
  return String(value).trim();
};

const serializeBestTime = (value) => {
  if (!value) return "";
  return String(value).trim();
};

const formatDays = (days) => DAY_KEYS.map((key) => (days[key] ? "1" : "0")).join("");

const parseDays = (szDays) => {
  const normalized = String(szDays || "").padEnd(7, "0").slice(0, 7);
  return {
    mon: normalized[0] === "1",
    tue: normalized[1] === "1",
    wed: normalized[2] === "1",
    thu: normalized[3] === "1",
    fri: normalized[4] === "1",
    sat: normalized[5] === "1",
    sun: normalized[6] === "1",
  };
};

// ========================================
// DRAFT CREATION & MAPPING
// ========================================

function makeDefaultDraft() {
  const defaultDays = {
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false,
  };

  return {
    language: "",
    contactNo: "",
    emailId: "",
    // ✓ Create 4 hardcoded channels
    channels: HARDCODED_CHANNELS.map((channel) => ({
      displayName: channel.displayName,    // "Email", "SMS", "Call", "Voice Broadcast"
      apiCode: channel.apiCode,            // "EMAIL", "S", "CALL", "VOICE"
      allow: false,
      bestTime: "",
      days: { ...defaultDays },
      lnActivitySeqNo: null,
      lnCommPrefSeqNo: null,
      lnReferenceNo: null,
      szDays: "",
      szPartitionCode: "",
      szReferenceType: "",
    })),
  };
}

function cloneDraft(d) {
  const draft = d && typeof d === "object" ? JSON.parse(JSON.stringify(d)) : {};
  const normalized = {
    ...makeDefaultDraft(),
    ...draft,
    channels: Array.isArray(draft.channels) ? draft.channels : makeDefaultDraft().channels,
  };
  return normalized;
}

/**
 * Map API response to draft
 * API sends: szCommunicationType (codes like "EMAIL", "S", "CALL", "VOICE")
 * Map to: displayName (hardcoded like "Email", "SMS", "Call", "Voice Broadcast")
 */
function mapResponseToDraft(responseDto) {
  if (!responseDto) return makeDefaultDraft();

  const base = makeDefaultDraft();
  const contactNo = responseDto.szPrefContactNo || "";
  const emailId = responseDto.szPrefEmailId || "";

  // ✓ Create all 4 channels (from hardcoded list)
  const channels = HARDCODED_CHANNELS.map((channel) => {
    // Find matching channel in API response by API code
    const apiChannelData = (responseDto.communicationChannels || []).find(
      (ch) => String(ch.szCommunicationType || "").toUpperCase() === String(channel.apiCode).toUpperCase()
    );

    if (apiChannelData && String(apiChannelData.szAllowedYN || "").toUpperCase() === "Y") {
      // ✓ Channel found and allowed - show as checked with data
      const days = parseDays(apiChannelData.szDays || "");
      return {
        displayName: channel.displayName,        // "Email" (hardcoded display)
        apiCode: channel.apiCode,                // "EMAIL" (from API)
        allow: true,                             // ✓ CHECKED
        bestTime: formatBestTimeForInput(apiChannelData.szBestTime || ""),  // ENABLED
        days: { ...days },                       // ENABLED
        lnActivitySeqNo: apiChannelData.lnActivitySeqNo || null,
        lnCommPrefSeqNo: apiChannelData.lnCommPrefSeqNo || null,
        lnReferenceNo: apiChannelData.lnReferenceNo || null,
        szDays: apiChannelData.szDays || "",
        szPartitionCode: apiChannelData.szPartitionCode || "",
        szReferenceType: apiChannelData.szReferenceType || "",
      };
    } else {
      // ✗ Channel not found or not allowed - show as unchecked
      return {
        displayName: channel.displayName,        // "Email" (hardcoded display)
        apiCode: channel.apiCode,                // "EMAIL" (API code)
        allow: false,                            // ✗ UNCHECKED
        bestTime: "",                            // DISABLED
        days: { ...base.channels[0].days },      // DISABLED
        lnActivitySeqNo: null,
        lnCommPrefSeqNo: null,
        lnReferenceNo: null,
        szDays: "",
        szPartitionCode: "",
        szReferenceType: "",
      };
    }
  });

  // Language from template indicator
  const language = (() => {
    const descRaw = responseDto.szPrefTmplIndicatorDesc || "";
    const desc = String(descRaw).trim().toLowerCase();

    if (desc === "english" || desc.includes("english")) return "english";
    if (desc === "hindi" || desc.includes("hindi")) return "hindi";
    if (desc === "marathi" || desc.includes("marathi")) return "marathi";

    const code = (responseDto.szPrefTmplIndicator || "").toString().trim().toUpperCase();
    const codeMap = { E: "english", H: "hindi", M: "marathi" };
    return codeMap[code] || "";
  })();

  return {
    language,
    contactNo,
    emailId,
    channels,
  };
}

const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const emailOk = (v) => {
  if (!v || !String(v).trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
};

// ========================================
// MAIN COMPONENT
// ========================================

export default function CommunicationPreferenceSection({ initialDraft, customerId, customer, selectedRow }) {
  const intl = useIntl();
  const toast = useToast();
  const { selectedRow: accountSelectedRow } = useSelector((state) => state.account);
  const [draft, setDraft] = useState(() => cloneDraft(initialDraft));
  const [savedSnapshot, setSavedSnapshot] = useState(() => cloneDraft(initialDraft));
  const [errors, setErrors] = useState({});

  const sourceRow = selectedRow || accountSelectedRow;
  const canFetchPreferences = Boolean(sourceRow && customer);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  useEffect(() => {
    const next = cloneDraft(initialDraft);
    setDraft(next);
    setSavedSnapshot(cloneDraft(initialDraft));
    setErrors({});
  }, [customerId, initialDraft]);

  useEffect(() => {
    if (!canFetchPreferences) return;

    const fetchPreferences = async () => {
      try {
        console.log("menuId", screenMenuId);
        const res = await HAxiosService.GET(
          CommunicationpreferencesAPI.fetchCommunicationPreferences(screenMenuId),
        );

        const payload = res?.data;
        const responseJson = payload?.responseJson ?? payload?.data;
        const responseDto = Array.isArray(responseJson) ? responseJson[0] : responseJson;

        if (payload?.status === "Failure" && payload?.message === "Validation Failed") {
          handleValidationErrors(intl, toast, payload.responseJson);
          return;
        }

        if ((payload?.status === 200 || payload?.status === "Success") && responseDto) {
          // ✓ Map response to draft (all 4 channels reconstructed)
          const mappedDraft = mapResponseToDraft(responseDto);
          setDraft(mappedDraft);
          setSavedSnapshot(cloneDraft(mappedDraft));
        } else {
          const defaultDraft = makeDefaultDraft();
          setDraft(defaultDraft);
          setSavedSnapshot(cloneDraft(defaultDraft));
        }
      } catch (error) {
        console.error("Error fetching communication preferences:", error);
        toast.error("Failed to fetch communication preferences");
      }
    };

    fetchPreferences();
  }, [canFetchPreferences, intl, toast]);

  // ✓ Hardcoded language options (same as before)
  const languageOptions = useMemo(
    () => [
      { value: "english", label: intl.formatMessage({ id: "label.customerInformation.comm.lang.english" }) },
      { value: "hindi", label: intl.formatMessage({ id: "label.customerInformation.comm.lang.hindi" }) },
      { value: "marathi", label: intl.formatMessage({ id: "label.customerInformation.comm.lang.marathi" }) },
    ],
    [intl]
  );

  const dayHeaderIds = useMemo(
    () => ({
      mon: "label.customerInformation.comm.day.mon",
      tue: "label.customerInformation.comm.day.tue",
      wed: "label.customerInformation.comm.day.wed",
      thu: "label.customerInformation.comm.day.thu",
      fri: "label.customerInformation.comm.day.fri",
      sat: "label.customerInformation.comm.day.sat",
      sun: "label.customerInformation.comm.day.sun",
    }),
    []
  );

  const setField = useCallback((name, value) => {
    setDraft((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setChannelRow = useCallback((idx, patch) => {
    setDraft((prev) => {
      const channels = [...prev.channels];
      channels[idx] = { ...channels[idx], ...patch };
      return { ...prev, channels };
    });
  }, []);

  const setChannelDay = useCallback((idx, day, checked) => {
    setDraft((prev) => {
      const channels = [...prev.channels];
      const row = { ...channels[idx] };
      row.days = { ...row.days, [day]: checked };
      channels[idx] = row;
      return { ...prev, channels };
    });
  }, []);

  const validate = useCallback(() => {
    const next = {};
    if (!draft.language) {
      next.language = intl.formatMessage({ id: "label.customerInformation.validation.language" });
    }
    if (!draft.channels.some((c) => c.allow)) {
      next.channel = intl.formatMessage({ id: "label.customerInformation.validation.channel" });
    }
    if (!emailOk(draft.emailId)) {
      next.email = intl.formatMessage({ id: "label.customerInformation.validation.email" });
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [draft, intl]);

  const handleSave = useCallback(async () => {
    if (!validate()) return;

    try {
      const allowedChannels = draft.channels.filter((c) => c.allow);

      if (allowedChannels.length === 0) {
        toast.error("Please select at least ONE communication channel");
        return;
      }

      // ✓ Build payload with API codes (from hardcoded mapping)
      const channelPayload = allowedChannels.map((channel) => ({
        lnActivitySeqNo: channel.lnActivitySeqNo,
        lnCommPrefSeqNo: channel.lnCommPrefSeqNo,
        lnReferenceNo: channel.lnReferenceNo,
        szCommunicationType: channel.apiCode,  // ✓ Send API code (EMAIL, S, CALL, VOICE)
        szBestTime: serializeBestTime(channel.bestTime),
        szDays: channel.szDays || formatDays(channel.days),
        szPartitionCode: channel.szPartitionCode || "",
        szReferenceType: channel.szReferenceType || "C",
        szAllowedYN: channel.allow ? "Y" : "N",
        szMon: channel.days.mon ? "Y" : "N",
        szTue: channel.days.tue ? "Y" : "N",
        szWed: channel.days.wed ? "Y" : "N",
        szThu: channel.days.thu ? "Y" : "N",
        szFri: channel.days.fri ? "Y" : "N",
        szSat: channel.days.sat ? "Y" : "N",
        szSun: channel.days.sun ? "Y" : "N",
      }));

      const savePayload = {
        communicationPreferencesDto: {
          szPrefContactNo: draft.contactNo,
          szPrefEmailId: draft.emailId,
          szPrefTmplIndicator: serializeLanguageCode(draft.language),  // Language code (E, H, M)
          szPrefTmplIndicatorDesc: serializeLanguageDesc(draft.language),  // Language desc (English, हिंदी, मराठी)
          communicationChannels: channelPayload,  // Only allowed channels
        },
      };

      console.log("DEBUG: Save payload:", savePayload);

      const res = await HAxiosService.POST(
        CommunicationpreferencesAPI.saveCommunicationPreferences(screenMenuId),
        savePayload
      );

      setSavedSnapshot(cloneDraft(draft));
      toast.success(intl.formatMessage({ id: "label.customerInformation.toast.saveSuccess" }));

      return res;
    } catch (error) {
      console.error("Error saving communication preferences:", error);
      toast.error(intl.formatMessage({ id: "label.customerInformation.toast.saveError" }));
    }
  }, [draft, intl, toast, validate]);

  const handleReset = useCallback(() => {
    setDraft(cloneDraft(savedSnapshot));
    setErrors({});
  }, [savedSnapshot]);

  return (
    <>
      <HPaper variant="outlined" elevation={0} sx={{ borderRadius: 2, borderColor: "divider", p: 2, mb: 2 }}>
        <HBox sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 2 }}>
          <Notifications sx={{ fontSize: 18, color: "primary.main" }} />
          <Typography variant="subtitle2" sx={{ fontSize: 12, fontWeight: 600 }}>
            {intl.formatMessage({ id: "label.customerInformation.section.communication" })}
          </Typography>
        </HBox>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <HLabel value={intl.formatMessage({ id: "label.customerInformation.comm.language" })} align="left" />
            <HBox sx={{ mt: 0.5 }}>
              <HDropdown
                name="language"
                align="left"
                options={languageOptions}
                value={draft.language}
                onChange={(e) => setField("language", e.target.value)}
                width="100%"
                error={Boolean(errors.language)}
              />
            </HBox>
            {errors.language ? (
              <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>
                {errors.language}
              </Typography>
            ) : null}
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <HLabel value={intl.formatMessage({ id: "label.customerInformation.comm.contactNo" })} align="left" />
            <HBox sx={{ mt: 0.5 }}>
              <HTextField
                value={draft.contactNo}
                editable
                align="left"
                onChange={(e) => setField("contactNo", e.target.value)}
                width="100%"
              />
            </HBox>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <HLabel value={intl.formatMessage({ id: "label.customerInformation.comm.emailId" })} align="left" />
            <HBox sx={{ mt: 0.5 }}>
              <HTextField
                value={draft.emailId}
                editable
                onChange={(e) => setField("emailId", e.target.value)}
                width="100%"
                error={Boolean(errors.email)}
              />
            </HBox>
            {errors.email ? (
              <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>
                {errors.email}
              </Typography>
            ) : null}
          </Grid>
        </Grid>

        <TableContainer>
          <Table size="small" sx={{ "& .MuiTableCell-root": { fontSize: 11, py: 0.75 } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: 10 }}>
                  {intl.formatMessage({ id: "label.customerInformation.comm.mailType" })}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, fontSize: 10, width: 56 }}>
                  {intl.formatMessage({ id: "label.customerInformation.comm.allow" })}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: 10, minWidth: 100 }}>
                  {intl.formatMessage({ id: "label.customerInformation.comm.bestTime" })}
                </TableCell>
                {DAY_KEYS.map((d) => (
                  <TableCell key={d} align="center" sx={{ fontWeight: 600, fontSize: 10, px: 0.5 }}>
                    {intl.formatMessage({ id: dayHeaderIds[d] })}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {draft.channels.map((row, idx) => (
                <TableRow key={row.apiCode}>
                  {/* ✓ Display hardcoded name (Email, SMS, Call, Voice Broadcast) */}
                  <TableCell sx={{ fontWeight: 600 }}>{row.displayName}</TableCell>

                  <TableCell align="center">
                    <HCheckBox
                      checked={row.allow}
                      onChange={(e) => {
                        if (!e.target.checked) {
                          setChannelRow(idx, {
                            allow: false,
                            bestTime: "",
                            days: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
                          });
                        } else {
                          setChannelRow(idx, { allow: true });
                        }
                      }}
                      label=""
                      margin="0"
                    />
                  </TableCell>

                  <TableCell sx={{ verticalAlign: "middle", px: 1, display: "flex", alignItems: "center" }}>
                    <HTextField
                      type="time"
                      value={row.bestTime || ""}
                      editable={row.allow}
                      disabled={!row.allow}
                      onChange={(e) => setChannelRow(idx, { bestTime: e.target.value })}
                      width="100%"
                      placeholder={row.allow ? "HH:MM" : "---"}
                    />
                  </TableCell>

                  {DAY_KEYS.map((d) => (
                    <TableCell key={d} align="center">
                      <HCheckBox
                        checked={Boolean(row.days?.[d])}
                        disabled={!row.allow}
                        onChange={(e) => {
                          if (row.allow) {
                            setChannelDay(idx, d, e.target.checked);
                          }
                        }}
                        label=""
                        margin="0"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </HPaper>

      <HButtonBar onSave={handleSave} onReset={handleReset} disableToast={{ save: true, reset: true }} />
    </>
  );
}
